import { useState, useCallback } from 'react';

export const useActions = () => {
  const [searchParams, setSearchParams] = useState({
    location: '',
    dates: '',
    guests: '2 Guests',
  });

  const [activeFilters, setActiveFilters] = useState<string[]>(['Pool Access']);

  const handleSearch = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    console.log('Searching for:', searchParams);
    // Logic to trigger API refetch with params
  }, [searchParams]);

  const toggleFilter = useCallback((filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  }, []);

  const handleLoadMore = useCallback(() => {
    console.log('Loading more results...');
  }, []);

  return {
    searchParams,
    setSearchParams,
    activeFilters,
    toggleFilter,
    handleSearch,
    handleLoadMore,
  };
};
