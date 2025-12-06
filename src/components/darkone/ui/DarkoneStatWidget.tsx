import React from "react";
import Icon from "./Icon";
import SparklineChart from "../charts/SparklineChart";

interface TrendInfo {
  value: string;
  direction: 'up' | 'down';
}

interface DarkoneStatWidgetProps {
  title: string;
  value: string | number;
  icon: string;
  sparklineData?: number[];
  trend?: TrendInfo;
  className?: string;
}

const DarkoneStatWidget = ({
  title,
  value,
  icon,
  sparklineData,
  trend,
  className = ''
}: DarkoneStatWidgetProps) => {
  return (
    <div className={`card ${className}`.trim()}>
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h4 className="card-title mb-2">{title}</h4>
            <p className="text-muted fw-medium mb-0 fs-17">{value}</p>
            {trend && (
              <p className={`mb-0 text-${trend.direction === 'up' ? 'success' : 'danger'}`}>
                <i className={`bx bx-trending-${trend.direction} me-1`}></i>
                {trend.value}
              </p>
            )}
          </div>
          <div>
            <span className="avatar bg-primary-subtle">
              <Icon icon={icon} className="fs-28 text-primary" />
            </span>
          </div>
        </div>
        {sparklineData && sparklineData.length > 0 && (
          <SparklineChart data={sparklineData} />
        )}
      </div>
    </div>
  );
};

export default DarkoneStatWidget;
