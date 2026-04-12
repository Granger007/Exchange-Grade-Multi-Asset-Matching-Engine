import React from 'react';

export interface TableColumn<T> {
  key: string;
  title: string;
  render?: (value: any, item?: T, index?: number) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
}

export const Table = <T extends Record<string, any>>({
  data,
  columns,
  className = '',
  loading = false,
  emptyMessage = 'No data available'
}: TableProps<T>) => {
  return (
    <div className={`glass-card overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`text-left text-xs font-medium text-white/70 px-4 py-3 ${column.className || ''}`}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8">
                  <div className="inline-flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-blue/30 border-t-primary-blue rounded-full animate-spin"></div>
                    <span className="text-white/50">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8">
                  <p className="text-white/50 text-sm">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={item.id || String(index)}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-4 py-3 text-sm text-white/90"
                    >
                      {column.render ? column.render(item[column.key], item, index) : String(item[column.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
