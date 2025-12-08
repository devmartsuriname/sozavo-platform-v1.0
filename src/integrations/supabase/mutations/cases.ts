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
 * Allowed transitions (Phase 10):
 * 
 * Phase 10 Step 1 (T001-T005):
 * - T001: intake → under_review (case_handler, case_reviewer, department_head, system_admin)
 * - T002: under_review → approved (case_reviewer, department_head, system_admin) + docs/eligibility checks
 * - T003: under_review → rejected (case_reviewer, department_head, system_admin) + reason required
 * - T004: approved → under_review (department_head, system_admin only) + reason required (reopen)
 * - T005: rejected → under_review (department_head, system_admin only) + reason required (reopen)
 * 
 * Phase 10 Step 3 (T006-T011):
 * - T006: approved → payment_pending (finance_officer, department_head, system_admin)
 * - T007: payment_pending → payment_processed (finance_officer, department_head, system_admin)
 * - T008: under_review → on_hold (case_reviewer, department_head, system_admin) + reason required
 * - T009: approved → on_hold (department_head, system_admin) + reason required
 * - T010: payment_pending → on_hold (department_head, system_admin) + reason required
 * - T011: on_hold → under_review (case_reviewer, department_head, system_admin)
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
 * 
 * Phase 10 Step 3 adds payment and hold transitions:
 * - T006: approved → payment_pending
 * - T007: payment_pending → payment_processed
 * - T008: under_review → on_hold
 * - T009: approved → on_hold
 * - T010: payment_pending → on_hold
 * - T011: on_hold → under_review
 */
export function isTransitionAllowed(
  currentStatus: CaseStatus,
  targetStatus: CaseStatus
): boolean {
  const allowedTransitions: Record<CaseStatus, CaseStatus[]> = {
    intake: ['under_review'],
    validation: [], // Not in Phase 10 scope
    eligibility_check: [], // Not in Phase 10 scope
    under_review: ['approved', 'rejected', 'on_hold'], // +on_hold (T008)
    approved: ['under_review', 'payment_pending', 'on_hold'], // +payment_pending (T006), +on_hold (T009)
    rejected: ['under_review'], // Reopen only
    payment_pending: ['payment_processed', 'on_hold'], // T007, T010
    payment_processed: [], // Terminal state
    closed: [], // Terminal state
    on_hold: ['under_review'] // T011: Resume from hold
  };

  return allowedTransitions[currentStatus]?.includes(targetStatus) ?? false;
}

/**
 * Helper to check if a reason is required for a transition.
 * 
 * Reason required for:
 * - Rejections (T003)
 * - Reopens from approved/rejected (T004, T005)
 * - All hold transitions (T008, T009, T010)
 */
export function isReasonRequired(
  currentStatus: CaseStatus,
  targetStatus: CaseStatus
): boolean {
  // Reason required for rejections
  if (targetStatus === 'rejected') return true;
  
  // Reason required for reopens (approved/rejected → under_review)
  if (currentStatus === 'approved' && targetStatus === 'under_review') return true;
  if (currentStatus === 'rejected' && targetStatus === 'under_review') return true;
  
  // Reason required for ALL hold transitions (T008, T009, T010)
  if (targetStatus === 'on_hold') return true;
  
  return false;
}
