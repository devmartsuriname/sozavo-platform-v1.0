-- Phase 9D-2F: Seed Workflow Definitions Test Data
-- This migration adds sample workflow transitions for the three service types

-- Get service type IDs
DO $$
DECLARE
  ab_id uuid;
  fb_id uuid;
  kb_id uuid;
BEGIN
  -- Get service type IDs
  SELECT id INTO ab_id FROM service_types WHERE code = 'AB';
  SELECT id INTO fb_id FROM service_types WHERE code = 'FB';
  SELECT id INTO kb_id FROM service_types WHERE code = 'KB';

  -- Only insert if we have service types and no existing workflow definitions
  IF ab_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM workflow_definitions LIMIT 1) THEN
    -- AB (Algemene Bijstand) workflow transitions
    INSERT INTO workflow_definitions (service_type_id, from_status, to_status, required_role, is_active)
    VALUES
      (ab_id, 'intake', 'under_review', 'case_handler', true),
      (ab_id, 'under_review', 'approved', 'case_reviewer', true),
      (ab_id, 'under_review', 'rejected', 'case_reviewer', true);

    -- FB (Financiële Bijstand) workflow transitions
    INSERT INTO workflow_definitions (service_type_id, from_status, to_status, required_role, is_active)
    VALUES
      (fb_id, 'intake', 'under_review', 'case_handler', true),
      (fb_id, 'under_review', 'approved', 'case_reviewer', true);

    -- KB (Kinderbijslag) workflow transitions
    INSERT INTO workflow_definitions (service_type_id, from_status, to_status, required_role, is_active)
    VALUES
      (kb_id, 'intake', 'under_review', 'case_handler', true),
      (kb_id, 'under_review', 'approved', 'case_reviewer', true);
  END IF;
END $$;