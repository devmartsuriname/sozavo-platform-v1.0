import React from "react";

interface Column<T> {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

interface DarkoneTableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  variant?: 'default' | 'striped' | 'hover' | 'bordered';
  size?: 'default' | 'sm';
  className?: string;
  emptyMessage?: string;
}

function DarkoneTable<T extends object>({
  columns,
  data,
  variant = 'default',
  size = 'default',
  className = '',
  emptyMessage = 'No data available'
}: DarkoneTableProps<T>) {
  const variantClasses: Record<string, string> = {
    default: '',
    striped: 'table-striped',
    hover: 'table-hover',
    bordered: 'table-bordered'
  };

  const sizeClass = size === 'sm' ? 'table-sm' : '';

  const getCellValue = (row: T, key: keyof T | string): React.ReactNode => {
    if (typeof key === 'string' && key.includes('.')) {
      const keys = key.split('.');
      let value: unknown = row;
      for (const k of keys) {
        value = (value as Record<string, unknown>)?.[k];
      }
      return value as React.ReactNode;
    }
    return row[key as keyof T] as React.ReactNode;
  };

  return (
    <div className="table-responsive">
      <table className={`table table-centered mb-0 ${variantClasses[variant]} ${sizeClass} ${className}`.trim()}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={col.className}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center text-muted py-4">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={col.className}>
                    {col.render ? col.render(row, rowIdx) : getCellValue(row, col.key)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DarkoneTable;
