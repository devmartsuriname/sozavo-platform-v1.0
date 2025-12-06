import React from "react";
import { format } from "date-fns";
import type { CaseWithRelations } from "@/integrations/supabase/queries/cases";
import DarkoneTable from "@/components/darkone/ui/DarkoneTable";
import CaseStatusBadge from "./CaseStatusBadge";

interface CaseListTableProps {
  cases: CaseWithRelations[];
  isLoading: boolean;
  onViewCase: (id: string) => void;
}

const CaseListTable = ({ cases, isLoading, onViewCase }: CaseListTableProps) => {
  if (isLoading) {
    return (
      <div className="table-responsive">
        <table className="table table-centered mb-0">
          <thead>
            <tr>
              <th>Case Reference</th>
              <th>Citizen</th>
              <th>Service</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i}>
                <td><span className="placeholder col-8"></span></td>
                <td><span className="placeholder col-10"></span></td>
                <td><span className="placeholder col-6"></span></td>
                <td><span className="placeholder col-4"></span></td>
                <td><span className="placeholder col-6"></span></td>
                <td><span className="placeholder col-4"></span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const columns = [
    {
      key: 'case_reference' as const,
      header: 'Case Reference',
      render: (row: CaseWithRelations) => (
        <span className="fw-medium">{row.case_reference}</span>
      ),
    },
    {
      key: 'citizen' as const,
      header: 'Citizen',
      render: (row: CaseWithRelations) => {
        const citizen = row.citizens;
        return citizen 
          ? `${citizen.first_name} ${citizen.last_name}`
          : <span className="text-muted">—</span>;
      },
    },
    {
      key: 'service' as const,
      header: 'Service',
      render: (row: CaseWithRelations) => {
        const service = row.service_types;
        return service?.name || <span className="text-muted">—</span>;
      },
    },
    {
      key: 'current_status' as const,
      header: 'Status',
      render: (row: CaseWithRelations) => (
        <CaseStatusBadge status={row.current_status} />
      ),
    },
    {
      key: 'created_at' as const,
      header: 'Created',
      render: (row: CaseWithRelations) => (
        format(new Date(row.created_at), 'dd MMM yyyy')
      ),
    },
    {
      key: 'actions' as const,
      header: 'Actions',
      render: (row: CaseWithRelations) => (
        <button
          className="btn btn-sm btn-soft-primary"
          onClick={() => onViewCase(row.id)}
        >
          <i className="bx bx-show me-1"></i>
          View
        </button>
      ),
    },
  ];

  return (
    <DarkoneTable
      columns={columns}
      data={cases}
      variant="hover"
      emptyMessage="No cases found"
    />
  );
};

export default CaseListTable;
