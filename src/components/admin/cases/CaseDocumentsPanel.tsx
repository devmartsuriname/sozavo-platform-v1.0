import React from "react";
import DarkoneCard from "@/components/darkone/ui/DarkoneCard";
import DarkoneBadge from "@/components/darkone/ui/DarkoneBadge";
import type { CaseDocument } from "@/integrations/supabase/queries/documents";

interface CaseDocumentsPanelProps {
  documents: CaseDocument[] | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Formats document type enum to readable label
 * e.g., "id_card" → "ID Card", "income_proof" → "Income Proof"
 */
const formatDocumentType = (type: string): string => {
  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Formats file size in bytes to human readable format
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

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
    });
  } catch {
    return dateString;
  }
};

/**
 * Returns badge variant based on document status
 */
const getStatusBadgeVariant = (status: string): "warning" | "success" | "danger" | "secondary" => {
  switch (status) {
    case "pending":
      return "warning";
    case "verified":
      return "success";
    case "rejected":
      return "danger";
    case "expired":
      return "secondary";
    default:
      return "secondary";
  }
};

/**
 * Formats status for display
 */
const formatStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * CaseDocumentsPanel displays documents for a case
 * Uses only Darkone/Bootstrap classes (no Tailwind, no ShadCN)
 */
const CaseDocumentsPanel = ({
  documents,
  isLoading,
  error,
}: CaseDocumentsPanelProps) => {
  // Loading skeleton
  if (isLoading) {
    return (
      <DarkoneCard title="Documents" titleTag="h5" className="mb-3">
        <div className="placeholder-glow">
          <div className="placeholder col-12 mb-2" style={{ height: "120px" }}></div>
        </div>
      </DarkoneCard>
    );
  }

  // Error state
  if (error) {
    return (
      <DarkoneCard title="Documents" titleTag="h5" className="mb-3">
        <div className="alert alert-danger mb-0" role="alert">
          <i className="bx bx-error-circle me-2"></i>
          Error loading documents: {error}
        </div>
      </DarkoneCard>
    );
  }

  // No documents exist
  if (!documents || documents.length === 0) {
    return (
      <DarkoneCard title="Documents" titleTag="h5" className="mb-3">
        <p className="text-muted mb-0">
          <i className="bx bx-info-circle me-2"></i>
          No documents uploaded for this case yet.
        </p>
      </DarkoneCard>
    );
  }

  return (
    <DarkoneCard title="Documents" titleTag="h5" className="mb-3">
      <div className="table-responsive">
        <table className="table table-sm table-striped mb-0">
          <thead>
            <tr>
              <th>Type</th>
              <th>File Name</th>
              <th className="text-end">Size</th>
              <th className="text-center">Status</th>
              <th className="text-end">Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td>{formatDocumentType(doc.document_type)}</td>
                <td>
                  <span className="text-truncate d-inline-block" style={{ maxWidth: "150px" }} title={doc.file_name}>
                    {doc.file_name}
                  </span>
                </td>
                <td className="text-end">{formatFileSize(doc.file_size)}</td>
                <td className="text-center">
                  <DarkoneBadge variant={getStatusBadgeVariant(doc.status)} soft>
                    {formatStatus(doc.status)}
                  </DarkoneBadge>
                </td>
                <td className="text-end">
                  <small className="text-muted">{formatDate(doc.created_at)}</small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Rejection reason display for rejected documents */}
      {documents.some((doc) => doc.status === "rejected" && doc.rejection_reason) && (
        <div className="mt-3">
          <small className="text-muted d-block mb-1">Rejection Notes:</small>
          {documents
            .filter((doc) => doc.status === "rejected" && doc.rejection_reason)
            .map((doc) => (
              <div key={doc.id} className="alert alert-warning py-2 mb-1">
                <small>
                  <strong>{formatDocumentType(doc.document_type)}:</strong> {doc.rejection_reason}
                </small>
              </div>
            ))}
        </div>
      )}
    </DarkoneCard>
  );
};

export default CaseDocumentsPanel;
