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
    <div className="flex flex-col gap-3 border-t border-slate-800 bg-navy-light/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
      <div className="text-xs font-black uppercase tracking-wider text-slate-400">
        Showing {start}-{end} of {totalItems}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          className="select select-bordered select-sm h-9 rounded-sm border-slate-700 bg-navy text-xs font-bold"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          aria-label="Rows per page"
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>{option} / page</option>
          ))}
        </select>

        <div className="join rounded-sm border border-slate-700 bg-navy">
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
                  className={`btn btn-sm min-h-9 border-none px-3 text-xs font-black ${pageNumber === page ? "bg-gold text-white hover:bg-gold" : "btn-ghost text-slate-300"}`}
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
