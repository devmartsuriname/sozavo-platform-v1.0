import { supabase } from "@/integrations/supabase/client";
import type { PostgrestError } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// Types
export interface EligibilityEvaluation {
  id: string;
  case_id: string;
  result: string;
  criteria_results: Record<string, boolean>;
  evaluated_at: string;
  evaluated_by: string | null;
  override_by: string | null;
  override_reason: string | null;
}

export interface EligibilityRule {
  id: string;
  rule_name: string;
  rule_type: string;
  is_mandatory: boolean;
  priority: number;
  is_active: boolean;
  error_message: string;
  service_type_id: string;
  condition: Record<string, unknown>;
}

/**
 * Get eligibility evaluation summary for a case
 * Returns the most recent evaluation if one exists
 */
export async function getEligibilitySummary(caseId: string): Promise<{
  data: EligibilityEvaluation | null;
  error: PostgrestError | null;
}> {
  const { data, error } = await supabase
    .from("eligibility_evaluations")
    .select("id, case_id, result, criteria_results, evaluated_at, evaluated_by, override_by, override_reason")
    .eq("case_id", caseId)
    .order("evaluated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    data: data as EligibilityEvaluation | null,
    error,
  };
}

/**
 * Get active eligibility rules for a service type
 * Returns rules ordered by priority (ascending)
 */
export async function getEligibilityRulesForService(serviceTypeId: string): Promise<{
  data: EligibilityRule[] | null;
  error: PostgrestError | null;
}> {
  const { data, error } = await supabase
    .from("eligibility_rules")
    .select("id, rule_name, rule_type, is_mandatory, priority, is_active, error_message, service_type_id, condition")
    .eq("service_type_id", serviceTypeId)
    .eq("is_active", true)
    .order("priority", { ascending: true });

  return {
    data: data as EligibilityRule[] | null,
    error,
  };
}
