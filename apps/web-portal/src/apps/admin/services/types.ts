export interface ICreateApartmentPayload {
  title: string;
  description?: string;
  pricePerNight: number;
  location: string;
  amenities: string[];
  images: string[];
  isActive?: boolean;
}

export interface IUpdateApartmentPayload extends Partial<ICreateApartmentPayload> {}

export interface IPresignedUrlResponse {
  uploadUrl: string;
  fileKey: string;
  publicUrl: string;
}

// Re-export IApartment and IBooking from portal for reuse
export type { IApartment, IApartmentQuery, IBooking, IBookingQuery } from '../../portal/services/types';
