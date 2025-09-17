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
  const clearSearch = () => {
    setSearchQuery('');
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="content-stretch flex flex-col gap-4 items-center justify-start relative shrink-0">
      {/* Search Input */}
      <div className="content-stretch flex flex-col gap-2 items-start justify-start relative shrink-0">
        <form onSubmit={onFormSubmit} className="content-stretch flex gap-2 items-center justify-start relative shrink-0">
          <div className="bg-white h-[50px] relative rounded-[12px] shrink-0 w-[556px]">
            <div className="box-border content-stretch flex h-[50px] items-center justify-between leading-[0] not-italic overflow-clip px-4 py-3 relative text-nowrap w-[556px]">
              <div className="content-stretch flex font-sf-pro font-medium gap-1.5 items-center justify-start relative shrink-0 text-[#4d4d4d] w-full">
                <div className="flex flex-col justify-center relative shrink-0 text-[13px] text-center">
                  <SearchIcon className="w-4 h-4 text-[#4d4d4d]" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-[12px] tracking-[-0.432px] leading-[20px] text-[#4d4d4d] placeholder-[#4d4d4d] flex-1"
                />
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="flex flex-col justify-center relative shrink-0 text-[13px] text-[grey] text-center cursor-pointer hover:text-gray-600 transition-colors"
                >
                  <CloseIcon className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
            <div aria-hidden="true" className="absolute border border-[#d0d1d4] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_0.5px_2.5px_0px_rgba(0,0,0,0.3)]" />
          </div>
          <button
            type="submit"
            className="bg-[#2180f9] text-white h-[50px] px-6 rounded-[12px] shadow-[0px_1px_2.5px_0px_rgba(0,0,0,0.24)] hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter Tags */}
      {filters.length > 0 && (
        <div className="content-stretch flex flex-col gap-4 items-center justify-start relative shrink-0">
          <div className="font-sf-pro leading-[0] not-italic relative shrink-0 text-[14px] text-[#111215] text-nowrap tracking-[-0.224px]">
            <p className="leading-[normal] whitespace-pre">Refine your search by</p>
          </div>
          <div className="content-stretch flex gap-2.5 items-start justify-start relative shrink-0 flex-wrap max-w-[620px]">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter)}
                className={`box-border content-stretch flex from-[#ffffff2b] gap-0.5 items-center justify-center overflow-clip px-3 py-2 relative rounded-[24px] shadow-[0px_1px_2.5px_0px_rgba(0,0,0,0.24),0px_0px_0px_0.5px_rgba(0,0,0,0.12)] shrink-0 to-[#ffffff00] cursor-pointer transition-all duration-200 ${
                  filter.isActive
                    ? 'bg-[#2180f9] text-white'
                    : 'bg-white text-[#4d4d4d] hover:bg-gray-50'
                }`}
              >
                <div className={`font-sf-pro font-medium leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap tracking-[-0.432px] ${
                  filter.isActive ? 'text-white' : 'text-[#4d4d4d]'
                }`}>
                  <p className="leading-[20px] whitespace-pre">
                    {filter.label} ({filter.count})
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
