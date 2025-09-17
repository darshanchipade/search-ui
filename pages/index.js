import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ChatScreen from './ChatScreen';

export default function Home() {
  const [query, setQuery] = useState('');
  const [refinementChips, setRefinementChips] = useState([]);
  const [activeChips, setActiveChips] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (activeChips.length === 0) {
        if (searchResults.length > 0) {
            setSearchResults([]);
        }
        return;
    }

    const performSearch = async () => {
      setIsSearching(true);
      setSearchResults([]);

      const searchRequest = {
        query: query,
        tags: [],
        keywords: [],
        context: {}
      };

      activeChips.forEach(chip => {
        if (chip.type === 'Tag') {
          searchRequest.tags.push(chip.value);
        } else if (chip.type === 'Keyword') {
          searchRequest.keywords.push(chip.value);
        } else if (chip.type.startsWith('Context:')) {
          const fullPath = chip.type.substring("Context:".length);
          const pathParts = fullPath.split('.');
          let currentLevel = searchRequest.context;
          for (let i = 0; i < pathParts.length - 1; i++) {
            const part = pathParts[i];
            currentLevel[part] = currentLevel[part] || {};
            currentLevel = currentLevel[part];
          }
          const lastPart = pathParts[pathParts.length - 1];
          currentLevel[lastPart] = currentLevel[lastPart] || [];
          if (!currentLevel[lastPart].includes(chip.value)) {
            currentLevel[lastPart].push(chip.value);
          }
        }
      });

      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(searchRequest)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Failed to perform search:", error);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [activeChips, query]);

  const handleInitialSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setRefinementChips([]);
    setActiveChips([]);
    setSearchResults([]);

    try {
      const response = await fetch(`/api/refine?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const chipsWithState = data.map((chip, index) => ({
        ...chip,
        id: `${chip.type}-${chip.value}-${index}`,
        isActive: false,
        label: chip.type ? `${chip.type}: ${chip.value}` : chip.value,
      }));
      setRefinementChips(chipsWithState);
    } catch (error) {
      console.error("Failed to fetch refinement chips:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = (chipToToggle) => {
    const newRefinementChips = refinementChips.map(chip =>
      chip.id === chipToToggle.id ? { ...chip, isActive: !chip.isActive } : chip
    );
    setRefinementChips(newRefinementChips);
    setActiveChips(newRefinementChips.filter(chip => chip.isActive));
  };

  return (
    <div>
      <Head>
        <title>Intelligent Search</title>
        <meta name="description" content="Next.js intelligent search interface" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex justify-center items-start pt-10 bg-gray-50 min-h-screen">
        <div className="w-full max-w-4xl">
            <ChatScreen
              searchQuery={query}
              setSearchQuery={setQuery}
              handleSearch={handleInitialSearch}
              filters={refinementChips}
              toggleFilter={handleChipClick}
              searchResults={searchResults}
              isSearching={isSearching}
            />
            {isLoading && <p className="text-center mt-4">Loading suggestions...</p>}
        </div>
      </main>
    </div>
  );
}