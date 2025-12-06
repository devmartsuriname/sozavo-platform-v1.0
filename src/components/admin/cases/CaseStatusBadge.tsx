import React from "react";
import type { Enums } from "@/integrations/supabase/types";
import DarkoneBadge from "@/components/darkone/ui/DarkoneBadge";

type CaseStatus = Enums<"case_status">;

interface CaseStatusBadgeProps {
  status: CaseStatus;
}

const statusConfig: Record<CaseStatus, { variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'; label: string }> = {
  intake: { variant: 'info', label: 'Intake' },
  validation: { variant: 'info', label: 'Validation' },
  eligibility_check: { variant: 'warning', label: 'Eligibility Check' },
  under_review: { variant: 'warning', label: 'Under Review' },
  approved: { variant: 'success', label: 'Approved' },
  rejected: { variant: 'danger', label: 'Rejected' },
  payment_pending: { variant: 'primary', label: 'Payment Pending' },
  payment_processed: { variant: 'success', label: 'Payment Processed' },
  closed: { variant: 'secondary', label: 'Closed' },
  on_hold: { variant: 'warning', label: 'On Hold' },
};

const CaseStatusBadge = ({ status }: CaseStatusBadgeProps) => {
  const config = statusConfig[status] || { variant: 'secondary', label: status };
  
  return (
    <DarkoneBadge variant={config.variant} soft>
      {config.label}
    </DarkoneBadge>
  );
};

export default CaseStatusBadge;
