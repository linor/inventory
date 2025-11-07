
import { Table } from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";


function getPageNumbers(current: number, total: number) {
  // Show first, last, current, +/-1, and ellipsis as needed
  const pages: (number | 'ellipsis')[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }
  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, 'ellipsis', total);
  } else if (current >= total - 3) {
    pages.push(1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total);
  }
  return pages;
}

export default function TablePaging({ table }: { table: Table<any> }) {
  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;
  const pageNumbers = getPageNumbers(pageIndex + 1, pageCount);

  // For accessibility: announce page changes
  const liveRegionRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = `Page ${pageIndex + 1} of ${pageCount}`;
    }
  }, [pageIndex, pageCount]);

  return (
    <div className="flex flex-col items-end space-y-2 py-4">
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      <span className="text-sm text-muted-foreground mb-1">
        Page {pageIndex + 1} of {pageCount}
      </span>
      <Pagination className="">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => table.previousPage()}
              aria-disabled={pageIndex === 0}
              tabIndex={pageIndex === 0 ? -1 : 0}
            />
          </PaginationItem>
          {pageNumbers.map((num, idx) =>
            num === 'ellipsis' ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={num}>
                <PaginationLink
                  isActive={pageIndex + 1 === num}
                  aria-label={`Page ${num}`}
                  aria-current={pageIndex + 1 === num ? 'page' : undefined}
                  onClick={() => table.setPageIndex((num as number) - 1)}
                  tabIndex={0}
                >
                  {num}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => table.nextPage()}
              aria-disabled={pageIndex === pageCount - 1}
              tabIndex={pageIndex === pageCount - 1 ? -1 : 0}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
