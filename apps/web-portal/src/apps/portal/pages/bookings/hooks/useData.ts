import { useMyBookings } from '@apps/portal/services/query';
import type { IBooking } from '@apps/portal/services/types';

export const useBookingsData = () => {
  const {
    data: response,
    isLoading,
    isError,
  } = useMyBookings({ Page: 1, PageSize: 20 });

  const bookings: IBooking[] = response?.data?.records ?? [];

  return {
    bookings,
    isLoading,
    isError,
  };
};
