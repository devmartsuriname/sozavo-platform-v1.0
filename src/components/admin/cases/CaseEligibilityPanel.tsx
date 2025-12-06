import React from "react";
import DarkoneCard from "@/components/darkone/ui/DarkoneCard";
import DarkoneBadge from "@/components/darkone/ui/DarkoneBadge";
import EligibilityResultBadge from "./EligibilityResultBadge";
import type { EligibilityEvaluation, EligibilityRule } from "@/integrations/supabase/queries/eligibility";

interface CaseEligibilityPanelProps {
  evaluation: EligibilityEvaluation | null;
  rules: EligibilityRule[] | null;
  isLoading: boolean;
  error: string | null;
}

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
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

/**
 * Formats criterion key to readable label
 * e.g., "age_check" → "Age Check"
 */
const formatCriterionLabel = (key: string): string => {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * CaseEligibilityPanel displays eligibility evaluation details
 * Uses only Darkone/Bootstrap classes (no Tailwind, no ShadCN)
 */
const CaseEligibilityPanel = ({
  evaluation,
  rules,
  isLoading,
  error,
}: CaseEligibilityPanelProps) => {
  // Loading skeleton
  if (isLoading) {
    return (
      <DarkoneCard title="Eligibility Overview" titleTag="h5" className="mb-3">
        <div className="placeholder-glow">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="placeholder col-3"></span>
            <span className="placeholder col-2"></span>
          </div>
          <div className="placeholder col-12 mb-2" style={{ height: "100px" }}></div>
        </div>
      </DarkoneCard>
    );
  }

  // Error state
  if (error) {
    return (
      <DarkoneCard title="Eligibility Overview" titleTag="h5" className="mb-3">
        <div className="alert alert-danger mb-0" role="alert">
          <i className="bx bx-error-circle me-2"></i>
          Error loading eligibility: {error}
        </div>
      </DarkoneCard>
    );
  }

  // No evaluation exists
  if (!evaluation) {
    return (
      <DarkoneCard title="Eligibility Overview" titleTag="h5" className="mb-3">
        <p className="text-muted mb-0">
          <i className="bx bx-info-circle me-2"></i>
          No eligibility evaluation available yet.
        </p>
      </DarkoneCard>
    );
  }

  // Build criteria results table rows
  const criteriaResults = evaluation.criteria_results || {};
  const criteriaEntries = Object.entries(criteriaResults);

  // Try to match criteria with rules for additional metadata
  const getCriterionMetadata = (criterionKey: string) => {
    if (!rules || rules.length === 0) {
      return { name: formatCriterionLabel(criterionKey), isMandatory: null };
    }

    // Try to find matching rule by rule_name or rule_type
    const matchedRule = rules.find(
      (rule) =>
        rule.rule_name.toLowerCase().includes(criterionKey.toLowerCase()) ||
        rule.rule_type.toLowerCase() === criterionKey.toLowerCase() ||
        criterionKey.toLowerCase().includes(rule.rule_type.toLowerCase())
    );

    if (matchedRule) {
      return { name: matchedRule.rule_name, isMandatory: matchedRule.is_mandatory };
    }

    return { name: formatCriterionLabel(criterionKey), isMandatory: null };
  };

  return (
    <DarkoneCard title="Eligibility Overview" titleTag="h5" className="mb-3">
      {/* Header row: Result Badge + Evaluated At */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <strong className="me-2">Result:</strong>
          <EligibilityResultBadge result={evaluation.result} />
        </div>
        <small className="text-muted">
          Evaluated: {formatDate(evaluation.evaluated_at)}
        </small>
      </div>

      {/* Override reason if exists */}
      {evaluation.override_reason && (
        <div className="alert alert-info mb-3">
          <i className="bx bx-info-circle me-2"></i>
          <strong>Override Decision:</strong> {evaluation.override_reason}
          {evaluation.override_by && (
            <small className="d-block mt-1 text-muted">
              Overridden by: {evaluation.override_by}
            </small>
          )}
        </div>
      )}

      {/* Criteria Results Table */}
      {criteriaEntries.length > 0 ? (
        <>
          <h6 className="mb-2">Criteria Results</h6>
          <div className="table-responsive">
            <table className="table table-sm table-striped mb-0">
              <thead>
                <tr>
                  <th>Rule Name</th>
                  <th className="text-center">Mandatory</th>
                  <th className="text-center">Result</th>
                </tr>
              </thead>
              <tbody>
                {criteriaEntries.map(([key, passed]) => {
                  const metadata = getCriterionMetadata(key);
                  return (
                    <tr key={key}>
                      <td>{metadata.name}</td>
                      <td className="text-center">
                        {metadata.isMandatory === null ? (
                          <span className="text-muted">—</span>
                        ) : metadata.isMandatory ? (
                          <DarkoneBadge variant="warning" soft>Yes</DarkoneBadge>
                        ) : (
                          <DarkoneBadge variant="secondary" soft>No</DarkoneBadge>
                        )}
                      </td>
                      <td className="text-center">
                        {passed ? (
                          <DarkoneBadge variant="success" soft>Pass</DarkoneBadge>
                        ) : (
                          <DarkoneBadge variant="danger" soft>Fail</DarkoneBadge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="text-muted mb-0">
          <small>No detailed criteria results available.</small>
        </p>
      )}
    </DarkoneCard>
  );
};

export default CaseEligibilityPanel;
