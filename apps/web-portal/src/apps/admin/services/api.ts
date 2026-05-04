import axiosClient from '@/configs/axios';
import type { IResponse, IResponsePagination } from '@/shared/types/response.type';
import type {
  IApartment,
  IApartmentQuery,
  IBooking,
  IBookingQuery,
  ICreateApartmentPayload,
  IUpdateApartmentPayload,
  IPresignedUrlResponse,
} from './types';
import axios from 'axios';

// ─── Owner Apartment APIs ────────────────────────────────────────────────────────

export const getMyApartments = (
  params?: IApartmentQuery,
): Promise<IResponsePagination<IApartment>> => {
  return axiosClient.get('Apartments', { params });
};

export const createApartment = (
  payload: ICreateApartmentPayload,
): Promise<IResponse<IApartment>> => {
  return axiosClient.post('Apartments', payload);
};

export const updateApartment = (
  id: string,
  payload: IUpdateApartmentPayload,
): Promise<IResponse<IApartment>> => {
  return axiosClient.put(`Apartments/${id}`, payload);
};

export const deleteApartment = (id: string): Promise<IResponse<null>> => {
  return axiosClient.delete(`Apartments/${id}`);
};

// ─── Owner Booking APIs ──────────────────────────────────────────────────────────

export const getOwnerBookings = (
  params?: IBookingQuery,
): Promise<IResponsePagination<IBooking>> => {
  return axiosClient.get('Bookings/owner', { params });
};

export const confirmBooking = (id: string): Promise<IResponse<IBooking>> => {
  return axiosClient.patch(`Bookings/${id}/confirm`);
};

export const completeBooking = (id: string): Promise<IResponse<IBooking>> => {
  return axiosClient.patch(`Bookings/${id}/complete`);
};

export const cancelBooking = (id: string): Promise<IResponse<IBooking>> => {
  return axiosClient.patch(`Bookings/${id}/cancel`);
};

// ─── Upload APIs ───────────────────────────────────────────────────────────────

export const getPresignedUrl = (
  fileName: string,
  contentType: string,
  fileSize?: number,
): Promise<IResponse<IPresignedUrlResponse>> => {
  return axiosClient.post('Apartments/presigned-url', { fileName, contentType, fileSize });
};

// ─── System Stats APIs (Admin only) ──────────────────────────────────────────

export const getAuthStats = (): Promise<IResponse<any>> => {
  return axiosClient.get('Auth/stats');
};

export const getApartmentStats = (): Promise<IResponse<any>> => {
  return axiosClient.get('Apartments/stats');
};

export const getBookingStats = (): Promise<IResponse<any>> => {
  return axiosClient.get('Bookings/system/stats');
};

// ─── System Management APIs (Admin only) ─────────────────────────────────────

export const getSystemUsers = (params?: any): Promise<IResponsePagination<any>> => {
  return axiosClient.get('Auth/users', { params });
};

export const toggleUserStatus = (id: string, isActive: boolean): Promise<IResponse<any>> => {
  return axiosClient.patch(`Auth/users/${id}/status`, { isActive });
};

export const getSystemApartments = (params?: IApartmentQuery): Promise<IResponsePagination<IApartment>> => {
  return axiosClient.get('Apartments/system/all', { params });
};

export const toggleApartmentStatus = (id: string, isActive: boolean): Promise<IResponse<IApartment>> => {
  return axiosClient.patch(`Apartments/${id}/status`, { isActive });
};

export const getSystemBookings = (params?: IBookingQuery): Promise<IResponsePagination<IBooking>> => {
  return axiosClient.get('Bookings/system/all', { params });
};

export const updateSystemBookingStatus = (id: string, status: string): Promise<IResponse<IBooking>> => {
  return axiosClient.patch(`Bookings/system/${id}/status`, { status });
};

export const uploadToS3 = async (presignedUrl: string, file: File): Promise<void> => {
  await axios.put(presignedUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
  });
};
