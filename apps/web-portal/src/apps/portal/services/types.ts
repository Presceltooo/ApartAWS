/**
 * Portal Service Types
 * Khớp với Prisma schema của apartment-service & booking-service
 */

// ─── Apartment ────────────────────────────────────────────────────────────────

export interface IApartment {
  id: string;
  title: string;
  description?: string;
  pricePerNight: number;
  location: string;
  amenities: string[];
  images: string[];
  isActive: boolean;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IApartmentQuery {
  Keyword?: string;
  Page?: number;
  PageSize?: number;
  MinPrice?: number;
  MaxPrice?: number;
  Location?: string;
}

// ─── Booking ──────────────────────────────────────────────────────────────────

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface IBooking {
  id: string;
  apartmentId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  apartment?: IApartment;
}

export interface ICreateBookingPayload {
  apartmentId: string;
  startDate: string; // ISO 8601
  endDate: string;   // ISO 8601
  totalPrice: number;
}

export interface ICheckAvailabilityQuery {
  apartmentId: string;
  startDate: string;
  endDate: string;
}

export interface ICheckAvailabilityResponse {
  available: boolean;
  conflictingDates?: string[];
}

export interface IBookingQuery {
  Page?: number;
  PageSize?: number;
  Status?: BookingStatus;
}
