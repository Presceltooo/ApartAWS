import { useState, useCallback } from 'react';

export const useActions = () => {
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
