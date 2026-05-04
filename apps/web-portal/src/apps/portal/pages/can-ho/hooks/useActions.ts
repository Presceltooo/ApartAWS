import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

export const useActions = () => {
  const navigate = useNavigate();
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

  const handleSearch = () => {
    setKeyword(searchInput);
    setAppliedLocation(location);
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
    setPage(1);
  };

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
