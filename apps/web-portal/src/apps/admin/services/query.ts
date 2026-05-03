import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { getMyApartments, getOwnerBookings } from './api';
import type { IResponsePagination } from '@/shared/types/response.type';
import type { IApartment, IApartmentQuery, IBooking, IBookingQuery } from './types';

export const useMyApartments = (
  params?: IApartmentQuery,
  options?: Partial<UseQueryOptions<IResponsePagination<IApartment>>>,
): UseQueryResult<IResponsePagination<IApartment>> => {
  return useQuery<IResponsePagination<IApartment>>({
    queryKey: ['admin', 'apartments', params],
    queryFn: () => getMyApartments(params),
    staleTime: 1000 * 60 * 2,
    ...options,
  });
};

export const useOwnerBookings = (
  params?: IBookingQuery,
  options?: Partial<UseQueryOptions<IResponsePagination<IBooking>>>,
): UseQueryResult<IResponsePagination<IBooking>> => {
  return useQuery<IResponsePagination<IBooking>>({
    queryKey: ['admin', 'bookings', params],
    queryFn: () => getOwnerBookings(params),
    staleTime: 1000 * 60 * 2,
    ...options,
  });
};
