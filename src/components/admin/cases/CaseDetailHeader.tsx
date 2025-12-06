import React from "react";
import type { Enums } from "@/integrations/supabase/types";
import CaseStatusBadge from "./CaseStatusBadge";

type CaseStatus = Enums<"case_status">;

interface CaseDetailHeaderProps {
  caseReference: string;
  status: CaseStatus;
  citizenName: string | null;
  serviceName: string | null;
  onBack: () => void;
}

const CaseDetailHeader = ({
  caseReference,
  status,
  citizenName,
  serviceName,
  onBack,
}: CaseDetailHeaderProps) => {
  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <button
              className="btn btn-link p-0 mb-2 text-muted"
              onClick={onBack}
            >
              <i className="bx bx-arrow-back me-1"></i>
              Back to Cases
            </button>
            <h4 className="mb-1">Case {caseReference}</h4>
            <p className="text-muted mb-0">
              {citizenName && <span>Citizen: {citizenName}</span>}
              {citizenName && serviceName && <span className="mx-2">·</span>}
              {serviceName && <span>Service: {serviceName}</span>}
            </p>
          </div>
          <div>
            <CaseStatusBadge status={status} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailHeader;
