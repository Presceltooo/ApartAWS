import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import {
  getApartmentListing,
  getApartmentById,
  getMyBookings,
  getBookingById,
  checkAvailability,
} from './api';
import type { IResponse, IResponsePagination } from '@/shared/types/response.type';
import type {
  IApartment,
  IApartmentQuery,
  IBooking,
  IBookingQuery,
  ICheckAvailabilityQuery,
  ICheckAvailabilityResponse,
} from './types';

// ─── Apartment Queries ─────────────────────────────────────────────────────────

export const useApartmentListing = (
  params?: IApartmentQuery,
  options?: Partial<UseQueryOptions<IResponsePagination<IApartment>>>,
): UseQueryResult<IResponsePagination<IApartment>> => {
  return useQuery<IResponsePagination<IApartment>>({
    queryKey: ['apartments', 'listing', params],
    queryFn: () => getApartmentListing(params),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};

export const useApartmentDetail = (
  id: string,
  options?: Partial<UseQueryOptions<IResponse<IApartment>>>,
): UseQueryResult<IResponse<IApartment>> => {
  return useQuery<IResponse<IApartment>>({
    queryKey: ['apartments', id],
    queryFn: () => getApartmentById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};

// ─── Booking Queries ───────────────────────────────────────────────────────────

export const useMyBookings = (
  params?: IBookingQuery,
  options?: Partial<UseQueryOptions<IResponsePagination<IBooking>>>,
): UseQueryResult<IResponsePagination<IBooking>> => {
  return useQuery<IResponsePagination<IBooking>>({
    queryKey: ['bookings', 'my', params],
    queryFn: () => getMyBookings(params),
    staleTime: 1000 * 60 * 2,
    ...options,
  });
};

export const useBookingDetail = (
  id: string,
  options?: Partial<UseQueryOptions<IResponse<IBooking>>>,
): UseQueryResult<IResponse<IBooking>> => {
  return useQuery<IResponse<IBooking>>({
    queryKey: ['bookings', id],
    queryFn: () => getBookingById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCheckAvailability = (
  params: ICheckAvailabilityQuery,
  options?: Partial<UseQueryOptions<IResponse<ICheckAvailabilityResponse>>>,
): UseQueryResult<IResponse<ICheckAvailabilityResponse>> => {
  return useQuery<IResponse<ICheckAvailabilityResponse>>({
    queryKey: ['bookings', 'availability', params],
    queryFn: () => checkAvailability(params),
    enabled: !!(params.apartmentId && params.startDate && params.endDate),
    ...options,
  });
};
