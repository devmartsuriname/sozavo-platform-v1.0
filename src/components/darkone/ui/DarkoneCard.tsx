import React from "react";

interface DarkoneCardProps {
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}

const DarkoneCard = ({
  title,
  subtitle,
  headerAction,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  children
}: DarkoneCardProps) => {
  const hasHeader = title || subtitle || headerAction;

  return (
    <div className={`card ${className}`.trim()}>
      {hasHeader && (
        <div className={`card-header d-flex justify-content-between align-items-center ${headerClassName}`.trim()}>
          <div>
            {title && <h4 className="card-title mb-0">{title}</h4>}
            {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
          </div>
          {headerAction}
        </div>
      )}
      <div className={`card-body ${bodyClassName}`.trim()}>
        {children}
      </div>
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default DarkoneCard;
