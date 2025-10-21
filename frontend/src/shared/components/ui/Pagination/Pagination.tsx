import React, { forwardRef } from 'react';
import './Pagination.css';

export interface PaginationProps {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Number of page buttons to show around current page */
  siblingCount?: number;
  /** Whether to show first/last page buttons */
  showFirstLast?: boolean;
  /** Whether to show previous/next buttons */
  showPrevNext?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Pagination variant */
  variant?: 'default' | 'outline' | 'minimal' | 'legal';
  /** Whether pagination is disabled */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
  /** Page change handler */
  onPageChange: (page: number) => void;
  /** Custom labels */
  labels?: {
    previous?: string;
    next?: string;
    first?: string;
    last?: string;
    page?: string;
    of?: string;
  };
  /** Whether to show page info */
  showPageInfo?: boolean;
  /** Whether to show total count */
  showTotal?: boolean;
  /** Total number of items */
  totalItems?: number;
  /** Items per page */
  itemsPerPage?: number;
}

const defaultLabels = {
  previous: 'Previous',
  next: 'Next',
  first: 'First',
  last: 'Last',
  page: 'Page',
  of: 'of'
};

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  ({
    currentPage,
    totalPages,
    siblingCount = 1,
    showFirstLast = true,
    showPrevNext = true,
    size = 'md',
    variant = 'default',
    disabled = false,
    className = '',
    onPageChange,
    labels = defaultLabels,
    showPageInfo = false,
    showTotal = false,
    totalItems,
    itemsPerPage,
    ...props
  }, ref) => {
    const mergedLabels = { ...defaultLabels, ...labels };

    // Calculate pagination range
    const getPaginationRange = () => {
      const totalPageNumbers = siblingCount * 2 + 5; // siblings + current + first + last + 2 dots
      
      if (totalPages <= totalPageNumbers) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

      if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItemCount = 3 + 2 * siblingCount;
        const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
        return [...leftRange, '...', totalPages];
      }

      if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightItemCount = 3 + 2 * siblingCount;
        const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
        return [1, '...', ...rightRange];
      }

      if (shouldShowLeftDots && shouldShowRightDots) {
        const middleRange = Array.from(
          { length: rightSiblingIndex - leftSiblingIndex + 1 },
          (_, i) => leftSiblingIndex + i
        );
        return [1, '...', ...middleRange, '...', totalPages];
      }

      return [];
    };

    const paginationRange = getPaginationRange();

    // Calculate page info
    const getPageInfo = () => {
      if (!showPageInfo || !totalItems || !itemsPerPage) return null;
      
      const startItem = (currentPage - 1) * itemsPerPage + 1;
      const endItem = Math.min(currentPage * itemsPerPage, totalItems);
      
      return {
        start: startItem,
        end: endItem,
        total: totalItems
      };
    };

    const pageInfo = getPageInfo();

    // Handle page change
    const handlePageChange = (page: number | string) => {
      if (disabled || typeof page === 'string') return;
      if (page < 1 || page > totalPages || page === currentPage) return;
      onPageChange(page);
    };

    // Component classes
    const paginationClasses = [
      'pagination',
      `pagination--${size}`,
      `pagination--${variant}`,
      disabled && 'pagination--disabled',
      className
    ].filter(Boolean).join(' ');

    // Don't render if there's only one page or no pages
    if (totalPages <= 1) return null;

    return (
      <div ref={ref} className={paginationClasses} {...props}>
        <div className="pagination__controls">
          {/* First page button */}
          {showFirstLast && currentPage > 1 && (
            <button
              type="button"
              className="pagination__button pagination__button--first"
              onClick={() => handlePageChange(1)}
              disabled={disabled}
              aria-label={`Go to ${mergedLabels.first} page`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M11 12L7 8L11 4M5 12V4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="pagination__button-text">{mergedLabels.first}</span>
            </button>
          )}

          {/* Previous page button */}
          {showPrevNext && (
            <button
              type="button"
              className="pagination__button pagination__button--prev"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={disabled || currentPage === 1}
              aria-label={`Go to ${mergedLabels.previous} page`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="pagination__button-text">{mergedLabels.previous}</span>
            </button>
          )}

          {/* Page numbers */}
          <div className="pagination__pages">
            {paginationRange.map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="pagination__ellipsis">
                    ...
                  </span>
                );
              }

              const pageNumber = page as number;
              const isActive = pageNumber === currentPage;

              return (
                <button
                  key={pageNumber}
                  type="button"
                  className={[
                    'pagination__button',
                    'pagination__button--page',
                    isActive && 'pagination__button--active'
                  ].filter(Boolean).join(' ')}
                  onClick={() => handlePageChange(pageNumber)}
                  disabled={disabled || isActive}
                  aria-label={`Go to ${mergedLabels.page} ${pageNumber}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          {/* Next page button */}
          {showPrevNext && (
            <button
              type="button"
              className="pagination__button pagination__button--next"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={disabled || currentPage === totalPages}
              aria-label={`Go to ${mergedLabels.next} page`}
            >
              <span className="pagination__button-text">{mergedLabels.next}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 4L10 8L6 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {/* Last page button */}
          {showFirstLast && currentPage < totalPages && (
            <button
              type="button"
              className="pagination__button pagination__button--last"
              onClick={() => handlePageChange(totalPages)}
              disabled={disabled}
              aria-label={`Go to ${mergedLabels.last} page`}
            >
              <span className="pagination__button-text">{mergedLabels.last}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M5 4L9 8L5 12M11 4V12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Page info */}
        {(showPageInfo || showTotal) && (
          <div className="pagination__info">
            {showTotal && totalItems && (
              <span className="pagination__total">
                Total: {totalItems.toLocaleString()} items
              </span>
            )}
            {showPageInfo && pageInfo && (
              <span className="pagination__page-info">
                Showing {pageInfo.start.toLocaleString()}-{pageInfo.end.toLocaleString()} {mergedLabels.of} {pageInfo.total.toLocaleString()}
              </span>
            )}
            {!showPageInfo && !showTotal && (
              <span className="pagination__current">
                {mergedLabels.page} {currentPage} {mergedLabels.of} {totalPages}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

// Legal-specific pagination variants
export const LegalPagination = (props: Omit<PaginationProps, 'variant'>) => (
  <Pagination {...props} variant="legal" />
);

export const MinimalPagination = (props: Omit<PaginationProps, 'variant' | 'showFirstLast'>) => (
  <Pagination {...props} variant="minimal" showFirstLast={false} />
);

// Hook for pagination logic
export const usePagination = (totalItems: number, itemsPerPage: number, initialPage: number = 1) => {
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);

  const getPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return { startIndex, endIndex };
  };

  return {
    currentPage,
    totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    getPageItems,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  };
};

Pagination.displayName = 'Pagination';
