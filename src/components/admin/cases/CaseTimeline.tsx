import React from "react";
import { format } from "date-fns";
import type { TimelineEvent } from "@/integrations/supabase/queries/cases";
import DarkoneCard from "@/components/darkone/ui/DarkoneCard";
import CaseStatusBadge from "./CaseStatusBadge";

interface CaseTimelineProps {
  events: TimelineEvent[] | null;
  isLoading: boolean;
  error: string | null;
}

const eventTypeLabels: Record<string, string> = {
  status_change: 'Status Changed',
  created: 'Case Created',
  assigned: 'Case Assigned',
  note_added: 'Note Added',
  document_uploaded: 'Document Uploaded',
  eligibility_evaluated: 'Eligibility Evaluated',
  payment_processed: 'Payment Processed',
};

const CaseTimeline = ({ events, isLoading, error }: CaseTimelineProps) => {
  if (isLoading) {
    return (
      <DarkoneCard title="Case Timeline" titleTag="h5" className="mb-3">
        <div className="d-flex flex-column gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="d-flex gap-3">
              <div className="placeholder col-2"></div>
              <div className="flex-grow-1">
                <div className="placeholder col-6 mb-2"></div>
                <div className="placeholder col-4"></div>
              </div>
            </div>
          ))}
        </div>
      </DarkoneCard>
    );
  }

  if (error) {
    return (
      <DarkoneCard title="Case Timeline" titleTag="h5" className="mb-3">
        <div className="alert alert-danger mb-0" role="alert">
          <i className="bx bx-error-circle me-2"></i>
          {error}
        </div>
      </DarkoneCard>
    );
  }

  if (!events || events.length === 0) {
    return (
      <DarkoneCard title="Case Timeline" titleTag="h5" className="mb-3">
        <p className="text-muted mb-0">No events recorded yet.</p>
      </DarkoneCard>
    );
  }

  return (
    <DarkoneCard title="Case Timeline" titleTag="h5" className="mb-3">
      <div className="timeline-alt pb-0">
        {events.map((event, index) => (
          <div key={event.id} className={`timeline-item ${index === events.length - 1 ? 'pb-0' : ''}`}>
            <div className="d-flex">
              <div className="me-3 text-muted small" style={{ minWidth: '100px' }}>
                {format(new Date(event.created_at), 'dd MMM yyyy')}
                <br />
                <span className="text-muted">{format(new Date(event.created_at), 'HH:mm')}</span>
              </div>
              <div className="flex-grow-1">
                <h6 className="mb-1">
                  {eventTypeLabels[event.event_type] || event.event_type}
                </h6>
                {event.old_status && event.new_status && (
                  <p className="mb-1">
                    <CaseStatusBadge status={event.old_status} />
                    <i className="bx bx-right-arrow-alt mx-2"></i>
                    <CaseStatusBadge status={event.new_status} />
                  </p>
                )}
                {event.meta && Object.keys(event.meta).length > 0 && (
                  <p className="text-muted small mb-0">
                    {JSON.stringify(event.meta).slice(0, 100)}
                    {JSON.stringify(event.meta).length > 100 && '...'}
                  </p>
                )}
              </div>
            </div>
            {index < events.length - 1 && <hr className="my-3" />}
          </div>
        ))}
      </div>
    </DarkoneCard>
  );
};

export default CaseTimeline;
