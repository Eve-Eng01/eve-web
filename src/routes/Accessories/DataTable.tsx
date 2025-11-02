import React, { useState, useEffect } from "react";
import Paginator from "./Paginator";

interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  itemsPerPage?: number;
  columnKeys?: string[]; // Optional: specify which columns to show and in what order
}

// Helper function to format key names to readable column names
const formatColumnName = (key: string): string => {
  // Convert camelCase or snake_case to Title Case
  return key
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/^\w/, (c) => c.toUpperCase()) // Capitalize first letter
    .trim();
};

const DataTable = <T extends Record<string, any>>({
  data,
  totalPages,
  onPageChange,
  className = "",
  itemsPerPage = 10,
  columnKeys,
}: DataTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const calculatedTotalPages =
    totalPages || Math.ceil(data.length / itemsPerPage);

  // Reset to page 1 if current page exceeds total pages (e.g., when data changes)
  useEffect(() => {
    if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
      setCurrentPage(1);
    }
  }, [calculatedTotalPages, currentPage]);

  if (!data || data.length === 0) {
    return (
      <div
        className={`bg-[rgba(244,244,244,0.7)] border border-[#eaeaea] rounded-[14px] p-8 text-center ${className}`}
      >
        <p className="font-medium text-[16px] text-[#777777]">
          No data available
        </p>
      </div>
    );
  }

  // Automatically detect columns from data structure
  // Collect all unique keys from all data rows to handle cases where rows might have different properties
  const detectColumns = (): string[] => {
    if (columnKeys) {
      // If columnKeys is provided, use it (allows custom ordering/selection)
      return columnKeys;
    }

    // Otherwise, automatically extract all unique keys from all data objects
    const allKeys = new Set<string>();
    data.forEach((row) => {
      Object.keys(row).forEach((key) => allKeys.add(key));
    });

    // Convert to array and maintain insertion order (object keys are ordered in ES2015+)
    return Array.from(allKeys);
  };

  const columns = detectColumns();

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  // Helper function to format cell values
  const formatCellValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return "—";
    } else if (React.isValidElement(value)) {
      // If it's already a React element, return it as-is
      return value;
    } else if (typeof value === "object") {
      // Only stringify if it's not a React element
      return JSON.stringify(value);
    } else if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    } else if (typeof value === "number") {
      return value.toString();
    } else {
      return String(value);
    }
  };

  return (
    <div className={`flex flex-col gap-0 ${className}`}>
      {/* Table Container */}
      <div className="bg-[rgba(244,244,244,0.7)] border border-[#eaeaea] border-solid rounded-[14px] w-full overflow-hidden p-4">
        <table className="w-full border-collapse ">
          <colgroup>
            {columns.map((column, index) => (
              <col
                key={`col-${column}-${index}`}
                style={{ width: `${100 / columns.length}%` }}
              />
            ))}
          </colgroup>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column}
                  className={`bg-[#ffffff] px-4 py-3 pb-3  ${
                    index === 0 ? "rounded-l-[10px]" : ""
                  } ${index === columns.length - 1 ? "rounded-r-[10px]" : ""}`}
                >
                  <p className="font-['Poppins',sans-serif] font-medium leading-[24px] text-[16px] text-[#777777] tracking-[0.08px] text-left whitespace-pre-wrap">
                    {formatColumnName(column)}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td
                    key={`${column}-${rowIndex}`}
                    className={`px-4 align-top ${rowIndex === 0 ? "pt-8 pb-[20px]" : "py-[20px]"}`}
                  >
                    {React.isValidElement(row[column]) ? (
                      <div className="font-['Poppins',sans-serif] flex items-center">
                        {row[column]}
                      </div>
                    ) : (
                      <p className="font-['Poppins',sans-serif] font-medium leading-[24px] text-[16px] text-[#2d2d2d] tracking-[0.08px]">
                        {formatCellValue(row[column])}
                      </p>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginator */}
      <div className="mt-4">
        <Paginator
          currentPage={currentPage}
          totalPages={calculatedTotalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default DataTable;
