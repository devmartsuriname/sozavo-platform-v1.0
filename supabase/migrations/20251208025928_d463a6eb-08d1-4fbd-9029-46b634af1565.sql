-- Step 1: Insert the logged-in user into public.users table (no conflict clause)
INSERT INTO public.users (id, auth_user_id, email, full_name, is_active, created_at, updated_at)
SELECT 
  '3042f38c-c8fd-4eb5-88fd-2df493db188f',
  '3042f38c-c8fd-4eb5-88fd-2df493db188f',
  'info@devmart.sr',
  'System Administrator',
  true,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.users WHERE auth_user_id = '3042f38c-c8fd-4eb5-88fd-2df493db188f'
);

-- Step 2: Assign system_admin role to this user
INSERT INTO public.user_roles (user_id, role)
SELECT '3042f38c-c8fd-4eb5-88fd-2df493db188f', 'system_admin'
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = '3042f38c-c8fd-4eb5-88fd-2df493db188f' AND role = 'system_admin'
);

-- Step 3: Update verify_case_document to use get_user_internal_id()
CREATE OR REPLACE FUNCTION public.verify_case_document(p_document_id uuid, p_new_status document_status, p_reason text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_actor UUID;
  v_old_status document_status;
  v_case_id UUID;
  v_file_name TEXT;
  v_document_type document_type;
  v_actor_roles app_role[];
  v_updated_at TIMESTAMPTZ;
BEGIN
  -- 1. Get actor from internal users table (not auth.uid directly)
  v_actor := public.get_user_internal_id();
  
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'User profile not found. Please ensure your user account is properly configured.';
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
      WHEN p_new_status = 'verified' THEN NULL
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
$function$;

-- Step 4: Update perform_case_transition to use get_user_internal_id()
CREATE OR REPLACE FUNCTION public.perform_case_transition(p_case_id uuid, p_target_status case_status, p_reason text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_actor_id UUID;
  v_old_status case_status;
  v_new_status case_status;
  v_updated_at TIMESTAMPTZ;
  v_actor_roles app_role[];
  v_is_reopen BOOLEAN;
  v_is_hold_transition BOOLEAN;
  v_is_payment_transition BOOLEAN;
  v_event_meta JSONB;
BEGIN
  -- 1. Get actor ID from internal users table (not auth.uid directly)
  v_actor_id := public.get_user_internal_id();
  
  IF v_actor_id IS NULL THEN
    RAISE EXCEPTION 'User profile not found. Please ensure your user account is properly configured.';
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

  -- 5. Determine transition type flags
  v_is_reopen := (v_old_status IN ('approved', 'rejected') AND p_target_status = 'under_review');
  v_is_hold_transition := (p_target_status = 'on_hold' OR v_old_status = 'on_hold');
  v_is_payment_transition := (
    (v_old_status = 'approved' AND p_target_status = 'payment_pending') OR
    (v_old_status = 'payment_pending' AND p_target_status = 'payment_processed')
  );

  -- 6. Update the case status
  UPDATE public.cases
  SET 
    current_status = p_target_status,
    updated_at = NOW()
  WHERE id = p_case_id
  RETURNING current_status, updated_at INTO v_new_status, v_updated_at;

  -- 7. Build event metadata with transition type flags
  v_event_meta := jsonb_build_object(
    'reason', p_reason,
    'is_reopen', v_is_reopen,
    'is_hold_transition', v_is_hold_transition,
    'is_payment_transition', v_is_payment_transition,
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
$function$;