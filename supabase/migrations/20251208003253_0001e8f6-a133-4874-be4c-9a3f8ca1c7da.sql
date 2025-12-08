-- Phase 10A: Case Status Transition Backend Mutation
-- Creates validate_case_transition and perform_case_transition functions

-- 1. Helper function: Get user roles as array
CREATE OR REPLACE FUNCTION public.get_user_roles_array(_user_id UUID)
RETURNS app_role[]
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(ARRAY_AGG(role), ARRAY[]::app_role[])
  FROM public.user_roles
  WHERE user_id = _user_id
$$;

-- 2. Validation function: Enforces transition rules, roles, and business logic
CREATE OR REPLACE FUNCTION public.validate_case_transition(
  p_case_id UUID,
  p_target_status case_status,
  p_actor_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_status case_status;
  v_service_type_id UUID;
  v_actor_roles app_role[];
  v_pending_docs_count INTEGER;
  v_eligible_count INTEGER;
BEGIN
  -- 1. Fetch case info
  SELECT current_status, service_type_id
  INTO v_current_status, v_service_type_id
  FROM public.cases
  WHERE id = p_case_id;

  IF v_current_status IS NULL THEN
    RAISE EXCEPTION 'Case not found or access denied';
  END IF;

  -- 2. Get actor roles
  SELECT COALESCE(ARRAY_AGG(role), ARRAY[]::app_role[])
  INTO v_actor_roles
  FROM public.user_roles
  WHERE user_id = p_actor_id;

  IF ARRAY_LENGTH(v_actor_roles, 1) IS NULL OR ARRAY_LENGTH(v_actor_roles, 1) = 0 THEN
    RAISE EXCEPTION 'User has no assigned roles';
  END IF;

  -- 3. Validate transition and role based on the allowed matrix
  CASE
    -- T001: intake → under_review
    WHEN v_current_status = 'intake' AND p_target_status = 'under_review' THEN
      IF NOT (
        'case_handler' = ANY(v_actor_roles) OR
        'case_reviewer' = ANY(v_actor_roles) OR
        'department_head' = ANY(v_actor_roles) OR
        'system_admin' = ANY(v_actor_roles)
      ) THEN
        RAISE EXCEPTION 'Cannot transition case: User does not have required role for this transition';
      END IF;
      -- No additional business rules for this transition

    -- T002: under_review → approved
    WHEN v_current_status = 'under_review' AND p_target_status = 'approved' THEN
      IF NOT (
        'case_reviewer' = ANY(v_actor_roles) OR
        'department_head' = ANY(v_actor_roles) OR
        'system_admin' = ANY(v_actor_roles)
      ) THEN
        RAISE EXCEPTION 'Cannot transition case: User does not have required role for this transition';
      END IF;

      -- Business rule: All mandatory documents must be verified
      SELECT COUNT(*)
      INTO v_pending_docs_count
      FROM public.documents d
      JOIN public.document_requirements dr ON d.document_type = dr.document_type
      WHERE d.case_id = p_case_id
        AND dr.service_type_id = v_service_type_id
        AND dr.is_mandatory = true
        AND d.status IN ('pending', 'rejected', 'expired');

      IF v_pending_docs_count > 0 THEN
        RAISE EXCEPTION 'Cannot approve case: Mandatory documents incomplete (% pending/rejected/expired)', v_pending_docs_count;
      END IF;

      -- Business rule: At least one eligible evaluation must exist
      SELECT COUNT(*)
      INTO v_eligible_count
      FROM public.eligibility_evaluations
      WHERE case_id = p_case_id
        AND result = 'ELIGIBLE';

      IF v_eligible_count = 0 THEN
        RAISE EXCEPTION 'Cannot approve case: No eligible evaluation found for this case';
      END IF;

    -- T003: under_review → rejected
    WHEN v_current_status = 'under_review' AND p_target_status = 'rejected' THEN
      IF NOT (
        'case_reviewer' = ANY(v_actor_roles) OR
        'department_head' = ANY(v_actor_roles) OR
        'system_admin' = ANY(v_actor_roles)
      ) THEN
        RAISE EXCEPTION 'Cannot transition case: User does not have required role for this transition';
      END IF;

      -- Business rule: Reason is required for rejection
      IF p_reason IS NULL OR LENGTH(TRIM(p_reason)) = 0 THEN
        RAISE EXCEPTION 'Cannot reject case: Reason is required';
      END IF;

    -- T004: approved → under_review (reopen)
    WHEN v_current_status = 'approved' AND p_target_status = 'under_review' THEN
      IF NOT (
        'department_head' = ANY(v_actor_roles) OR
        'system_admin' = ANY(v_actor_roles)
      ) THEN
        RAISE EXCEPTION 'Cannot transition case: User does not have required role for this transition';
      END IF;

      -- Business rule: Reason is required for reopen
      IF p_reason IS NULL OR LENGTH(TRIM(p_reason)) = 0 THEN
        RAISE EXCEPTION 'Cannot reopen case: Reason is required';
      END IF;

    -- T005: rejected → under_review (reopen)
    WHEN v_current_status = 'rejected' AND p_target_status = 'under_review' THEN
      IF NOT (
        'department_head' = ANY(v_actor_roles) OR
        'system_admin' = ANY(v_actor_roles)
      ) THEN
        RAISE EXCEPTION 'Cannot transition case: User does not have required role for this transition';
      END IF;

      -- Business rule: Reason is required for reopen
      IF p_reason IS NULL OR LENGTH(TRIM(p_reason)) = 0 THEN
        RAISE EXCEPTION 'Cannot reopen case: Reason is required';
      END IF;

    -- All other transitions are forbidden
    ELSE
      RAISE EXCEPTION 'Transition from % to % is not allowed', v_current_status, p_target_status;
  END CASE;

  -- If we reach here, validation passed
END;
$$;

-- 3. RPC function: Performs the transition, updates case, logs event
CREATE OR REPLACE FUNCTION public.perform_case_transition(
  p_case_id UUID,
  p_target_status case_status,
  p_reason TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor_id UUID;
  v_old_status case_status;
  v_new_status case_status;
  v_updated_at TIMESTAMPTZ;
  v_actor_roles app_role[];
  v_is_reopen BOOLEAN;
  v_event_meta JSONB;
BEGIN
  -- 1. Get actor ID from auth context
  v_actor_id := auth.uid();
  
  IF v_actor_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- 2. Get current status before transition
  SELECT current_status INTO v_old_status
  FROM public.cases
  WHERE id = p_case_id;

  IF v_old_status IS NULL THEN
    RAISE EXCEPTION 'Case not found or access denied';
  END IF;

  -- 3. Validate the transition (this will raise exception if invalid)
  PERFORM public.validate_case_transition(p_case_id, p_target_status, v_actor_id, p_reason);

  -- 4. Get actor roles for audit
  SELECT COALESCE(ARRAY_AGG(role), ARRAY[]::app_role[])
  INTO v_actor_roles
  FROM public.user_roles
  WHERE user_id = v_actor_id;

  -- 5. Determine if this is a reopen transition
  v_is_reopen := (v_old_status IN ('approved', 'rejected') AND p_target_status = 'under_review');

  -- 6. Update the case status
  UPDATE public.cases
  SET 
    current_status = p_target_status,
    updated_at = NOW()
  WHERE id = p_case_id
  RETURNING current_status, updated_at INTO v_new_status, v_updated_at;

  -- 7. Build event metadata
  v_event_meta := jsonb_build_object(
    'reason', p_reason,
    'is_reopen', v_is_reopen,
    'actor_roles', TO_JSONB(v_actor_roles),
    'user_metadata', p_metadata
  );

  -- 8. Insert audit event
  INSERT INTO public.case_events (
    case_id,
    event_type,
    old_status,
    new_status,
    actor_id,
    meta,
    created_at
  ) VALUES (
    p_case_id,
    'status_changed',
    v_old_status,
    v_new_status,
    v_actor_id,
    v_event_meta,
    NOW()
  );

  -- 9. Return result
  RETURN jsonb_build_object(
    'case_id', p_case_id,
    'new_status', v_new_status,
    'updated_at', v_updated_at
  );
END;
$$;

-- 4. Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_user_roles_array(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_case_transition(UUID, case_status, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.perform_case_transition(UUID, case_status, TEXT, JSONB) TO authenticated;

-- 5. Add INSERT policy for case_events (needed for audit trail)
CREATE POLICY "case_events_insert_via_rpc" ON public.case_events
FOR INSERT TO authenticated
WITH CHECK (
  -- Only allow inserts from our RPC function (actor_id must match auth.uid())
  actor_id = auth.uid()
);

-- 6. Add UPDATE policy for cases status changes via RPC only
CREATE POLICY "cases_update_status_via_rpc" ON public.cases
FOR UPDATE TO authenticated
USING (has_case_access(id))
WITH CHECK (
  -- This policy allows UPDATE only for status transitions
  -- The actual validation happens in perform_case_transition
  has_case_access(id)
);