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
    <div className={`bg-[#f9f9f9] box-border flex flex-col gap-12 items-center justify-start overflow-clip px-6 md:px-16 pt-16 pb-6 rounded-[16px] w-full ${className}`}>
      {/* Main Content */}
      <div className="flex flex-col gap-8 items-center justify-start w-full">
        {/* Search Header */}
        <div className="flex flex-col gap-2 items-center">
          <h1 className="font-sf-pro font-medium text-[32px] md:text-[48px] tracking-[-0.768px] text-[#111215] text-center">
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
