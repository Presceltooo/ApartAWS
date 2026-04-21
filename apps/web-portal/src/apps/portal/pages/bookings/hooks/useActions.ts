import { useState, useCallback } from 'react';

export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export const useBookingsActions = () => {
  const [activeTab, setActiveTab] = useState<BookingStatus>('upcoming');

  const handleTabChange = useCallback((tab: BookingStatus) => {
    setActiveTab(tab);
  }, []);

  return {
    activeTab,
    handleTabChange
  };
};
