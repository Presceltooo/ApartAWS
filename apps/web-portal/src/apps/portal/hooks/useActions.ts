import { useState, useCallback, useEffect } from 'react';
import useDebounce from '@shared/hooks/useDebounce';

export const useActions = () => {
  const debounce = useDebounce();

  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [searchParams, setSearchParams] = useState({
    location: '',
    startDate: '',
    endDate: '',
  });

  const handleSearch = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchParams({
      location: location.trim(),
      startDate: checkIn,
      endDate: checkOut,
    });
  }, [location, checkIn, checkOut]);

  // Auto-search when location text changes (debounced)
  useEffect(() => {
    debounce(() => {
      setSearchParams({
        location: location.trim(),
        startDate: checkIn,
        endDate: checkOut,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return {
    location,
    setLocation,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    searchParams,
    handleSearch,
  };
};
