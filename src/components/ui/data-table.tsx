import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface Column<T> {
  key: keyof T;
  header: string;
  cell?: (value: T[keyof T], row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  searchable?: boolean;
  sortable?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  className?: string;
  emptyMessage?: string;
  isLoading?: boolean;
}

interface SortConfig<T> {
  key: keyof T;
  direction: 'asc' | 'desc';
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  pageSize = 10,
  searchable = true,
  sortable = true,
  selectable = false,
  onRowSelect,
  className,
  emptyMessage = "No data available",
  isLoading = false
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortConfig, setSortConfig] = React.useState<SortConfig<T> | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedRows, setSelectedRows] = React.useState<Set<number>>(new Set());

  // Filter data based on search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;
    
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle sorting
  const handleSort = (key: keyof T) => {
    if (!sortable) return;
    
    setSortConfig((currentSort) => {
      if (currentSort?.key === key) {
        if (currentSort.direction === 'asc') {
          return { key, direction: 'desc' };
        } else {
          return null; // Remove sort
        }
      } else {
        return { key, direction: 'asc' };
      }
    });
  };

  // Handle row selection
  const handleRowSelect = (index: number, isSelected: boolean) => {
    if (!selectable) return;

    const newSelectedRows = new Set(selectedRows);
    if (isSelected) {
      newSelectedRows.add(index);
    } else {
      newSelectedRows.delete(index);
    }
    setSelectedRows(newSelectedRows);

    // Call callback with selected data
    if (onRowSelect) {
      const selectedData = Array.from(newSelectedRows).map(i => sortedData[i]);
      onRowSelect(selectedData);
    }
  };

  // Handle select all
  const handleSelectAll = (isSelected: boolean) => {
    if (!selectable) return;

    if (isSelected) {
      const allIndexes = new Set(sortedData.map((_, index) => index));
      setSelectedRows(allIndexes);
      onRowSelect?.(sortedData);
    } else {
      setSelectedRows(new Set());
      onRowSelect?.([]);
    }
  };

  const isAllSelected = selectedRows.size === sortedData.length && sortedData.length > 0;
  const isSomeSelected = selectedRows.size > 0 && selectedRows.size < sortedData.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Search */}
      {searchable && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>
      )}

      {/* Table */}
      <div className="border rounded-md">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              {selectable && (
                <th className="w-10 p-3">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-border"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "p-3 text-left font-medium text-muted-foreground",
                    column.sortable !== false && sortable && "cursor-pointer hover:text-foreground",
                    column.width && { width: column.width }
                  )}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {sortable && column.sortable !== false && sortConfig?.key === column.key && (
                      <span className="text-xs">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="p-8 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => {
                const actualIndex = (currentPage - 1) * pageSize + index;
                const isSelected = selectedRows.has(actualIndex);
                
                return (
                  <tr
                    key={actualIndex}
                    className={cn(
                      "border-b hover:bg-muted/50",
                      isSelected && "bg-muted"
                    )}
                  >
                    {selectable && (
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleRowSelect(actualIndex, e.target.checked)}
                          className="rounded border-border"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={String(column.key)} className="p-3">
                        {column.cell
                          ? column.cell(row[column.key], row)
                          : String(row[column.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} of{' '}
            {sortedData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}