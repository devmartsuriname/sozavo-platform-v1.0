import React from "react";
import DarkoneBadge from "@/components/darkone/ui/DarkoneBadge";

interface EligibilityResultBadgeProps {
  result: string | null;
}

/**
 * Maps eligibility result to visual badge
 * - ELIGIBLE / approved → success (soft)
 * - INELIGIBLE / rejected → danger (soft)
 * - pending / null / other → secondary (soft)
 */
const EligibilityResultBadge = ({ result }: EligibilityResultBadgeProps) => {
  const normalizedResult = result?.toLowerCase() || "";

  if (normalizedResult === "eligible" || normalizedResult === "approved") {
    return <DarkoneBadge variant="success" soft>Eligible</DarkoneBadge>;
  }

  if (normalizedResult === "ineligible" || normalizedResult === "rejected") {
    return <DarkoneBadge variant="danger" soft>Ineligible</DarkoneBadge>;
  }

  return <DarkoneBadge variant="secondary" soft>Pending</DarkoneBadge>;
};

export default EligibilityResultBadge;
