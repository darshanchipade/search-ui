'use client';

import React, { useMemo, useState } from 'react';
import { FilterIcon, CopyIcon } from './Icons';

export default function SearchResults({ results = [], isLoading = false, onFilter }) {
  const [activeTab, setActiveTab] = useState('raw');
  const [copiedStates, setCopiedStates] = useState({});

  const list = useMemo(() => {
    // Accept either an array, or an object with {results: []}
    if (Array.isArray(results)) return results;
    if (results && Array.isArray(results.results)) return results.results;
    return [];
  }, [results]);

  const copyToClipboard = (text, resultId) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text || '');
    }
    setCopiedStates(prev => ({ ...prev, [resultId]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [resultId]: false }));
    }, 2000);
  };

  if (isLoading) return <p>Searching...</p>;
  if (list.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      {/* Results Header */}
      <div className="flex items-center justify-between w-full max-w-3xl">
        <div className="font-sf-pro text-[18px] text-[#111215]">
          Search Results ({list.length})
        </div>
        <button
          className="flex gap-1 items-center hover:opacity-70 transition-opacity"
          onClick={onFilter}
        >
          <span className="font-sf-pro font-medium text-[12px]">Filter</span>
          <span className="h-[14px] w-[14px]">
            <FilterIcon className="w-full h-full text-[#111215]" />
          </span>
        </button>
      </div>

      {/* Results List */}
      <div className="flex flex-col gap-4 items-stretch w-full max-w-3xl">
        {list.map((result, idx) => {
          // Support either {source,section,content} or {sourceFieldName,sectionPath,cleansedText}
          const source = result.source ?? result.sourceFieldName ?? '';
          const section = result.section ?? result.sectionPath ?? '';
          const content = result.content ?? result.cleansedText ?? '';

          return (
            <div
              key={result.id ?? idx}
              className="bg-white box-border flex flex-col gap-4 p-4 rounded-[12px] shadow-[0px_0.5px_2.5px_0px_rgba(0,0,0,0.3)] w-full"
            >
              {/* Metadata */}
              <div className="flex items-start justify-between w-full gap-4">
                <div>
                  <div className="font-sf-pro font-semibold text-[#737780] text-[10px]">Source</div>
                  <div className="font-sf-pro font-medium text-[#111215] text-[12px] break-all">{source}</div>
                </div>
                <div className="w-[318px] max-w-full">
                  <div className="font-sf-pro font-semibold text-[#737780] text-[10px]">Section</div>
                  <div className="font-sf-pro font-medium text-[#111215] text-[12px] break-all">{section}</div>
                </div>
              </div>

              <div className="h-px w-full bg-[#d0d1d4]" />

              {/* Content Tabs */}
              <div className="bg-[rgba(0,0,0,0.01)] box-border flex h-[22px] items-center rounded-[6px] w-[164px]">
                <button
                  onClick={() => setActiveTab('raw')}
                  className={`flex-1 h-full rounded-[5px] transition-all duration-200 mr-[-1px] ${
                    activeTab === 'raw' ? 'bg-[#111215] text-white' : 'bg-transparent text-[#737780] hover:bg-gray-100'
                  }`}
                >
                  <span className="font-sf-pro text-[13px] leading-[16px] block text-center">Raw</span>
                </button>
                <button
                  onClick={() => setActiveTab('format')}
                  className={`flex-1 h-full rounded-[5px] transition-all duration-200 mr-[-1px] ${
                    activeTab === 'format' ? 'bg-[#111215] text-white' : 'bg-transparent text-[#737780] hover:bg-gray-100'
                  }`}
                >
                  <span className="font-sf-pro text-[13px] leading-[16px] block text-center">Format</span>
                </button>
              </div>

              {/* Content */}
              <div className="font-sf-pro font-medium text-[#4d4d4d] text-[12px] leading-[20px] w-full">
                {content}
              </div>

              {/* Copy Button */}
              <div>
                <button
                  onClick={() => copyToClipboard(content, result.id ?? String(idx))}
                  className={`rounded-[24px] transition-all duration-200 ${
                    copiedStates[result.id ?? String(idx)] ? 'bg-gray-50 hover:bg-gray-50' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="box-border flex gap-1 items-center px-3 py-[3px]">
                    <span className="h-3.5 w-3">
                      <CopyIcon className="w-full h-full text-[#111215]" />
                    </span>
                    <span className="font-sf-pro font-medium text-[12px] text-[#111215]">
                      {copiedStates[result.id ?? String(idx)] ? 'Copied' : 'Copy'}
                    </span>
                  </div>
                  <div aria-hidden="true" className="border border-black inset-[-1px] pointer-events-none rounded-[25px] shadow-[0px_1px_2.5px_0px_rgba(0,122,255,0.24),0px_0px_0px_0.5px_rgba(0,122,255,0.12)]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
