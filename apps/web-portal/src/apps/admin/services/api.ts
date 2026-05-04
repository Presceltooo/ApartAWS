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

export const uploadToS3 = async (presignedUrl: string, file: File): Promise<void> => {
  await axios.put(presignedUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
  });
};
