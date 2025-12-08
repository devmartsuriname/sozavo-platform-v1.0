import { supabase } from '../client';
import type { Enums, Json } from '../types';

type CaseStatus = Enums<'case_status'>;

interface TransitionResult {
  case_id: string;
  new_status: CaseStatus;
  updated_at: string;
}

interface TransitionOptions {
  reason?: string;
  metadata?: Record<string, Json>;
}

interface TransitionError {
  message: string;
  code?: string;
}

/**
 * Transition a case to a new status via the perform_case_transition RPC.
 * 
 * Allowed transitions (Phase 10 Step 1):
 * - intake → under_review (case_handler, case_reviewer, department_head, system_admin)
 * - under_review → approved (case_reviewer, department_head, system_admin) + docs/eligibility checks
 * - under_review → rejected (case_reviewer, department_head, system_admin) + reason required
 * - approved → under_review (department_head, system_admin only) + reason required (reopen)
 * - rejected → under_review (department_head, system_admin only) + reason required (reopen)
 * 
 * @param caseId - UUID of the case to transition
 * @param targetStatus - The target case_status enum value
 * @param options - Optional reason and metadata for the transition
 * @returns Promise with data (TransitionResult) or error
 */
export async function transitionCaseStatus(
  caseId: string,
  targetStatus: CaseStatus,
  options?: TransitionOptions
): Promise<{
  data: TransitionResult | null;
  error: TransitionError | null;
}> {
  const { data, error } = await supabase.rpc('perform_case_transition', {
    p_case_id: caseId,
    p_target_status: targetStatus,
    p_reason: options?.reason ?? null,
    p_metadata: (options?.metadata ?? {}) as Json
  });

  if (error) {
    // Extract the actual error message from PostgreSQL exception
    // The message format is typically: "ERROR: Cannot approve case: ..."
    let message = error.message;
    
    // Clean up the error message if it contains PostgreSQL prefixes
    if (message.includes('ERROR:')) {
      message = message.replace(/^ERROR:\s*/, '');
    }
    
    return { 
      data: null, 
      error: { 
        message, 
        code: error.code 
      } 
    };
  }

  // Parse the JSONB response
  const result = data as unknown as TransitionResult;

  return { 
    data: result, 
    error: null 
  };
}

/**
 * Helper to check if a transition is allowed based on current status.
 * This is a client-side helper - actual validation happens server-side.
 */
export function isTransitionAllowed(
  currentStatus: CaseStatus,
  targetStatus: CaseStatus
): boolean {
  const allowedTransitions: Record<CaseStatus, CaseStatus[]> = {
    intake: ['under_review'],
    validation: [], // Not in Phase 10 Step 1 scope
    eligibility_check: [], // Not in Phase 10 Step 1 scope
    under_review: ['approved', 'rejected'],
    approved: ['under_review'], // Reopen only
    rejected: ['under_review'], // Reopen only
    payment_pending: [], // Not in Phase 10 Step 1 scope
    payment_processed: [], // Not in Phase 10 Step 1 scope
    closed: [], // No transitions allowed from closed
    on_hold: [] // Not in Phase 10 Step 1 scope
  };

  return allowedTransitions[currentStatus]?.includes(targetStatus) ?? false;
}

/**
 * Helper to check if a reason is required for a transition.
 */
export function isReasonRequired(
  currentStatus: CaseStatus,
  targetStatus: CaseStatus
): boolean {
  // Reason required for rejections and reopens
  if (targetStatus === 'rejected') return true;
  if (currentStatus === 'approved' && targetStatus === 'under_review') return true;
  if (currentStatus === 'rejected' && targetStatus === 'under_review') return true;
  return false;
}
