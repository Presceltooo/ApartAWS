import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

export const useActions = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);

  const handleSearch = () => {
    setKeyword(searchInput);
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
    page,
    handleSearch,
    handleView,
    handlePageChange,
  };
};
