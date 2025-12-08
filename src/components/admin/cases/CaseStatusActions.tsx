import React, { useState } from "react";
import type { Enums } from "@/integrations/supabase/types";
import { 
  transitionCaseStatus, 
  isTransitionAllowed, 
  isReasonRequired 
} from "@/integrations/supabase/mutations/cases";
import { toast } from "sonner";

type CaseStatus = Enums<"case_status">;

interface CaseStatusActionsProps {
  caseId: string;
  currentStatus: CaseStatus;
  onStatusChanged?: (newStatus: CaseStatus) => void;
  disabled?: boolean;
}

interface TransitionConfig {
  fromStatus: CaseStatus;
  toStatus: CaseStatus;
  label: string;
  icon: string;
  reasonRequired: boolean;
  description: string;
}

// Define the 5 allowed transitions per Phase 10 Step 1
const TRANSITIONS: TransitionConfig[] = [
  {
    fromStatus: "intake",
    toStatus: "under_review",
    label: "Move to Under Review",
    icon: "bx-right-arrow-alt",
    reasonRequired: false,
    description: "Submit case for review",
  },
  {
    fromStatus: "under_review",
    toStatus: "approved",
    label: "Approve Case",
    icon: "bx-check-circle",
    reasonRequired: false,
    description: "Approve this case (requires verified documents and eligible evaluation)",
  },
  {
    fromStatus: "under_review",
    toStatus: "rejected",
    label: "Reject Case",
    icon: "bx-x-circle",
    reasonRequired: true,
    description: "Reject this case (reason required)",
  },
  {
    fromStatus: "approved",
    toStatus: "under_review",
    label: "Reopen Case",
    icon: "bx-revision",
    reasonRequired: true,
    description: "Reopen approved case for review (reason required, department_head only)",
  },
  {
    fromStatus: "rejected",
    toStatus: "under_review",
    label: "Reopen Case",
    icon: "bx-revision",
    reasonRequired: true,
    description: "Reopen rejected case for review (reason required, department_head only)",
  },
];

const CaseStatusActions = ({
  caseId,
  currentStatus,
  onStatusChanged,
  disabled = false,
}: CaseStatusActionsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingTransition, setPendingTransition] = useState<TransitionConfig | null>(null);
  const [reasonInput, setReasonInput] = useState("");
  const [reasonError, setReasonError] = useState<string | null>(null);

  // Get available transitions for current status
  const availableTransitions = TRANSITIONS.filter(
    (t) => t.fromStatus === currentStatus && isTransitionAllowed(currentStatus, t.toStatus)
  );

  // No actions available for this status
  if (availableTransitions.length === 0) {
    return null;
  }

  const handleTransitionClick = (transition: TransitionConfig) => {
    setErrorMessage(null);
    setPendingTransition(transition);
    
    if (transition.reasonRequired) {
      setReasonInput("");
      setReasonError(null);
      setShowReasonModal(true);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmTransition = async () => {
    if (!pendingTransition) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const { data, error } = await transitionCaseStatus(
      caseId,
      pendingTransition.toStatus,
      { reason: undefined }
    );

    setIsSubmitting(false);
    setShowConfirmModal(false);

    if (error) {
      setErrorMessage(error.message);
      toast.error("Status update failed", { description: error.message });
    } else if (data) {
      toast.success("Status updated", {
        description: `Case moved to ${formatStatus(data.new_status)}`,
      });
      onStatusChanged?.(data.new_status);
    }

    setPendingTransition(null);
  };

  const handleReasonSubmit = async () => {
    if (!pendingTransition) return;

    const trimmedReason = reasonInput.trim();
    if (!trimmedReason) {
      setReasonError("Please provide a reason for this action");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setReasonError(null);

    const { data, error } = await transitionCaseStatus(
      caseId,
      pendingTransition.toStatus,
      { reason: trimmedReason }
    );

    setIsSubmitting(false);
    setShowReasonModal(false);

    if (error) {
      setErrorMessage(error.message);
      toast.error("Status update failed", { description: error.message });
    } else if (data) {
      toast.success("Status updated", {
        description: `Case moved to ${formatStatus(data.new_status)}`,
      });
      onStatusChanged?.(data.new_status);
    }

    setPendingTransition(null);
    setReasonInput("");
  };

  const handleCancelModal = () => {
    setShowReasonModal(false);
    setShowConfirmModal(false);
    setPendingTransition(null);
    setReasonInput("");
    setReasonError(null);
  };

  const formatStatus = (status: CaseStatus): string => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="d-inline-block">
      {/* Dropdown Button */}
      <div className="dropdown">
        <button
          className="btn btn-sm btn-outline-primary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          disabled={disabled || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              Processing...
            </>
          ) : (
            <>
              <i className="bx bx-transfer-alt me-1"></i>
              Change Status
            </>
          )}
        </button>
        <ul className="dropdown-menu dropdown-menu-end" style={{ zIndex: 1050, backgroundColor: 'var(--bs-dropdown-bg, #fff)' }}>
          {availableTransitions.map((transition) => (
            <li key={`${transition.fromStatus}-${transition.toStatus}`}>
              <button
                className="dropdown-item"
                onClick={() => handleTransitionClick(transition)}
                disabled={isSubmitting}
              >
                <i className={`bx ${transition.icon} me-2`}></i>
                {transition.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="alert alert-danger mt-2 mb-0 py-2 px-3" role="alert" style={{ fontSize: '0.875rem' }}>
          <i className="bx bx-error-circle me-1"></i>
          {errorMessage}
        </div>
      )}

      {/* Confirm Modal (no reason required) */}
      {showConfirmModal && pendingTransition && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className={`bx ${pendingTransition.icon} me-2`}></i>
                    {pendingTransition.label}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCancelModal}
                    disabled={isSubmitting}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="mb-0">{pendingTransition.description}</p>
                  <p className="text-muted mt-2 mb-0">
                    Are you sure you want to proceed?
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancelModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleConfirmTransition}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
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
        </>
      )}

      {/* Reason Modal (reason required) */}
      {showReasonModal && pendingTransition && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className={`bx ${pendingTransition.icon} me-2`}></i>
                    {pendingTransition.label}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCancelModal}
                    disabled={isSubmitting}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="text-muted mb-3">{pendingTransition.description}</p>
                  <div className="mb-3">
                    <label htmlFor="transitionReason" className="form-label">
                      Reason <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="transitionReason"
                      className={`form-control ${reasonError ? 'is-invalid' : ''}`}
                      rows={3}
                      placeholder="Please provide a reason for this action..."
                      value={reasonInput}
                      onChange={(e) => {
                        setReasonInput(e.target.value);
                        if (reasonError) setReasonError(null);
                      }}
                      disabled={isSubmitting}
                    />
                    {reasonError && (
                      <div className="invalid-feedback">{reasonError}</div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancelModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleReasonSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
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
        </>
      )}
    </div>
  );
};

export default CaseStatusActions;
