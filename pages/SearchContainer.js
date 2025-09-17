// pages/SearchContainer.js
import React, { useState } from 'react';

export default function SearchContainer({ onSearch, isSearching = false }) {
  const [local, setLocal] = useState('');

  const submit = (e) => {
    e.preventDefault();
    onSearch?.(local); // index.js will set page=1 on new search
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8 }}>
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder="Search…"
        style={{ flex: 1, minWidth: 280, padding: '10px' }}
      />
      <button type="submit" disabled={!local.trim() || isSearching}>
        {isSearching ? 'Searching…' : 'Search'}
      </button>
    </form>
  );
}
