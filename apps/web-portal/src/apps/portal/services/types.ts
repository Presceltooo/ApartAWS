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
  cleaningFee?: number;
  serviceFee?: number;
  maxGuests?: number;
  location: string;
  latitude?: number;
  longitude?: number;
  amenities: string[];
  images: string[];
  isActive: boolean;
  isAutoApprove?: boolean;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
  reviews?: IReview[];
  reviewCount?: number;
  averageRating?: number;
}

export interface IApartmentQuery {
  Keyword?: string;
  Page?: number;
  PageSize?: number;
  MinPrice?: number;
  MaxPrice?: number;
  Location?: string;
  StartDate?: string;
  EndDate?: string;
}

// ─── Booking ──────────────────────────────────────────────────────────────────

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface IBooking {
  id: string;
  apartmentId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  guests: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  vnpTransactionId?: string;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
  apartment?: IApartment;
}

export interface ICreateBookingPayload {
  apartmentId: string;
  startDate: string; // ISO 8601
  endDate: string;   // ISO 8601
  totalPrice: number;
  guests?: number;
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
  Keyword?: string;
  Page?: number;
  PageSize?: number;
  Status?: BookingStatus;
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export interface IReview {
  id: string;
  apartmentId: string;
  tenantId: string;
  bookingId: string;
  rating: number;
  comment?: string;
  tenantName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateReviewPayload {
  bookingId: string;
  rating: number;
  comment?: string;
}
