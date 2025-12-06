import React from "react";
import type { Enums } from "@/integrations/supabase/types";

type CaseStatus = Enums<"case_status">;

interface CaseFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: CaseStatus | undefined;
  onStatusChange: (value: CaseStatus | undefined) => void;
  serviceTypeId: string | undefined;
  onServiceTypeChange: (value: string | undefined) => void;
  officeId: string | undefined;
  onOfficeChange: (value: string | undefined) => void;
}

const caseStatuses: { value: CaseStatus; label: string }[] = [
  { value: 'intake', label: 'Intake' },
  { value: 'validation', label: 'Validation' },
  { value: 'eligibility_check', label: 'Eligibility Check' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'payment_pending', label: 'Payment Pending' },
  { value: 'payment_processed', label: 'Payment Processed' },
  { value: 'closed', label: 'Closed' },
  { value: 'on_hold', label: 'On Hold' },
];

// Actual database UUIDs for service types and offices
const serviceTypes = [
  { id: 'b2051de5-2aec-47c9-a94e-faeec6230eb2', name: 'Algemene Bijstand (AB)' },
  { id: '03810046-83fc-4a96-b46b-ef842dfeb62c', name: 'Financiële Bijstand (FB)' },
  { id: '1fcde430-bbd2-40a0-a47a-f343426befc5', name: 'Kinderbijslag (KB)' },
];

const offices = [
  { id: 'bad18cd4-afd5-43ea-959b-ef9eb56b6f53', name: 'Paramaribo Central Office' },
  { id: '4bfa9116-7a00-43ea-a71d-9a099e7f83d9', name: 'Nickerie District Office' },
  { id: 'ed89eae1-0824-4283-969e-e608a56d3f66', name: 'Wanica District Office' },
];

const CaseFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  serviceTypeId,
  onServiceTypeChange,
  officeId,
  onOfficeChange,
}: CaseFiltersProps) => {
  return (
    <div className="row g-3 mb-3">
      <div className="col-md-3">
        <label className="form-label">Search</label>
        <input
          type="text"
          className="form-control"
          placeholder="Case reference..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="col-md-3">
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={status || ''}
          onChange={(e) => onStatusChange(e.target.value as CaseStatus || undefined)}
        >
          <option value="">All Statuses</option>
          {caseStatuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-3">
        <label className="form-label">Service Type</label>
        <select
          className="form-select"
          value={serviceTypeId || ''}
          onChange={(e) => onServiceTypeChange(e.target.value || undefined)}
        >
          <option value="">All Services</option>
          {serviceTypes.map((st) => (
            <option key={st.id} value={st.id}>
              {st.name}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-3">
        <label className="form-label">Office</label>
        <select
          className="form-select"
          value={officeId || ''}
          onChange={(e) => onOfficeChange(e.target.value || undefined)}
        >
          <option value="">All Offices</option>
          {offices.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CaseFilters;
