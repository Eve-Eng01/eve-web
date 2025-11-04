import React from 'react';

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Paginator: React.FC<PaginatorProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 9;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      // Calculate start and end of visible range around current page
      let start = Math.max(2, currentPage - 2);
      let end = Math.min(totalPages - 1, currentPage + 2);

      // Adjust if we're near the beginning
      if (currentPage <= 4) {
        end = Math.min(maxVisiblePages - 1, totalPages - 1);
        start = 2;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 3) {
        start = Math.max(2, totalPages - maxVisiblePages + 2);
        end = totalPages - 1;
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('...');
      }

      // Add page numbers in range
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={`bg-[#f4f4f4] border-[#e9eaeb] border-b-0 border-l-0 border-r-0 border-solid border-t box-border content-stretch flex gap-[12px] items-center p-[10px] relative rounded-[16px] w-full ${className}`}
    >
      {/* Go back button */}
      <div className="flex h-[36px] items-center shrink-0">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="border border-[#eaeaea] border-solid box-border content-stretch cursor-pointer flex gap-[8px] h-[36px] items-center justify-center overflow-visible px-[12px] py-[14px] relative rounded-[8px] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
        >
          <p className="font-['Poppins',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[#777777] text-center">
            Go back
          </p>
        </button>
      </div>

      {/* Spacer - flex-1 to push page numbers to center */}
      <div className="flex-1"></div>

      {/* Page numbers - centered */}
      <div className="flex gap-[2px] items-start shrink-0">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <div
                key={`ellipsis-${index}`}
                className="bg-[#ffffff] overflow-clip relative rounded-[8px] shrink-0 w-[40px] h-[40px] flex items-center justify-center"
              >
                <p className="font-['Helvetica_Neue',sans-serif] font-medium leading-[20px] text-[14px] text-[#777777] text-center">
                  ...
                </p>
              </div>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <div
              key={pageNum}
              className="bg-[#ffffff] overflow-clip relative rounded-[8px] shrink-0 size-[40px]"
            >
              <button
                onClick={() => handlePageClick(pageNum)}
                className={`absolute box-border content-stretch flex items-center justify-center left-0 p-[8px] rounded-[8px] size-[40px] top-0 cursor-pointer transition-colors ${
                  isActive ? '' : 'hover:bg-[#f4f4f4]'
                }`}
              >
                <p
                  className={`font-[family-name:var(--font-family/font-family-body,'Helvetica_Neue:Medium',sans-serif)] font-medium leading-[20px] relative shrink-0 text-[14px] text-center ${
                    isActive ? 'text-[#5a5a5a]' : 'text-[#777777]'
                  }`}
                >
                  {pageNum}
                </p>
              </button>
            </div>
          );
        })}
      </div>

      {/* Spacer - flex-1 to balance and keep page numbers centered */}
      <div className="flex-1"></div>

      {/* Next page button */}
      <div className="flex h-[36px] items-center shrink-0">
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="border border-[#eaeaea] border-solid box-border content-stretch cursor-pointer flex gap-[8px] h-[36px] items-center justify-center overflow-visible px-[12px] py-[14px] relative rounded-[8px] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
        >
          <p className="font-['Poppins',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[#777777] text-center">
            Next page
          </p>
        </button>
      </div>
    </div>
  );
};

export default Paginator;

