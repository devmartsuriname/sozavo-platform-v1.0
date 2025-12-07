import React from "react";
import DarkoneCard from "@/components/darkone/ui/DarkoneCard";
import DarkoneBadge from "@/components/darkone/ui/DarkoneBadge";
import type { CaseFraudSignal, CaseFraudRiskScore } from "@/integrations/supabase/queries/fraud";

/**
 * Phase 9D-2E: Fraud & Risk Panel (Read-Only)
 * 
 * Displays fraud signals and risk scores for a case.
 * No actions allowed - informational display only.
 * 
 * TESTING NOTE: Full evidence and description are exposed for Phase 9 testing.
 * This MUST be role-scoped and redacted before production (Phase 10+).
 */

interface CaseFraudPanelProps {
  signals: CaseFraudSignal[] | null;
  riskScore: CaseFraudRiskScore | null;
  isLoading: boolean;
  error: string | null;
}

// Format signal type for display (snake_case → Title Case)
const formatSignalType = (type: string): string => {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Format datetime for display
const formatDateTime = (ts: string | null): string => {
  if (!ts) return "—";
  const date = new Date(ts);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format risk score to 1 decimal place
const formatRiskScore = (score: number): string => {
  return score.toFixed(1);
};

// Get badge variant for severity
const getSeverityBadgeVariant = (severity: string): "secondary" | "warning" | "danger" => {
  const severityMap: Record<string, "secondary" | "warning" | "danger"> = {
    low: "secondary",
    medium: "warning",
    high: "danger",
    critical: "danger",
  };
  return severityMap[severity.toLowerCase()] || "secondary";
};

// Get badge variant for signal status
const getStatusBadgeVariant = (status: string): "warning" | "primary" | "danger" | "secondary" => {
  const statusMap: Record<string, "warning" | "primary" | "danger" | "secondary"> = {
    pending: "warning",
    investigating: "primary",
    confirmed: "danger",
    dismissed: "secondary",
  };
  return statusMap[status.toLowerCase()] || "secondary";
};

// Get badge variant for risk level
const getRiskLevelBadgeVariant = (level: string): "success" | "warning" | "danger" | "secondary" => {
  const levelMap: Record<string, "success" | "warning" | "danger" | "secondary"> = {
    minimal: "success",
    low: "success",
    medium: "warning",
    high: "danger",
    critical: "danger",
  };
  return levelMap[level.toLowerCase()] || "secondary";
};

// Format label (capitalize first letter)
const formatLabel = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

// Truncate description for table display
const truncateDescription = (desc: string, maxLength: number = 50): string => {
  if (desc.length <= maxLength) return desc;
  return desc.substring(0, maxLength) + "...";
};

const CaseFraudPanel: React.FC<CaseFraudPanelProps> = ({
  signals,
  riskScore,
  isLoading,
  error,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <DarkoneCard title="Fraud & Risk" titleTag="h5" className="mb-3">
        <div className="placeholder-glow">
          <div className="d-flex gap-4 mb-3">
            <div className="flex-fill">
              <span className="placeholder col-6 mb-1 d-block"></span>
              <span className="placeholder col-4"></span>
            </div>
            <div className="flex-fill">
              <span className="placeholder col-6 mb-1 d-block"></span>
              <span className="placeholder col-4"></span>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-centered mb-0">
              <thead>
                <tr>
                  <th><span className="placeholder col-8"></span></th>
                  <th><span className="placeholder col-6"></span></th>
                  <th><span className="placeholder col-6"></span></th>
                  <th><span className="placeholder col-8"></span></th>
                </tr>
              </thead>
              <tbody>
                {[1, 2].map((i) => (
                  <tr key={i}>
                    <td><span className="placeholder col-10"></span></td>
                    <td><span className="placeholder col-8"></span></td>
                    <td><span className="placeholder col-6"></span></td>
                    <td><span className="placeholder col-10"></span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DarkoneCard>
    );
  }

  // Error state
  if (error) {
    return (
      <DarkoneCard title="Fraud & Risk" titleTag="h5" className="mb-3">
        <div className="alert alert-danger mb-0" role="alert">
          <i className="bx bx-error-circle me-2"></i>
          Unable to load fraud & risk information at the moment.
        </div>
      </DarkoneCard>
    );
  }

  // Empty state - no risk score and no signals
  if (!riskScore && (!signals || signals.length === 0)) {
    return (
      <DarkoneCard title="Fraud & Risk" titleTag="h5" className="mb-3">
        <p className="text-muted mb-0">
          <i className="bx bx-info-circle me-2"></i>
          No fraud signals have been recorded for this case.
        </p>
      </DarkoneCard>
    );
  }

  // Data state
  return (
    <DarkoneCard title="Fraud & Risk" titleTag="h5" className="mb-3">
      {/* Risk Summary Block */}
      {riskScore && (
        <div className="row mb-3">
          <div className="col-6 col-md-3">
            <div className="text-muted small">Risk Score</div>
            <div className="fw-semibold fs-5">{formatRiskScore(riskScore.risk_score)}</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="text-muted small">Risk Level</div>
            <div>
              <DarkoneBadge variant={getRiskLevelBadgeVariant(riskScore.risk_level)}>
                {formatLabel(riskScore.risk_level)}
              </DarkoneBadge>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="text-muted small">Signal Count</div>
            <div className="fw-medium">{riskScore.signal_count}</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="text-muted small">Last Evaluated</div>
            <div className="small">{formatDateTime(riskScore.last_evaluated_at)}</div>
          </div>
        </div>
      )}

      {/* Signals Table */}
      {signals && signals.length > 0 && (
        <div className="table-responsive">
          <table className="table table-centered mb-0">
            <thead>
              <tr>
                <th>Signal Type</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Description</th>
                <th>Detected</th>
              </tr>
            </thead>
            <tbody>
              {signals.map((signal) => (
                <tr key={signal.id}>
                  <td>{formatSignalType(signal.signal_type)}</td>
                  <td>
                    <DarkoneBadge variant={getSeverityBadgeVariant(signal.severity)}>
                      {formatLabel(signal.severity)}
                    </DarkoneBadge>
                  </td>
                  <td>
                    <DarkoneBadge variant={getStatusBadgeVariant(signal.status)}>
                      {formatLabel(signal.status)}
                    </DarkoneBadge>
                  </td>
                  <td title={signal.description}>
                    {truncateDescription(signal.description)}
                  </td>
                  <td className="small">{formatDateTime(signal.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Risk score exists but no signals */}
      {riskScore && (!signals || signals.length === 0) && (
        <p className="text-muted mb-0 mt-2">
          <i className="bx bx-info-circle me-2"></i>
          No active fraud signals for this case.
        </p>
      )}
    </DarkoneCard>
  );
};

export default CaseFraudPanel;
