import React, { useState } from "react";
import DarkoneCard from "@/components/darkone/ui/DarkoneCard";
import DarkoneBadge from "@/components/darkone/ui/DarkoneBadge";
import { toast } from "sonner";
import type { CaseDocument } from "@/integrations/supabase/queries/documents";
import {
  verifyCaseDocument,
  getDocumentActions,
  isDocumentReasonRequired,
} from "@/integrations/supabase/mutations/documents";
import type { Enums } from "@/integrations/supabase/types";

type DocumentStatus = Enums<"document_status">;

interface CaseDocumentsPanelProps {
  documents: CaseDocument[] | null;
  isLoading: boolean;
  error: string | null;
  onDocumentsChanged?: () => void;
}

/**
 * Formats document type enum to readable label
 */
const formatDocumentType = (type: string): string => {
  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Formats file size in bytes to human readable format
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

/**
 * Formats date string to readable format
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

/**
 * Returns badge variant based on document status
 */
const getStatusBadgeVariant = (status: string): "warning" | "success" | "danger" | "secondary" => {
  switch (status) {
    case "pending":
      return "warning";
    case "verified":
      return "success";
    case "rejected":
      return "danger";
    case "expired":
      return "secondary";
    default:
      return "secondary";
  }
};

/**
 * Formats status for display
 */
const formatStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * CaseDocumentsPanel displays documents for a case with verification actions
 */
const CaseDocumentsPanel = ({
  documents,
  isLoading,
  error,
  onDocumentsChanged,
}: CaseDocumentsPanelProps) => {
  // Modal state
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<CaseDocument | null>(null);
  const [targetStatus, setTargetStatus] = useState<DocumentStatus | null>(null);
  const [actionLabel, setActionLabel] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Handle action button click
  const handleActionClick = (
    doc: CaseDocument,
    target: DocumentStatus,
    label: string,
    requiresReason: boolean
  ) => {
    setSelectedDocument(doc);
    setTargetStatus(target);
    setActionLabel(label);
    setReason("");
    setActionError(null);

    if (requiresReason) {
      setShowReasonModal(true);
    } else {
      setShowConfirmModal(true);
    }
  };

  // Execute the document verification
  const executeAction = async () => {
    if (!selectedDocument || !targetStatus) return;

    // Validate reason if required
    if (isDocumentReasonRequired(selectedDocument.status as DocumentStatus, targetStatus)) {
      if (!reason.trim()) {
        setActionError("Please provide a reason for rejection.");
        return;
      }
    }

    setIsSubmitting(true);
    setActionError(null);

    const result = await verifyCaseDocument(
      selectedDocument.id,
      targetStatus,
      reason.trim() || undefined
    );

    setIsSubmitting(false);

    if (result.error) {
      setActionError(result.error.message);
      return;
    }

    // Success
    toast.success(`Document ${targetStatus === "verified" ? "verified" : targetStatus === "rejected" ? "rejected" : "updated"} successfully`);
    setShowReasonModal(false);
    setShowConfirmModal(false);
    setSelectedDocument(null);
    setTargetStatus(null);
    setReason("");

    // Trigger refresh
    onDocumentsChanged?.();
  };

  // Close modals
  const closeModals = () => {
    setShowReasonModal(false);
    setShowConfirmModal(false);
    setSelectedDocument(null);
    setTargetStatus(null);
    setReason("");
    setActionError(null);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <DarkoneCard title="Documents" titleTag="h5" className="mb-3">
        <div className="placeholder-glow">
          <div className="placeholder col-12 mb-2" style={{ height: "120px" }}></div>
        </div>
      </DarkoneCard>
    );
  }

  // Error state
  if (error) {
    return (
      <DarkoneCard title="Documents" titleTag="h5" className="mb-3">
        <div className="alert alert-danger mb-0" role="alert">
          <i className="bx bx-error-circle me-2"></i>
          Error loading documents: {error}
        </div>
      </DarkoneCard>
    );
  }

  // No documents exist
  if (!documents || documents.length === 0) {
    return (
      <DarkoneCard title="Documents" titleTag="h5" className="mb-3">
        <p className="text-muted mb-0">
          <i className="bx bx-info-circle me-2"></i>
          No documents uploaded for this case yet.
        </p>
      </DarkoneCard>
    );
  }

  return (
    <>
      <DarkoneCard title="Documents" titleTag="h5" className="mb-3">
        <div className="table-responsive">
          <table className="table table-sm table-striped mb-0">
            <thead>
              <tr>
                <th>Type</th>
                <th>File Name</th>
                <th className="text-end">Size</th>
                <th className="text-center">Status</th>
                <th className="text-end">Uploaded</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => {
                const actions = getDocumentActions(doc.status as DocumentStatus);
                return (
                  <tr key={doc.id}>
                    <td>{formatDocumentType(doc.document_type)}</td>
                    <td>
                      <span className="text-truncate d-inline-block" style={{ maxWidth: "150px" }} title={doc.file_name}>
                        {doc.file_name}
                      </span>
                    </td>
                    <td className="text-end">{formatFileSize(doc.file_size)}</td>
                    <td className="text-center">
                      <DarkoneBadge variant={getStatusBadgeVariant(doc.status)} soft>
                        {formatStatus(doc.status)}
                      </DarkoneBadge>
                    </td>
                    <td className="text-end">
                      <small className="text-muted">{formatDate(doc.created_at)}</small>
                    </td>
                    <td className="text-center">
                      {actions.length > 0 ? (
                        <div className="dropdown d-inline-block">
                          <button
                            className="btn btn-sm btn-soft-primary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{ minWidth: '36px' }}
                          >
                            <i className="bx bx-dots-horizontal-rounded"></i>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end" style={{ zIndex: 1050 }}>
                            {actions.map((action) => (
                              <li key={action.targetStatus}>
                                <button
                                  className="dropdown-item"
                                  onClick={() =>
                                    handleActionClick(
                                      doc,
                                      action.targetStatus,
                                      action.label,
                                      action.requiresReason
                                    )
                                  }
                                >
                                  <i
                                    className={`bx me-2 ${
                                      action.variant === "success"
                                        ? "bx-check-circle text-success"
                                        : action.variant === "danger"
                                        ? "bx-x-circle text-danger"
                                        : "bx-undo text-warning"
                                    }`}
                                  ></i>
                                  {action.label}
                                  {action.requiresHigherPrivilege && (
                                    <small className="text-muted ms-1">(Dept Head+)</small>
                                  )}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Rejection reason display for rejected documents */}
        {documents.some((doc) => doc.status === "rejected" && doc.rejection_reason) && (
          <div className="mt-3">
            <small className="text-muted d-block mb-1">Rejection Notes:</small>
            {documents
              .filter((doc) => doc.status === "rejected" && doc.rejection_reason)
              .map((doc) => (
                <div key={doc.id} className="alert alert-warning py-2 mb-1">
                  <small>
                    <strong>{formatDocumentType(doc.document_type)}:</strong> {doc.rejection_reason}
                  </small>
                </div>
              ))}
          </div>
        )}
      </DarkoneCard>

      {/* Reason Modal (for rejection) */}
      {showReasonModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{actionLabel}</h5>
                <button type="button" className="btn-close" onClick={closeModals} disabled={isSubmitting}></button>
              </div>
              <div className="modal-body">
                {actionError && (
                  <div className="alert alert-danger mb-3">
                    <i className="bx bx-error-circle me-2"></i>
                    {actionError}
                  </div>
                )}
                <p className="mb-3">
                  You are about to reject: <strong>{selectedDocument?.file_name}</strong>
                </p>
                <div className="mb-3">
                  <label htmlFor="rejectionReason" className="form-label">
                    Rejection Reason <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="rejectionReason"
                    className="form-control"
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please provide a reason for rejection..."
                    disabled={isSubmitting}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModals} disabled={isSubmitting}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={executeAction}
                  disabled={isSubmitting || !reason.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Rejecting...
                    </>
                  ) : (
                    "Reject Document"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal (for verify/reverify/undo) */}
      {showConfirmModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{actionLabel}</h5>
                <button type="button" className="btn-close" onClick={closeModals} disabled={isSubmitting}></button>
              </div>
              <div className="modal-body">
                {actionError && (
                  <div className="alert alert-danger mb-3">
                    <i className="bx bx-error-circle me-2"></i>
                    {actionError}
                  </div>
                )}
                <p className="mb-0">
                  Are you sure you want to <strong>{actionLabel.toLowerCase()}</strong> for:{" "}
                  <strong>{selectedDocument?.file_name}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModals} disabled={isSubmitting}>
                  Cancel
                </button>
                <button
                  type="button"
                  className={`btn ${targetStatus === "verified" ? "btn-success" : "btn-warning"}`}
                  onClick={executeAction}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CaseDocumentsPanel;
