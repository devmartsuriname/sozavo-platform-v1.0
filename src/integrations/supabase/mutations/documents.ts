import { supabase } from "../client";
import type { Enums } from "../types";

type DocumentStatus = Enums<"document_status">;

interface VerifyDocumentResult {
  data: {
    document_id: string;
    new_status: DocumentStatus;
    updated_at: string;
  } | null;
  error: { message: string; code?: string } | null;
}

/**
 * Verify or change status of a document via RPC.
 * 
 * Allowed transitions (Phase 10 Step 4):
 * - D001: pending → verified (case_reviewer, department_head, system_admin)
 * - D002: pending → rejected (case_reviewer, department_head, system_admin) + reason required
 * - D003: rejected → verified (department_head, system_admin only)
 * - D004: verified → pending (department_head, system_admin only)
 * 
 * All transitions are audited to case_events with event_type = 'document_verification'.
 */
export async function verifyCaseDocument(
  documentId: string,
  newStatus: DocumentStatus,
  reason?: string,
  metadata?: Record<string, string | number | boolean | null>
): Promise<VerifyDocumentResult> {
  const { data, error } = await supabase.rpc("verify_case_document", {
    p_document_id: documentId,
    p_new_status: newStatus,
    p_reason: reason ?? null,
    p_metadata: (metadata ?? {}) as Record<string, string | number | boolean | null>,
  });

  if (error) {
    return {
      data: null,
      error: { message: error.message, code: error.code },
    };
  }

  return {
    data: data as VerifyDocumentResult["data"],
    error: null,
  };
}

/**
 * Helper: Check if a document status transition is allowed (client-side hint).
 * 
 * This mirrors backend logic for UI button visibility.
 * Backend enforces actual permissions.
 */
export function isDocumentTransitionAllowed(
  currentStatus: DocumentStatus,
  targetStatus: DocumentStatus
): boolean {
  const allowed: Record<DocumentStatus, DocumentStatus[]> = {
    pending: ["verified", "rejected"],
    verified: ["pending"],
    rejected: ["verified"],
    expired: [], // No transitions from expired
  };
  return allowed[currentStatus]?.includes(targetStatus) ?? false;
}

/**
 * Helper: Check if reason is required for a document transition.
 * 
 * Only rejection requires a reason.
 */
export function isDocumentReasonRequired(
  _currentStatus: DocumentStatus,
  targetStatus: DocumentStatus
): boolean {
  return targetStatus === "rejected";
}

/**
 * Get available actions for a document based on its current status.
 * Returns an array of possible target statuses.
 */
export function getDocumentActions(currentStatus: DocumentStatus): {
  targetStatus: DocumentStatus;
  label: string;
  variant: "success" | "danger" | "warning" | "secondary";
  requiresReason: boolean;
  requiresHigherPrivilege: boolean;
}[] {
  // Normalize status to handle case mismatches from database
  const normalizedStatus = (currentStatus?.toLowerCase?.().trim() || currentStatus) as DocumentStatus;
  
  switch (normalizedStatus) {
    case "pending":
      return [
        {
          targetStatus: "verified",
          label: "Verify Document",
          variant: "success",
          requiresReason: false,
          requiresHigherPrivilege: false,
        },
        {
          targetStatus: "rejected",
          label: "Reject Document",
          variant: "danger",
          requiresReason: true,
          requiresHigherPrivilege: false,
        },
      ];
    case "verified":
      return [
        {
          targetStatus: "pending",
          label: "Undo Verification",
          variant: "warning",
          requiresReason: false,
          requiresHigherPrivilege: true,
        },
      ];
    case "rejected":
      return [
        {
          targetStatus: "verified",
          label: "Re-Verify Document",
          variant: "success",
          requiresReason: false,
          requiresHigherPrivilege: true,
        },
      ];
    case "expired":
    default:
      return [];
  }
}
