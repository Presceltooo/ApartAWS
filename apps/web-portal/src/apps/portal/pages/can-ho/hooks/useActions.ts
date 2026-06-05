import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import useDebounce from '@shared/hooks/useDebounce';

export const useActions = () => {
  const navigate = useNavigate();
  const debounce = useDebounce();

  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState<number>();
  const [maxPrice, setMaxPrice] = useState<number>();
  const [page, setPage] = useState(1);

  // States for applied filters
  const [appliedLocation, setAppliedLocation] = useState('');
  const [appliedMinPrice, setAppliedMinPrice] = useState<number>();
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number>();

  const applySearch = () => {
    setKeyword(searchInput);
    setAppliedLocation(location);
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
    setPage(1);
  };

  const handleSearch = () => {
    applySearch();
  };

  // Auto-search when user types (debounced)
  useEffect(() => {
    debounce(() => {
      applySearch();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, location, minPrice, maxPrice]);

  const handleView = (id: string) => {
    navigate({ to: '/apartment/$id', params: { id } });
  };

  const handlePageChange = (p: number) => {
    setPage(p);
  };

  return {
    keyword,
    searchInput,
    setSearchInput,
    location,
    setLocation,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    appliedLocation,
    appliedMinPrice,
    appliedMaxPrice,
    page,
    handleSearch,
    handleView,
    handlePageChange,
  };
};
