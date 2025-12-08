-- Phase 10 Step 4: Document Verification Mutation Functions
-- Implements secure document status transitions with audit logging

-- ============================================================
-- Function: validate_document_verification
-- Purpose: Validate user permissions and allowed transitions
-- ============================================================
CREATE OR REPLACE FUNCTION public.validate_document_verification(
  p_document_id UUID,
  p_new_status document_status,
  p_reason TEXT,
  p_actor UUID
)
RETURNS VOID
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_current_status document_status;
  v_actor_roles app_role[];
BEGIN
  -- 1. Fetch document status
  SELECT status INTO v_current_status
  FROM public.documents
  WHERE id = p_document_id;

  IF v_current_status IS NULL THEN
    RAISE EXCEPTION 'Document not found';
  END IF;

  -- 2. Get actor roles
  SELECT COALESCE(ARRAY_AGG(role), ARRAY[]::app_role[])
  INTO v_actor_roles
  FROM public.user_roles
  WHERE user_id = p_actor;

  IF ARRAY_LENGTH(v_actor_roles, 1) IS NULL OR ARRAY_LENGTH(v_actor_roles, 1) = 0 THEN
    RAISE EXCEPTION 'User has no assigned roles';
  END IF;

  -- 3. Validate transitions based on current status and target status
  CASE
    -- D001: pending → verified
    WHEN v_current_status = 'pending' AND p_new_status = 'verified' THEN
      IF NOT (
        'case_reviewer' = ANY(v_actor_roles) OR
        'department_head' = ANY(v_actor_roles) OR
        'system_admin' = ANY(v_actor_roles)
      ) THEN
        RAISE EXCEPTION 'User not authorized to verify documents';
      END IF;

    -- D002: pending → rejected (reason required)
    WHEN v_current_status = 'pending' AND p_new_status = 'rejected' THEN
      IF NOT (
        'case_reviewer' = ANY(v_actor_roles) OR
        'department_head' = ANY(v_actor_roles) OR
        'system_admin' = ANY(v_actor_roles)
      ) THEN
        RAISE EXCEPTION 'User not authorized to reject documents';
      END IF;
      IF p_reason IS NULL OR LENGTH(TRIM(p_reason)) = 0 THEN
        RAISE EXCEPTION 'Reason required for document rejection';
      END IF;

    -- D003: rejected → verified (re-verify, higher privilege)
    WHEN v_current_status = 'rejected' AND p_new_status = 'verified' THEN
      IF NOT (
        'department_head' = ANY(v_actor_roles) OR
        'system_admin' = ANY(v_actor_roles)
      ) THEN
        RAISE EXCEPTION 'Only department_head or system_admin may re-verify a rejected document';
      END IF;

    -- D004: verified → pending (undo verification, higher privilege)
    WHEN v_current_status = 'verified' AND p_new_status = 'pending' THEN
      IF NOT (
        'department_head' = ANY(v_actor_roles) OR
        'system_admin' = ANY(v_actor_roles)
      ) THEN
        RAISE EXCEPTION 'Only department_head or system_admin may undo document verification';
      END IF;

    -- All other transitions are forbidden
    ELSE
      RAISE EXCEPTION 'Invalid document status transition: % → %', v_current_status, p_new_status;
  END CASE;

  -- If we reach here, validation passed
END;
$$;

-- ============================================================
-- RPC Function: verify_case_document
-- Purpose: Perform document status mutation & audit logging
-- ============================================================
CREATE OR REPLACE FUNCTION public.verify_case_document(
  p_document_id UUID,
  p_new_status document_status,
  p_reason TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_actor UUID;
  v_old_status document_status;
  v_case_id UUID;
  v_file_name TEXT;
  v_document_type document_type;
  v_actor_roles app_role[];
  v_updated_at TIMESTAMPTZ;
BEGIN
  -- 1. Get actor from auth context
  v_actor := auth.uid();
  
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- 2. Fetch document info
  SELECT case_id, status, file_name, document_type
  INTO v_case_id, v_old_status, v_file_name, v_document_type
  FROM public.documents
  WHERE id = p_document_id;

  IF v_old_status IS NULL THEN
    RAISE EXCEPTION 'Document not found';
  END IF;

  -- 3. Validate the transition (will raise exception if invalid)
  PERFORM public.validate_document_verification(p_document_id, p_new_status, p_reason, v_actor);

  -- 4. Get actor roles for audit
  SELECT COALESCE(ARRAY_AGG(role), ARRAY[]::app_role[])
  INTO v_actor_roles
  FROM public.user_roles
  WHERE user_id = v_actor;

  -- 5. Update document status
  UPDATE public.documents
  SET 
    status = p_new_status,
    rejection_reason = CASE 
      WHEN p_new_status = 'rejected' THEN p_reason 
      WHEN p_new_status = 'verified' THEN NULL  -- Clear rejection reason on verify
      ELSE rejection_reason 
    END,
    verified_by = CASE 
      WHEN p_new_status = 'verified' THEN v_actor 
      ELSE NULL 
    END,
    verified_at = CASE 
      WHEN p_new_status = 'verified' THEN NOW() 
      ELSE NULL 
    END,
    updated_at = NOW()
  WHERE id = p_document_id
  RETURNING updated_at INTO v_updated_at;

  -- 6. Insert audit event into case_events
  INSERT INTO public.case_events (
    case_id,
    event_type,
    actor_id,
    meta,
    created_at
  ) VALUES (
    v_case_id,
    'document_verification',
    v_actor,
    jsonb_build_object(
      'document_id', p_document_id,
      'document_type', v_document_type,
      'file_name', v_file_name,
      'old_status', v_old_status,
      'new_status', p_new_status,
      'reason', p_reason,
      'actor_roles', TO_JSONB(v_actor_roles),
      'additional_metadata', p_metadata
    ),
    NOW()
  );

  -- 7. Return result
  RETURN jsonb_build_object(
    'document_id', p_document_id,
    'new_status', p_new_status,
    'updated_at', v_updated_at
  );
END;
$$;