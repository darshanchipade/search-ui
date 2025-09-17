'use client';

import React from 'react';
import SearchInterface from './SearchInterface';
import SearchResults from './SearchResults';

export default function ChatScreen({
  className = '',
  searchQuery,
  setSearchQuery,
  handleSearch,
  filters,
  toggleFilter,
  searchResults,
  isSearching,
}) {
  return (
    <div className={`bg-[#f9f9f9] box-border content-stretch flex flex-col gap-12 items-center justify-start overflow-clip px-16 pt-16 pb-4 relative rounded-[16px] size-full ${className}`}>
      {/* Main Content */}
      <div className="content-stretch flex flex-col gap-8 items-center justify-start relative shrink-0">
        {/* Search Header */}
        <div className="content-stretch flex flex-col gap-2 items-center justify-start leading-[0] not-italic relative shrink-0 text-black text-nowrap">
          <h1 className="font-sf-pro font-medium relative shrink-0 text-[48px] tracking-[-0.768px] leading-[normal] text-nowrap whitespace-pre text-[#111215]">
            What are you looking for?
          </h1>
        </div>

        {/* Search Interface */}
        <SearchInterface
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          filters={filters}
          toggleFilter={toggleFilter}
        />

        {/* Search Results */}
        <SearchResults results={searchResults} isLoading={isSearching} />
      </div>
    </div>
  );
}
