import { supabase } from "@/integrations/supabase/client";
import type { PostgrestError } from "@supabase/supabase-js";

/**
 * Phase 9D-2E: Fraud Query Layer (Read-Only)
 * 
 * Provides typed read-only access to fraud signals and risk scores.
 * No mutations allowed - informational display only.
 * 
 * TESTING NOTE: Full evidence and description are exposed for Phase 9 testing.
 * This MUST be role-scoped and redacted before production (Phase 10+).
 */

// Type for fraud signal data
export interface CaseFraudSignal {
  id: string;
  case_id: string;
  signal_type: string;
  severity: string;        // low | medium | high | critical
  description: string;
  evidence: any | null;    // JSONB - exposed for testing only
  status: string;          // pending | investigating | confirmed | dismissed
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

// Type for fraud risk score data
export interface CaseFraudRiskScore {
  id: string;
  case_id: string;
  risk_score: number;      // 0.00 - 100.00
  risk_level: string;      // minimal | low | medium | high | critical
  signal_count: number;
  last_evaluated_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get all fraud signals for a specific case
 * Read-only query - no mutations
 * RLS enforced via role-based access (admin/fraud_officer/department_head)
 */
export async function getFraudSignalsByCase(caseId: string): Promise<{
  data: CaseFraudSignal[] | null;
  error: PostgrestError | null;
}> {
  const { data, error } = await supabase
    .from("fraud_signals")
    .select(`
      id,
      case_id,
      signal_type,
      severity,
      description,
      evidence,
      status,
      reviewed_by,
      reviewed_at,
      created_at
    `)
    .eq("case_id", caseId)
    .order("created_at", { ascending: false });

  return { data: data as CaseFraudSignal[] | null, error };
}

/**
 * Get the fraud risk score for a specific case
 * Read-only query - no mutations
 * Returns single row (one risk score per case)
 * RLS enforced via role-based access (admin/fraud_officer/department_head)
 */
export async function getFraudRiskScoreByCase(caseId: string): Promise<{
  data: CaseFraudRiskScore | null;
  error: PostgrestError | null;
}> {
  const { data, error } = await supabase
    .from("fraud_risk_scores")
    .select(`
      id,
      case_id,
      risk_score,
      risk_level,
      signal_count,
      last_evaluated_at,
      created_at,
      updated_at
    `)
    .eq("case_id", caseId)
    .maybeSingle();

  return { data: data as CaseFraudRiskScore | null, error };
}
