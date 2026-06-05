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
  IReview,
} from './types';

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

export const toggleAutoApproveStatus = (id: string, isAutoApprove: boolean): Promise<IResponse<IApartment>> => {
  return axiosClient.patch(`apartments/${id}/auto-approve`, { isAutoApprove });
};

// ─── Owner Booking APIs ──────────────────────────────────────────────────────────

export const getOwnerBookings = (
  params?: IBookingQuery,
): Promise<IResponsePagination<IBooking>> => {
  return axiosClient.get('bookings/owner', { params });
};

export const getOwnerStats = (
  params?: { year?: number; month?: number },
): Promise<IResponse<any>> => {
  return axiosClient.get('bookings/owner/stats', { params });
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

export const getBookingStats = (params?: { year?: number; month?: number }): Promise<IResponse<any>> => {
  return axiosClient.get('bookings/system/stats', { params });
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

export const getSystemAutoApprove = (): Promise<IResponse<{ isAutoApprove: boolean }>> => {
  return axiosClient.get('apartments/system/auto-approve');
};

export const updateSystemAutoApprove = (isAutoApprove: boolean): Promise<IResponse<{ isAutoApprove: boolean }>> => {
  return axiosClient.patch('apartments/system/auto-approve', { isAutoApprove });
};

export const getSystemBookings = (params?: IBookingQuery): Promise<IResponsePagination<IBooking>> => {
  return axiosClient.get('bookings/system/all', { params });
};

export const updateSystemBookingStatus = (id: string, status: string): Promise<IResponse<IBooking>> => {
  return axiosClient.patch(`bookings/system/${id}/status`, { status });
};

export const uploadToS3 = async (presignedUrl: string, file: File): Promise<void> => {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`S3 upload failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
};

// ─── Review Management APIs (Admin & Owner) ───────────────────────────────────



export const getSystemReviews = (params?: {
  Page?: number;
  PageSize?: number;
  ApartmentId?: string;
  Status?: string;
  Rating?: number;
}): Promise<IResponsePagination<IReview>> => {
  return axiosClient.get('apartments/system/reviews', { params });
};

export const updateReviewStatus = (reviewId: string, status: string): Promise<IResponse<IReview>> => {
  return axiosClient.patch(`apartments/system/reviews/${reviewId}/status`, { status });
};

export const getOwnerReviews = (params?: {
  Page?: number;
  PageSize?: number;
  ApartmentId?: string;
  Rating?: number;
}): Promise<IResponsePagination<IReview>> => {
  return axiosClient.get('apartments/owner/reviews', { params });
};

export const replyToReview = (reviewId: string, reply: string): Promise<IResponse<IReview>> => {
  return axiosClient.post(`apartments/owner/reviews/${reviewId}/reply`, { reply });
};

export const toggleApartmentReviewAutoApprove = (id: string, isAutoApproveReview: boolean): Promise<IResponse<IApartment>> => {
  return axiosClient.patch(`apartments/${id}/review-auto-approve`, { isAutoApproveReview });
};

export const adminReplyToReview = (reviewId: string, reply: string): Promise<IResponse<IReview>> => {
  return axiosClient.post(`apartments/system/reviews/${reviewId}/reply`, { reply });
};

export const deleteReview = (reviewId: string): Promise<IResponse<any>> => {
  return axiosClient.delete(`apartments/system/reviews/${reviewId}`);
};

