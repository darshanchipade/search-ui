'use client';

import React from 'react';
import { SearchIcon, CloseIcon } from './Icons';

export default function SearchInterface({
  searchQuery,
  setSearchQuery,
  handleSearch,
  filters,
  toggleFilter,
}) {
  const clearSearch = () => setSearchQuery('');

  const onFormSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      {/* Search Input */}
      <div className="w-full">
        <form onSubmit={onFormSubmit} className="flex gap-2 items-center justify-center w-full">
          <div className="bg-white h-[50px] relative rounded-[12px] w-full max-w-3xl">
            <div className="box-border flex h-[50px] items-center justify-between overflow-clip px-4 py-3 w-full">
              <div className="flex font-sf-pro font-medium gap-2 items-center text-[#4d4d4d] w-full">
                <SearchIcon className="w-4 h-4 text-[#4d4d4d] flex-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-[14px] leading-[20px] text-[#4d4d4d] placeholder-[#9aa0a6] w-full"
                />
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="flex items-center justify-center text-gray-500 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              )}
            </div>
            <div aria-hidden="true" className="absolute border border-[#d0d1d4] inset-0 pointer-events-none rounded-[12px] shadow-[0px_0.5px_2.5px_0px_rgba(0,0,0,0.3)]" />
          </div>

          <button
            type="submit"
            className="bg-[#2180f9] text-white h-[50px] px-6 rounded-[12px] shadow hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter Tags */}
      {filters.length > 0 && (
        <div className="flex flex-col gap-4 items-center w-full">
          <div className="font-sf-pro text-[14px] text-[#111215]">
            Refine your search by
          </div>
          <div className="flex gap-2.5 items-start flex-wrap w-full max-w-4xl">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter)}
                className={`box-border flex gap-1 items-center justify-center px-3 py-2 rounded-[24px] shadow-[0px_1px_2.5px_0px_rgba(0,0,0,0.24),0px_0px_0px_0.5px_rgba(0,0,0,0.12)] transition-all duration-200 ${
                  filter.isActive ? 'bg-[#2180f9] text-white' : 'bg-white text-[#4d4d4d] hover:bg-gray-50'
                }`}
              >
                <span className="font-sf-pro font-medium text-[12px] tracking-[-0.432px]">
                  {filter.label} ({filter.count})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
