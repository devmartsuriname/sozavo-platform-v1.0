import React from "react";
import { format } from "date-fns";
import type { CaseDetailWithRelations } from "@/integrations/supabase/queries/cases";
import DarkoneCard from "@/components/darkone/ui/DarkoneCard";
import CaseStatusBadge from "./CaseStatusBadge";

interface CaseInfoPanelProps {
  caseData: CaseDetailWithRelations;
}

const CaseInfoPanel = ({ caseData }: CaseInfoPanelProps) => {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return format(new Date(dateStr), 'dd MMM yyyy, HH:mm');
  };

  return (
    <DarkoneCard title="Case Information" titleTag="h5" className="mb-3">
      <table className="table table-sm table-borderless mb-0">
        <tbody>
          <tr>
            <td className="text-muted" style={{ width: '40%' }}>Case Reference</td>
            <td className="fw-medium">{caseData.case_reference}</td>
          </tr>
          <tr>
            <td className="text-muted">Current Status</td>
            <td><CaseStatusBadge status={caseData.current_status} /></td>
          </tr>
          <tr>
            <td className="text-muted">Priority</td>
            <td>{caseData.priority || '—'}</td>
          </tr>
          <tr>
            <td className="text-muted">Created At</td>
            <td>{formatDate(caseData.created_at)}</td>
          </tr>
          <tr>
            <td className="text-muted">Updated At</td>
            <td>{formatDate(caseData.updated_at)}</td>
          </tr>
          {caseData.closed_at && (
            <tr>
              <td className="text-muted">Closed At</td>
              <td>{formatDate(caseData.closed_at)}</td>
            </tr>
          )}
          <tr>
            <td className="text-muted">Intake Office</td>
            <td>{caseData.offices?.name || '—'}</td>
          </tr>
          {caseData.case_handler_id && (
            <tr>
              <td className="text-muted">Handler ID</td>
              <td><code className="small">{caseData.case_handler_id}</code></td>
            </tr>
          )}
          {caseData.reviewer_id && (
            <tr>
              <td className="text-muted">Reviewer ID</td>
              <td><code className="small">{caseData.reviewer_id}</code></td>
            </tr>
          )}
        </tbody>
      </table>
    </DarkoneCard>
  );
};

export default CaseInfoPanel;
