"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

export default function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder,
  icon,
  error,
  success,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Icon */}
      {icon && (
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 z-10">
          {icon}
        </span>
      )}

      {/* Select Trigger */}
      <button
        type="button"
        className={`w-full text-left flex items-center justify-between pl-11 pr-4 h-11 rounded-sm text-sm font-medium border focus:outline-none focus:ring-4 focus:ring-gold/10 focus:border-gold transition-all duration-300 ${
          error
            ? "border-rose-300 bg-rose-50/20 text-rose-700"
            : success
            ? "border-emerald-300 bg-emerald-50/20 text-slate-900"
            : "border-slate-200 hover:border-slate-300 text-slate-900 bg-white shadow-sm"
        }`}
        onClick={() => {
          setIsOpen(!isOpen);
          setSearchQuery(""); // Reset search on open
        }}
      >
        <span className={value ? "text-slate-900" : "text-slate-500"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-none shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden transform opacity-100 scale-100 transition-all duration-200">
          <div className="p-2 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <ul className="max-h-60 overflow-y-auto p-2 space-y-1 bg-white relative z-50">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  className={`px-3 py-2.5 rounded-sm text-sm font-medium cursor-pointer transition-colors ${
                    value === option
                      ? "bg-gold/10 text-gold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-sm text-slate-500 text-center">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
