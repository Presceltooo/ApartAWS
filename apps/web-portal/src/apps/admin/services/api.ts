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
  return axiosClient.get('apartments', { params });
};

export const createApartment = (
  payload: ICreateApartmentPayload,
): Promise<IResponse<IApartment>> => {
  return axiosClient.post('apartments', payload);
};

export const updateApartment = (
  id: string,
  payload: IUpdateApartmentPayload,
): Promise<IResponse<IApartment>> => {
  return axiosClient.put(`apartments/${id}`, payload);
};

export const deleteApartment = (id: string): Promise<IResponse<null>> => {
  return axiosClient.delete(`apartments/${id}`);
};

// ─── Owner Booking APIs ──────────────────────────────────────────────────────────

export const getOwnerBookings = (
  params?: IBookingQuery,
): Promise<IResponsePagination<IBooking>> => {
  return axiosClient.get('bookings/owner', { params });
};

export const confirmBooking = (id: string): Promise<IResponse<IBooking>> => {
  return axiosClient.patch(`bookings/${id}/confirm`);
};

export const completeBooking = (id: string): Promise<IResponse<IBooking>> => {
  return axiosClient.patch(`bookings/${id}/complete`);
};

export const cancelBooking = (id: string): Promise<IResponse<IBooking>> => {
  return axiosClient.patch(`bookings/${id}/cancel`);
};

// ─── Upload APIs ───────────────────────────────────────────────────────────────

export const getPresignedUrl = (
  fileName: string,
  contentType: string,
  fileSize?: number,
): Promise<IResponse<IPresignedUrlResponse>> => {
  return axiosClient.post('apartments/presigned-url', { fileName, contentType, fileSize });
};

// ─── System Stats APIs (Admin only) ──────────────────────────────────────────

export const getAuthStats = (): Promise<IResponse<any>> => {
  return axiosClient.get('auth/stats');
};

export const getApartmentStats = (): Promise<IResponse<any>> => {
  return axiosClient.get('apartments/stats');
};

export const getBookingStats = (): Promise<IResponse<any>> => {
  return axiosClient.get('bookings/system/stats');
};

// ─── System Management APIs (Admin only) ─────────────────────────────────────

export const getSystemUsers = (params?: any): Promise<IResponsePagination<any>> => {
  return axiosClient.get('auth/users', { params });
};

export const toggleUserStatus = (id: string, isActive: boolean): Promise<IResponse<any>> => {
  return axiosClient.patch(`auth/users/${id}/status`, { isActive });
};

export const getSystemApartments = (params?: IApartmentQuery): Promise<IResponsePagination<IApartment>> => {
  return axiosClient.get('apartments/system/all', { params });
};

export const toggleApartmentStatus = (id: string, isActive: boolean): Promise<IResponse<IApartment>> => {
  return axiosClient.patch(`apartments/${id}/status`, { isActive });
};

export const getSystemBookings = (params?: IBookingQuery): Promise<IResponsePagination<IBooking>> => {
  return axiosClient.get('bookings/system/all', { params });
};

export const updateSystemBookingStatus = (id: string, status: string): Promise<IResponse<IBooking>> => {
  return axiosClient.patch(`bookings/system/${id}/status`, { status });
};

export const uploadToS3 = async (presignedUrl: string, file: File): Promise<void> => {
  await axios.put(presignedUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
  });
};
