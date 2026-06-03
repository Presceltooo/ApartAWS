export enum NotificationEventType {
  BOOKING_CREATED = 'BOOKING_CREATED',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  BOOKING_COMPLETED = 'BOOKING_COMPLETED',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
}

export interface NotificationEvent {
  eventType: NotificationEventType;
  timestamp: string; // ISO 8601
  payload: {
    bookingId: string;
    apartmentId: string;
    apartmentTitle: string;
    tenantId: string;
    tenantEmail?: string;
    tenantName?: string;
    ownerId?: string;
    ownerEmail?: string;
    ownerName?: string;
    startDate: string;
    endDate: string;
    nights: number;
    totalPrice: number;
    bookingStatus: string;
    paymentStatus?: string;
    transactionId?: string;
    failureReason?: string;
  };
}
