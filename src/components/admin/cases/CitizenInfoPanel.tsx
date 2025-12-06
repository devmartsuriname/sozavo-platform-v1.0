import React from "react";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";
import DarkoneCard from "@/components/darkone/ui/DarkoneCard";

interface CitizenInfoPanelProps {
  citizen: Tables<"citizens"> | null;
}

const CitizenInfoPanel = ({ citizen }: CitizenInfoPanelProps) => {
  if (!citizen) {
    return (
      <DarkoneCard title="Citizen Information" titleTag="h5" className="mb-3">
        <p className="text-muted mb-0">No citizen information available</p>
      </DarkoneCard>
    );
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return format(new Date(dateStr), 'dd MMM yyyy');
  };

  return (
    <DarkoneCard title="Citizen Information" titleTag="h5" className="mb-3">
      <table className="table table-sm table-borderless mb-0">
        <tbody>
          <tr>
            <td className="text-muted" style={{ width: '40%' }}>Full Name</td>
            <td className="fw-medium">{citizen.first_name} {citizen.last_name}</td>
          </tr>
          <tr>
            <td className="text-muted">National ID</td>
            <td>{citizen.national_id}</td>
          </tr>
          <tr>
            <td className="text-muted">Date of Birth</td>
            <td>{formatDate(citizen.date_of_birth)}</td>
          </tr>
          <tr>
            <td className="text-muted">Gender</td>
            <td>{citizen.gender || '—'}</td>
          </tr>
          <tr>
            <td className="text-muted">Address</td>
            <td>{citizen.address || '—'}</td>
          </tr>
          <tr>
            <td className="text-muted">District</td>
            <td>{citizen.district || '—'}</td>
          </tr>
          <tr>
            <td className="text-muted">Phone</td>
            <td>{citizen.phone || '—'}</td>
          </tr>
          <tr>
            <td className="text-muted">Email</td>
            <td>{citizen.email || '—'}</td>
          </tr>
        </tbody>
      </table>
    </DarkoneCard>
  );
};

export default CitizenInfoPanel;
