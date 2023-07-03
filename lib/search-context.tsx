import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  newsItem: any;
  setNewsItem: React.Dispatch<React.SetStateAction<any>>;
}

interface SearchProviderProps {
  children: ReactNode;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchText, setSearchText] = useState('');
  const [newsItem, setNewsItem] = useState();

  return (
    <SearchContext.Provider
      value={{ searchText, setSearchText, newsItem, setNewsItem }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
