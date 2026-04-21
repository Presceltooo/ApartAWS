import { useState, useCallback } from 'react';

export const useActions = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    handleSearch
  };
};
