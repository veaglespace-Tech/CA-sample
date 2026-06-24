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
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between transition-all duration-400 hover:shadow-md">
      <div className="text-[11px] font-black uppercase tracking-widest text-slate-500">
        Showing <span className="text-slate-900">{start}-{end}</span> of <span className="text-slate-900">{totalItems}</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          className="select select-bordered select-sm h-9 rounded-xl border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:border-gold focus:ring-1 focus:ring-gold"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          aria-label="Rows per page"
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>{option} / page</option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 disabled:hover:bg-slate-50 disabled:hover:text-slate-500"
            onClick={() => onPageChange(1)}
            disabled={page <= 1}
            aria-label="First page"
          >
            <ChevronsLeft size={16} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 disabled:hover:bg-slate-50 disabled:hover:text-slate-500"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>

          <div className="flex items-center gap-1 px-1">
            {pageNumbers.map((pageNumber, index) => {
              const previous = pageNumbers[index - 1];
              const needsGap = previous && pageNumber - previous > 1;
              return (
                <span key={pageNumber} className="flex items-center gap-1">
                  {needsGap && <span className="flex h-9 w-5 items-center justify-center text-xs font-black text-slate-400">...</span>}
                  <button
                    type="button"
                    className={`flex h-9 min-w-[36px] items-center justify-center rounded-xl px-3 text-xs font-black transition-all ${
                      pageNumber === page 
                        ? "bg-gold text-white shadow-md shadow-gold/20 hover:bg-gold/90 hover:-translate-y-0.5" 
                        : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                    onClick={() => onPageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                </span>
              );
            })}
          </div>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 disabled:hover:bg-slate-50 disabled:hover:text-slate-500"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 disabled:hover:bg-slate-50 disabled:hover:text-slate-500"
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
            aria-label="Last page"
          >
            <ChevronsRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
