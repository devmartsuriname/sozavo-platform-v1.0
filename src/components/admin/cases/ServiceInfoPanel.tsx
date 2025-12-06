import React from "react";
import type { Tables } from "@/integrations/supabase/types";
import DarkoneCard from "@/components/darkone/ui/DarkoneCard";

interface ServiceInfoPanelProps {
  serviceType: Tables<"service_types"> | null;
}

const ServiceInfoPanel = ({ serviceType }: ServiceInfoPanelProps) => {
  if (!serviceType) {
    return (
      <DarkoneCard title="Service Type Information" titleTag="h5" className="mb-3">
        <p className="text-muted mb-0">No service type information available</p>
      </DarkoneCard>
    );
  }

  return (
    <DarkoneCard title="Service Type Information" titleTag="h5" className="mb-3">
      <table className="table table-sm table-borderless mb-0">
        <tbody>
          <tr>
            <td className="text-muted" style={{ width: '40%' }}>Name</td>
            <td className="fw-medium">{serviceType.name}</td>
          </tr>
          <tr>
            <td className="text-muted">Code</td>
            <td><code>{serviceType.code}</code></td>
          </tr>
          <tr>
            <td className="text-muted">Description</td>
            <td>{serviceType.description || '—'}</td>
          </tr>
        </tbody>
      </table>
    </DarkoneCard>
  );
};

export default ServiceInfoPanel;
