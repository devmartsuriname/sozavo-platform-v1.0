import React from "react";
import DarkoneCard from "@/components/darkone/ui/DarkoneCard";
import DarkoneBadge from "@/components/darkone/ui/DarkoneBadge";
import type { CasePayment } from "@/integrations/supabase/queries/payments";

interface CasePaymentsPanelProps {
  payments: CasePayment[] | null;
  isLoading: boolean;
  error: string | null;
}

// Format currency as SRD with proper separators
const formatCurrency = (amount: number): string => {
  return `SRD ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Format payment method for display
const formatPaymentMethod = (method: string | null): string => {
  if (!method) return "—";
  const methodMap: Record<string, string> = {
    bank: "Bank Transfer",
    bank_transfer: "Bank Transfer",
    mobile_money: "Mobile Money",
    cash: "Cash",
  };
  return methodMap[method.toLowerCase()] || method;
};

// Format date for display
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Get badge variant for payment status
const getStatusBadgeVariant = (status: string): "warning" | "success" | "danger" | "secondary" => {
  const statusMap: Record<string, "warning" | "success" | "danger" | "secondary"> = {
    pending: "warning",
    processed: "success",
    failed: "danger",
    cancelled: "secondary",
  };
  return statusMap[status.toLowerCase()] || "secondary";
};

// Format status label
const formatStatusLabel = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const CasePaymentsPanel: React.FC<CasePaymentsPanelProps> = ({
  payments,
  isLoading,
  error,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <DarkoneCard title="Payments" titleTag="h5" className="mb-3">
        <div className="placeholder-glow">
          <div className="table-responsive">
            <table className="table table-centered mb-0">
              <thead>
                <tr>
                  <th><span className="placeholder col-8"></span></th>
                  <th><span className="placeholder col-6"></span></th>
                  <th><span className="placeholder col-6"></span></th>
                  <th><span className="placeholder col-8"></span></th>
                </tr>
              </thead>
              <tbody>
                {[1, 2].map((i) => (
                  <tr key={i}>
                    <td><span className="placeholder col-10"></span></td>
                    <td><span className="placeholder col-8"></span></td>
                    <td><span className="placeholder col-6"></span></td>
                    <td><span className="placeholder col-10"></span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DarkoneCard>
    );
  }

  // Error state
  if (error) {
    return (
      <DarkoneCard title="Payments" titleTag="h5" className="mb-3">
        <div className="alert alert-danger mb-0" role="alert">
          <i className="bx bx-error-circle me-2"></i>
          Failed to load payments: {error}
        </div>
      </DarkoneCard>
    );
  }

  // Empty state
  if (!payments || payments.length === 0) {
    return (
      <DarkoneCard title="Payments" titleTag="h5" className="mb-3">
        <p className="text-muted mb-0">
          <i className="bx bx-info-circle me-2"></i>
          No payments recorded for this case.
        </p>
      </DarkoneCard>
    );
  }

  // Data state
  return (
    <DarkoneCard title="Payments" titleTag="h5" className="mb-3">
      <div className="table-responsive">
        <table className="table table-centered mb-0">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{formatDate(payment.payment_date)}</td>
                <td className="fw-medium">{formatCurrency(payment.amount)}</td>
                <td>{formatPaymentMethod(payment.payment_method)}</td>
                <td>
                  <DarkoneBadge variant={getStatusBadgeVariant(payment.status)}>
                    {formatStatusLabel(payment.status)}
                  </DarkoneBadge>
                </td>
                <td>
                  {payment.subema_reference ? (
                    <code className="small">{payment.subema_reference}</code>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DarkoneCard>
  );
};

export default CasePaymentsPanel;
