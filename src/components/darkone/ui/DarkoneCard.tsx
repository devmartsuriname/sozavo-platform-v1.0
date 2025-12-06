import React from "react";

interface DarkoneCardProps {
  title?: string;
  subtitle?: React.ReactNode;
  titleTag?: 'h4' | 'h5';
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
  titleTag = 'h4',
  headerAction,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  children
}: DarkoneCardProps) => {
  const hasHeader = title || subtitle || headerAction;
  const TitleTag = titleTag;

  return (
    <div className={`card ${className}`.trim()}>
      {hasHeader && (
        <div className={`card-header d-flex justify-content-between align-items-center ${headerClassName}`.trim()}>
          <div>
            {title && <TitleTag className="card-title">{title}</TitleTag>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
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
