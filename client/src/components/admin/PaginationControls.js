"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function PaginationControls({
  totalItems,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(totalItems, page * pageSize);

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter((pageNumber) => pageNumber === 1 || pageNumber === totalPages || Math.abs(pageNumber - page) <= 1);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-xs font-black uppercase tracking-wider text-slate-500">
        Showing {start}-{end} of {totalItems}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          className="select select-bordered select-sm h-9 rounded-lg border-slate-200 bg-white text-xs font-bold"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          aria-label="Rows per page"
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>{option} / page</option>
          ))}
        </select>

        <div className="join rounded-lg border border-slate-200 bg-white">
          <button
            type="button"
            className="btn btn-ghost btn-sm join-item min-h-9 px-2"
            onClick={() => onPageChange(1)}
            disabled={page <= 1}
            aria-label="First page"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm join-item min-h-9 px-2"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {pageNumbers.map((pageNumber, index) => {
            const previous = pageNumbers[index - 1];
            const needsGap = previous && pageNumber - previous > 1;
            return (
              <span key={pageNumber} className="join-item inline-flex">
                {needsGap && <span className="px-2 py-2 text-xs font-black text-slate-300">...</span>}
                <button
                  type="button"
                  className={`btn btn-sm min-h-9 border-none px-3 text-xs font-black ${pageNumber === page ? "bg-indigo-600 text-white hover:bg-indigo-700" : "btn-ghost text-slate-600"}`}
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              </span>
            );
          })}

          <button
            type="button"
            className="btn btn-ghost btn-sm join-item min-h-9 px-2"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm join-item min-h-9 px-2"
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
            aria-label="Last page"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
