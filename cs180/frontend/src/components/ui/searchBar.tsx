// src/components/ui/searchBar.tsx
"use client";

import { useState, type SubmitEvent } from "react";

type SearchBarProps = {
  placeholder?: string;
  onSearch?: (query: string) => void; // what happens when the user searches
  className?: string;
};

export default function SearchBar({
  placeholder = "Search",
  onSearch,
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault(); // stop the page from reloading
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch?.(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      {/* Hidden label for screen readers */}
      <label htmlFor="search" className="sr-only">
        Search
      </label>

      <div className="relative">
        {/* Magnifying glass, inside the left edge of the input */}
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
          <svg
            className="h-4 w-4 text-[#D4D4D4]/60"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth={2}
              d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>

        <input
          type="search"
          id="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="block w-full rounded-full border border-[#D4D4D4]/20 bg-[#111] p-3 ps-10 pe-4 text-sm text-[#F5F7FA] placeholder:text-[#D4D4D4]/50 shadow-xs outline-none focus:border-[#D4D4D4]/60 focus:ring-2 focus:ring-[#D4D4D4]/20"
        />
      </div>
    </form>
  );
}