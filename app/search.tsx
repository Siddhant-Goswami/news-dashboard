'use client';

import { TextInput } from '@tremor/react';
import { useSearch } from '../lib/search-context';

export default function Search({ disabled }: { disabled?: boolean }) {
  const { searchText, setSearchText } = useSearch();

  function handleSearch(term: string) {
    setSearchText(term);
  }

  return (
    <>
      <TextInput
        value={searchText}
        placeholder="https://www.bbc.com/news/"
        onChange={(e) => handleSearch(e.target.value)}
      />
    </>
  );
}
