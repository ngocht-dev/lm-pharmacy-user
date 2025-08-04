'use client';

import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ResponsiveTableColumn {
  key: string;
  header: string;
  className?: string;
  mobileLabel?: string;
}

interface ResponsiveTableProps {
  columns: ResponsiveTableColumn[];
  data: any[];
  renderCell: (item: any, column: ResponsiveTableColumn) => ReactNode;
  renderMobileCard?: (item: any, index: number) => ReactNode;
  keyExtractor?: (item: any, index: number) => string;
  className?: string;
}

export function ResponsiveTable({
  columns,
  data,
  renderCell,
  renderMobileCard,
  keyExtractor = (item, index) => item.id || index.toString(),
  className = '',
}: ResponsiveTableProps) {
  return (
    <>
      {/* Desktop Table View */}
      <div className={`hidden md:block ${className}`}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={keyExtractor(item, index)}>
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {renderCell(item, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data.map((item, index) => (
          <Card key={keyExtractor(item, index)} className="p-4">
            {renderMobileCard ? (
              renderMobileCard(item, index)
            ) : (
              <div className="space-y-3">
                {columns.map((column) => (
                  <div key={column.key} className="flex justify-between items-start">
                    <span className="text-sm text-gray-600 font-medium min-w-0 flex-1">
                      {column.mobileLabel || column.header}:
                    </span>
                    <div className="text-sm text-right min-w-0 flex-1">
                      {renderCell(item, column)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}

// Example usage component for reference
export function ExampleResponsiveTable() {
  const columns = [
    { key: 'name', header: 'Name', mobileLabel: 'Tên' },
    { key: 'email', header: 'Email', mobileLabel: 'Email' },
    { key: 'status', header: 'Status', className: 'text-center', mobileLabel: 'Trạng thái' },
    { key: 'actions', header: 'Actions', className: 'text-right', mobileLabel: 'Thao tác' },
  ];

  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
  ];

  const renderCell = (item: any, column: ResponsiveTableColumn) => {
    switch (column.key) {
      case 'name':
        return <span className="font-medium">{item.name}</span>;
      case 'email':
        return <span className="text-gray-600">{item.email}</span>;
      case 'status':
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${
            item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {item.status}
          </span>
        );
      case 'actions':
        return (
          <div className="flex space-x-2">
            <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
            <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ResponsiveTable
      columns={columns}
      data={data}
      renderCell={renderCell}
    />
  );
}
