import React from 'react';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}
interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}
interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {}
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const Table: React.FC<TableProps> = ({ className = '', children, ...props }) => (
  <div className="w-full overflow-auto">
    <table className={`w-full caption-bottom text-sm ${className}`} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<TableHeaderProps> = ({ className = '', ...props }) => (
  <thead className={`[&_tr]:border-b ${className}`} {...props} />
);

export const TableBody: React.FC<TableBodyProps> = ({ className = '', ...props }) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
);

export const TableRow: React.FC<TableRowProps> = ({ className = '', ...props }) => (
  <tr
    className={`border-b border-gray-800 transition-colors hover:bg-gray-800/50 data-[state=selected]:bg-gray-800 ${className}`}
    {...props}
  />
);

export const TableHead: React.FC<TableHeadProps> = ({ className = '', ...props }) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-gray-400 [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  />
);

export const TableCell: React.FC<TableCellProps> = ({ className = '', ...props }) => (
  <td
    className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  />
);
