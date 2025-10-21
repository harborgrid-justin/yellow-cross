import React, { forwardRef } from 'react';
import './Table.css';

export interface Column<T = any> {
  key: string;
  title: React.ReactNode;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  fixed?: 'left' | 'right';
  className?: string;
}

export interface TableProps<T = any> extends Omit<React.TableHTMLAttributes<HTMLTableElement>, 'className'> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: React.ReactNode;
  rowKey?: keyof T | ((record: T) => string | number);
  onRowClick?: (record: T, index: number) => void;
  onRowDoubleClick?: (record: T, index: number) => void;
  rowSelection?: {
    selectedRowKeys?: (string | number)[];
    onChange?: (selectedRowKeys: (string | number)[], selectedRows: T[]) => void;
    getCheckboxProps?: (record: T) => { disabled?: boolean };
  };
  pagination?: boolean;
  size?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  sticky?: boolean;
  className?: string;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  <T extends Record<string, any>>(
    {
      columns,
      data,
      loading = false,
      emptyMessage = 'No data available',
      rowKey = 'id',
      onRowClick,
      onRowDoubleClick,
      rowSelection,
      pagination = false,
      size = 'md',
      bordered = false,
      striped = false,
      hoverable = true,
      sticky = false,
      className = '',
      ...props
    }: TableProps<T>,
    ref: React.ForwardedRef<HTMLTableElement>
  ) => {
    const getRowKey = (record: T, index: number): string | number => {
      if (typeof rowKey === 'function') {
        return rowKey(record);
      }
      return record[rowKey] || index;
    };

    const isRowSelected = (record: T, index: number): boolean => {
      if (!rowSelection?.selectedRowKeys) return false;
      const key = getRowKey(record, index);
      return rowSelection.selectedRowKeys.includes(key);
    };

    const handleRowSelection = (record: T, index: number, checked: boolean) => {
      if (!rowSelection?.onChange) return;
      
      const key = getRowKey(record, index);
      const currentSelected = rowSelection.selectedRowKeys || [];
      
      let newSelected: (string | number)[];
      if (checked) {
        newSelected = [...currentSelected, key];
      } else {
        newSelected = currentSelected.filter(k => k !== key);
      }
      
      const selectedRows = data.filter((item, idx) => {
        const itemKey = getRowKey(item, idx);
        return newSelected.includes(itemKey);
      });
      
      rowSelection.onChange(newSelected, selectedRows);
    };

    const tableClasses = [
      'table',
      `table--${size}`,
      bordered && 'table--bordered',
      striped && 'table--striped',
      hoverable && 'table--hoverable',
      sticky && 'table--sticky',
      loading && 'table--loading',
      className
    ].filter(Boolean).join(' ');

    const renderCell = (column: Column<T>, record: T, index: number) => {
      if (column.render) {
        const value = column.dataIndex ? record[column.dataIndex] : undefined;
        return column.render(value, record, index);
      }
      
      if (column.dataIndex) {
        return record[column.dataIndex];
      }
      
      return null;
    };

    return (
      <div className="table-container">
        {loading && (
          <div className="table-loading">
            <div className="table-loading__spinner">
              <svg className="table-loading__icon" viewBox="0 0 24 24">
                <circle
                  className="table-loading__circle"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
              </svg>
            </div>
            <span className="table-loading__text">Loading...</span>
          </div>
        )}
        
        <div className="table-wrapper">
          <table ref={ref} className={tableClasses} {...props}>
            <thead className="table__head">
              <tr className="table__head-row">
                {rowSelection && (
                  <th className="table__head-cell table__head-cell--selection">
                    <input
                      type="checkbox"
                      className="table__checkbox"
                      checked={
                        data.length > 0 && 
                        data.every((record, index) => isRowSelected(record, index))
                      }
                      onChange={(e) => {
                        if (!rowSelection.onChange) return;
                        
                        if (e.target.checked) {
                          const allKeys = data.map((record, index) => getRowKey(record, index));
                          rowSelection.onChange(allKeys, data);
                        } else {
                          rowSelection.onChange([], []);
                        }
                      }}
                      aria-label="Select all rows"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={[
                      'table__head-cell',
                      column.align && `table__head-cell--${column.align}`,
                      column.sortable && 'table__head-cell--sortable',
                      column.fixed && `table__head-cell--fixed-${column.fixed}`,
                      column.className
                    ].filter(Boolean).join(' ')}
                    style={{ width: column.width }}
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="table__body">
              {data.length === 0 && !loading && (
                <tr className="table__empty-row">
                  <td 
                    className="table__empty-cell"
                    colSpan={columns.length + (rowSelection ? 1 : 0)}
                  >
                    <div className="table__empty">
                      <svg className="table__empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                      </svg>
                      <span className="table__empty-text">{emptyMessage}</span>
                    </div>
                  </td>
                </tr>
              )}
              
              {data.map((record, index) => (
                <tr
                  key={getRowKey(record, index)}
                  className={[
                    'table__body-row',
                    isRowSelected(record, index) && 'table__body-row--selected',
                    (onRowClick || onRowDoubleClick) && 'table__body-row--clickable'
                  ].filter(Boolean).join(' ')}
                  onClick={() => onRowClick?.(record, index)}
                  onDoubleClick={() => onRowDoubleClick?.(record, index)}
                >
                  {rowSelection && (
                    <td className="table__body-cell table__body-cell--selection">
                      <input
                        type="checkbox"
                        className="table__checkbox"
                        checked={isRowSelected(record, index)}
                        onChange={(e) => handleRowSelection(record, index, e.target.checked)}
                        disabled={rowSelection.getCheckboxProps?.(record)?.disabled}
                        aria-label={`Select row ${index + 1}`}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={[
                        'table__body-cell',
                        column.align && `table__body-cell--${column.align}`,
                        column.fixed && `table__body-cell--fixed-${column.fixed}`,
                        column.className
                      ].filter(Boolean).join(' ')}
                      style={{ width: column.width }}
                    >
                      {renderCell(column, record, index)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

Table.displayName = 'Table';
