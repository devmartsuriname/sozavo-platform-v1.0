import React from "react";

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';

interface DarkoneBadgeProps {
  variant?: BadgeVariant;
  soft?: boolean;
  pill?: boolean;
  className?: string;
  children: React.ReactNode;
}

const DarkoneBadge = ({
  variant = 'primary',
  soft = false,
  pill = false,
  className = '',
  children
}: DarkoneBadgeProps) => {
  const baseClass = 'badge';
  const variantClass = soft ? `badge-soft-${variant}` : `bg-${variant}`;
  const pillClass = pill ? 'rounded-pill' : '';

  return (
    <span className={`${baseClass} ${variantClass} ${pillClass} ${className}`.trim()}>
      {children}
    </span>
  );
};

export default DarkoneBadge;
