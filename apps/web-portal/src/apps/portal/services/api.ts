import axiosClient from '@/configs/axios';
import type { IResponse, IResponsePagination } from '@/shared/types/response.type';
import type {
  IApartment,
  IApartmentQuery,
  IBooking,
  IBookingQuery,
  ICreateBookingPayload,
  ICheckAvailabilityQuery,
  ICheckAvailabilityResponse,
} from './types';

// ─── Apartment APIs ────────────────────────────────────────────────────────────

/**
 * GET /Apartments/listing — Danh sách căn hộ public (không cần auth)
 */
export const getApartmentListing = (
  params?: IApartmentQuery,
): Promise<IResponsePagination<IApartment>> => {
  return axiosClient.get('apartments/listing', { params });
};

/**
 * GET /Apartments/:id — Chi tiết căn hộ (không cần auth)
 */
export const getApartmentById = (id: string): Promise<IResponse<IApartment>> => {
  return axiosClient.get(`apartments/${id}`);
};

// ─── Booking APIs ─────────────────────────────────────────────────────────────

/**
 * GET /Bookings/check-availability — Kiểm tra lịch trống (không cần auth)
 */
export const checkAvailability = (
  params: ICheckAvailabilityQuery,
): Promise<IResponse<ICheckAvailabilityResponse>> => {
  return axiosClient.get('bookings/check-availability', { params });
};

/**
 * POST /Bookings — Tạo đặt phòng (cần auth: Tenant)
 */
export const createBooking = (
  payload: ICreateBookingPayload,
): Promise<IResponse<IBooking>> => {
  return axiosClient.post('bookings', payload);
};

/**
 * GET /Bookings/my-bookings — Lịch sử của tôi (cần auth)
 */
export const getMyBookings = (
  params?: IBookingQuery,
): Promise<IResponsePagination<IBooking>> => {
  return axiosClient.get('bookings/my-bookings', { params });
};

/**
 * GET /Bookings/:id — Chi tiết booking (cần auth)
 */
export const getBookingById = (id: string): Promise<IResponse<IBooking>> => {
  return axiosClient.get(`bookings/${id}`);
};

/**
 * PATCH /Bookings/:id/cancel — Huỷ booking (cần auth)
 */
export const cancelBooking = (id: string): Promise<IResponse<IBooking>> => {
  return axiosClient.patch(`bookings/${id}/cancel`);
};

/**
 * PATCH /Bookings/:id/confirm — Xác nhận booking (cần auth - Owner)
 */
export const confirmBooking = (id: string): Promise<IResponse<IBooking>> => {
  return axiosClient.patch(`bookings/${id}/confirm`);
};

/**
 * PATCH /Bookings/:id/complete — Hoàn thành booking (cần auth - Owner)
 */
export const completeBooking = (id: string): Promise<IResponse<IBooking>> => {
  return axiosClient.patch(`bookings/${id}/complete`);
};

// ─── Payment APIs (VNPay) ─────────────────────────────────────────────────────

/**
 * GET /Bookings/payments/vnpay-url/:bookingId — Lấy URL thanh toán VNPay
 */
export const getVnpayUrl = (
  bookingId: string,
): Promise<IResponse<{ paymentUrl: string }>> => {
  return axiosClient.get(`bookings/payments/vnpay-url/${bookingId}`);
};
