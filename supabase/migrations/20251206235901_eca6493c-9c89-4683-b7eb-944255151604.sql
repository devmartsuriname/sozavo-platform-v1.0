-- Seed eligibility_rules for AB, FB, KB with proper JSONB conditions

-- 1. Algemene Bijstand (AB)
INSERT INTO public.eligibility_rules (
  service_type_id, rule_name, rule_type, is_mandatory, priority, is_active, condition, error_message
) VALUES
  (
    'b2051de5-2aec-47c9-a94e-faeec6230eb2',
    'Age Check',
    'age_check',
    TRUE,
    1,
    TRUE,
    '{"field": "age", "operator": ">=", "value": 18}'::jsonb,
    'Applicant must be at least 18 years old.'
  ),
  (
    'b2051de5-2aec-47c9-a94e-faeec6230eb2',
    'Income Check',
    'income_check',
    TRUE,
    2,
    TRUE,
    '{"field": "income", "operator": "<=", "threshold_key": "program_threshold"}'::jsonb,
    'Household income exceeds the allowed threshold.'
  ),
  (
    'b2051de5-2aec-47c9-a94e-faeec6230eb2',
    'Residency Check',
    'residency_check',
    TRUE,
    3,
    TRUE,
    '{"field": "district", "operator": "in", "value": "supported_districts"}'::jsonb,
    'Applicant is not registered in an eligible district.'
  );

-- 2. Financiële Bijstand (FB)
INSERT INTO public.eligibility_rules (
  service_type_id, rule_name, rule_type, is_mandatory, priority, is_active, condition, error_message
) VALUES
  (
    '03810046-83fc-4a96-b46b-ef842dfeb62c',
    'Income Check',
    'income_check',
    TRUE,
    1,
    TRUE,
    '{"field": "income", "operator": "<=", "threshold_key": "program_threshold"}'::jsonb,
    'Household income exceeds the allowed threshold.'
  ),
  (
    '03810046-83fc-4a96-b46b-ef842dfeb62c',
    'Residency Check',
    'residency_check',
    TRUE,
    2,
    TRUE,
    '{"field": "district", "operator": "in", "value": "supported_districts"}'::jsonb,
    'Applicant is not registered in an eligible district.'
  ),
  (
    '03810046-83fc-4a96-b46b-ef842dfeb62c',
    'Debt / Hardship Check',
    'hardship_check',
    FALSE,
    3,
    TRUE,
    '{"field": "has_documented_hardship", "operator": "=", "value": true}'::jsonb,
    'No documented financial hardship found.'
  );

-- 3. Kinderbijslag (KB)
INSERT INTO public.eligibility_rules (
  service_type_id, rule_name, rule_type, is_mandatory, priority, is_active, condition, error_message
) VALUES
  (
    '1fcde430-bbd2-40a0-a47a-f343426befc5',
    'Child Age Check',
    'child_age_check',
    TRUE,
    1,
    TRUE,
    '{"field": "child_age", "operator": "<=", "value": 18}'::jsonb,
    'Child does not meet the required age criteria.'
  ),
  (
    '1fcde430-bbd2-40a0-a47a-f343426befc5',
    'School Enrollment Check',
    'school_enrollment_check',
    TRUE,
    2,
    TRUE,
    '{"field": "is_enrolled_in_school", "operator": "=", "value": true}'::jsonb,
    'Child is not enrolled in a recognized school.'
  ),
  (
    '1fcde430-bbd2-40a0-a47a-f343426befc5',
    'Residency Check',
    'residency_check',
    TRUE,
    3,
    TRUE,
    '{"field": "district", "operator": "in", "value": "supported_districts"}'::jsonb,
    'Child is not registered in an eligible district.'
  );