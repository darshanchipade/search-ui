'use client';

import React, { useState } from 'react';
import { FilterIcon, CopyIcon } from './Icons';

export default function SearchResults({ results = [], isLoading = false, onFilter }) {
  const [activeTab, setActiveTab] = useState('raw');
  const [copiedStates, setCopiedStates] = useState({});

  const copyToClipboard = (text, resultId) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [resultId]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [resultId]: false }));
    }, 7000);
  };

  if (isLoading) {
    return <p>Searching...</p>;
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="content-stretch flex flex-col gap-4 items-start justify-start relative shrink-0">
      {/* Results Header */}
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
        <div className="font-sf-pro leading-[0] not-italic relative shrink-0 text-[18px] text-[#111215] text-nowrap tracking-[-0.288px]">
          <p className="leading-[normal] whitespace-pre">Search Results ({results.length})</p>
        </div>
        <div
          className="content-stretch flex gap-0.5 items-center justify-center relative shrink-0 cursor-pointer hover:opacity-70 transition-opacity"
          onClick={onFilter}
        >
          <div className="font-sf-pro font-medium leading-[0] not-italic relative shrink-0 text-[#111215] text-[12px] text-nowrap tracking-[-0.432px]">
            <p className="leading-[normal] whitespace-pre">Filter</p>
          </div>
          <div className="h-[7.019px] overflow-clip relative shrink-0 w-[12.12px]">
            <FilterIcon className="w-full h-full text-[#111215]" />
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="content-stretch flex flex-col gap-4 items-start justify-start relative shrink-0">
        {results.map((result) => (
          <div
            key={result.id}
            className="bg-white box-border content-stretch flex flex-col gap-4 items-start justify-start overflow-clip p-[16px] relative rounded-[12px] shadow-[0px_0.5px_2.5px_0px_rgba(0,0,0,0.3)] shrink-0 w-[556px]"
          >
            {/* Metadata */}
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-1.5 items-start justify-start leading-[0] not-italic relative shrink-0 text-nowrap">
                <div className="font-sf-pro font-semibold relative shrink-0 text-[#737780] text-[10px] tracking-[-0.36px]">
                  <p className="leading-[normal] text-nowrap whitespace-pre">Source</p>
                </div>
                <div className="font-sf-pro font-medium relative shrink-0 text-[#111215] text-[12px] tracking-[-0.432px]">
                  <p className="leading-[normal] text-nowrap whitespace-pre">{result.source}</p>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-1.5 items-start justify-start leading-[0] not-italic relative shrink-0 w-[318px]">
                <div className="font-sf-pro font-semibold relative shrink-0 text-[#737780] text-[10px] tracking-[-0.36px]">
                  <p className="leading-[normal] text-nowrap whitespace-pre">Section</p>
                </div>
                <div className="font-sf-pro font-medium relative shrink-0 text-[#111215] text-[12px] tracking-[-0.432px] w-full">
                  <p className="leading-[normal] break-all">
                    {result.section}
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-0 relative shrink-0 w-full">
              <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px] border-b border-[#d0d1d4]"></div>
            </div>

            {/* Content Tabs */}
            <div className="bg-[rgba(0,0,0,0.01)] box-border content-stretch flex h-[22px] items-start justify-start overflow-clip pl-px pr-0.5 py-px relative rounded-[6px] shrink-0 w-[164px]">
              <button
                onClick={() => setActiveTab('raw')}
                className={`basis-0 box-border content-stretch flex grow h-full items-center justify-center min-h-px min-w-px mr-[-1px] px-px py-0 relative rounded-[5px] shrink-0 transition-all duration-200 ${
                  activeTab === 'raw'
                    ? 'bg-[#111215] text-white'
                    : 'bg-transparent text-[#737780] hover:bg-gray-100'
                }`}
              >
                <div className="basis-0 flex flex-col font-sf-pro grow h-full justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[13px] text-center text-nowrap">
                  <p className="[white-space-collapse:collapse] leading-[16px] overflow-ellipsis overflow-hidden">Raw</p>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('format')}
                className={`basis-0 box-border content-stretch cursor-pointer flex grow h-5 items-start justify-start min-h-px min-w-px mr-[-1px] overflow-visible px-px py-0 relative rounded-[5px] shrink-0 transition-all duration-200 ${
                  activeTab === 'format'
                    ? 'bg-[#111215] text-white'
                    : 'bg-transparent text-[#737780] hover:bg-gray-100'
                }`}
              >
                <div className="basis-0 flex flex-col font-sf-pro grow h-5 justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[13px] text-center text-nowrap">
                  <p className="[white-space-collapse:collapse] leading-[16px] overflow-ellipsis overflow-hidden">Format</p>
                </div>
              </button>
              <div className="absolute inset-0 pointer-events-none shadow-[0px_0px_2px_0px_inset_rgba(0,0,0,0.05),0px_0px_4px_0px_inset_rgba(0,0,0,0.05),0px_0px_2px_0px_inset_rgba(0,0,0,0.05)]" />
            </div>

            {/* Content */}
            <div className="font-sf-pro font-medium leading-[0] min-w-full not-italic relative shrink-0 text-[#4d4d4d] text-[12px] tracking-[-0.432px]" style={{ width: "min-content" }}>
              <p className="leading-[normal]">{result.content}</p>
            </div>

            {/* Copy Button */}
            <div className="content-stretch flex gap-2 items-start justify-start relative shrink-0">
              <button
                onClick={() => copyToClipboard(result.content, result.id)}
                className={`from-[#ffffff2b] relative rounded-[24px] shrink-0 transition-all duration-200 cursor-pointer ${
                  copiedStates[result.id]
                    ? 'bg-gray-50 hover:bg-gray-50'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="box-border content-stretch flex gap-1 items-center justify-start overflow-clip px-3 py-[3px] relative">
                  <div className="h-3.5 overflow-clip relative shrink-0 w-[11.571px]">
                    <CopyIcon className="w-full h-full text-[#111215]" />
                  </div>
                  <div className="font-sf-pro font-medium leading-[0] not-italic relative shrink-0 text-[12px] text-nowrap tracking-[-0.432px] text-[#111215]">
                    <p className="leading-[20px] whitespace-pre">
                      {copiedStates[result.id] ? 'Copied' : 'Copy'}
                    </p>
                  </div>
                </div>
                <div aria-hidden="true" className="absolute border border-black border-solid inset-[-1px] pointer-events-none rounded-[25px] shadow-[0px_1px_2.5px_0px_rgba(0,122,255,0.24),0px_0px_0px_0.5px_rgba(0,122,255,0.12)]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
