import { supabase } from "@/integrations/supabase/client";
import type { PostgrestError } from "@supabase/supabase-js";

/**
 * Phase 9D-2D: Payments Query Layer (Read-Only)
 * 
 * Provides typed read-only access to case payments.
 * No mutations allowed - informational display only.
 */

// Type for case payment data
export interface CasePayment {
  id: string;
  case_id: string;
  citizen_id: string;
  amount: number;
  payment_date: string;
  status: string; // pending | processed | failed | cancelled
  payment_method: string | null;
  bank_account: string | null;
  subema_reference: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Get all payments for a specific case
 * Read-only query - no mutations
 * RLS enforced via has_case_access(case_id)
 */
export async function getCasePayments(caseId: string): Promise<{
  data: CasePayment[] | null;
  error: PostgrestError | null;
}> {
  const { data, error } = await supabase
    .from("payments")
    .select(`
      id,
      case_id,
      citizen_id,
      amount,
      payment_date,
      status,
      payment_method,
      bank_account,
      subema_reference,
      notes,
      created_at,
      updated_at
    `)
    .eq("case_id", caseId)
    .order("payment_date", { ascending: false })
    .order("created_at", { ascending: false });

  return { data: data as CasePayment[] | null, error };
}
