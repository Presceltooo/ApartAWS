import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { getMyApartments, getOwnerBookings, getOwnerStats, getAuthStats, getApartmentStats, getBookingStats, getSystemUsers, getSystemApartments, getSystemBookings, getSystemAutoApprove, getSystemReviews, getOwnerReviews } from './api';
import type { IResponsePagination } from '@/shared/types/response.type';
import type { IApartment, IApartmentQuery, IBooking, IBookingQuery, IReview } from './types';

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

export const useOwnerStats = (
  params?: { year?: number; month?: number },
  options?: Partial<UseQueryOptions<any>>,
) => {
  return useQuery({
    queryKey: ['admin', 'owner-stats', params],
    queryFn: () => getOwnerStats(params).then(res => res.data),
    staleTime: 1000 * 60 * 2,
    ...options,
  });
};

export const useSystemStats = (
  params?: { year?: number; month?: number },
  options?: Partial<UseQueryOptions<any>>,
) => {
  return useQuery({
    queryKey: ['admin', 'system-stats', params],
    queryFn: async () => {
      const [auth, apt, booking] = await Promise.all([
        getAuthStats(),
        getApartmentStats(),
        getBookingStats(params),
      ]);
      return {
        auth: auth.data,
        apartment: apt.data,
        booking: booking.data,
      };
    },
    ...options,
  });
};

export const useSystemUsers = (params?: any, options?: Partial<UseQueryOptions<IResponsePagination<any>>>) => {
  return useQuery({
    queryKey: ['admin', 'system-users', params],
    queryFn: () => getSystemUsers(params),
    ...options,
  });
};

export const useSystemApartments = (params?: IApartmentQuery, options?: Partial<UseQueryOptions<IResponsePagination<IApartment>>>) => {
  return useQuery({
    queryKey: ['admin', 'system-apartments', params],
    queryFn: () => getSystemApartments(params),
    ...options,
  });
};

export const useSystemBookings = (params?: IBookingQuery, options?: Partial<UseQueryOptions<IResponsePagination<IBooking>>>) => {
  return useQuery({
    queryKey: ['admin', 'system-bookings', params],
    queryFn: () => getSystemBookings(params),
    ...options,
  });
};

export const useSystemAutoApprove = (options?: Partial<UseQueryOptions<any>>) => {
  return useQuery({
    queryKey: ['admin', 'system-auto-approve'],
    queryFn: () => getSystemAutoApprove(),
    ...options,
  });
};

export const useSystemReviews = (params?: { Page?: number; PageSize?: number; ApartmentId?: string; Status?: string; Rating?: number }, options?: Partial<UseQueryOptions<IResponsePagination<IReview>>>) => {
  return useQuery({
    queryKey: ['admin', 'system-reviews', params],
    queryFn: () => getSystemReviews(params),
    ...options,
  });
};

export const useOwnerReviews = (params?: { Page?: number; PageSize?: number; ApartmentId?: string; Rating?: number }, options?: Partial<UseQueryOptions<IResponsePagination<IReview>>>) => {
  return useQuery({
    queryKey: ['admin', 'owner-reviews', params],
    queryFn: () => getOwnerReviews(params),
    ...options,
  });
};
