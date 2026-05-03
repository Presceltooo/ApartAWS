import React from 'react';
import {
  BookingCard as StyledCard,
  BookingImgWrapper,
  StatusBadge,
  BookingContent,
  BookingHeader,
  PropertyName,
  LocationText,
  BookingCode,
  DetailsGrid,
  DetailItem,
  BookingActions,
  ActionBtn,
} from '../styles/styled';

export interface Booking {
  id: string;
  property: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  imageUrl: string;
  rawStatus?: string;
  bookingId?: string;
}

interface BookingCardProps {
  booking: Booking;
  onViewDetail?: (id: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onViewDetail }) => {
  const handleViewDetail = () => {
    if (onViewDetail) onViewDetail(booking.id);
  };

  return (
    <StyledCard>
      <BookingImgWrapper>
        <img src={booking.imageUrl} alt={booking.property} />
        <StatusBadge $status={booking.status}>{booking.rawStatus ?? booking.status}</StatusBadge>
      </BookingImgWrapper>
      <BookingContent>
        <BookingHeader>
          <div>
            <PropertyName>{booking.property}</PropertyName>
            <LocationText>{booking.location}</LocationText>
          </div>
          <BookingCode>{booking.id.slice(0, 12).toUpperCase()}</BookingCode>
        </BookingHeader>

        <DetailsGrid>
          <DetailItem>
            <label>Check In</label>
            <div>{booking.checkIn}</div>
          </DetailItem>
          <DetailItem>
            <label>Check Out</label>
            <div>{booking.checkOut}</div>
          </DetailItem>
          <DetailItem>
            <label>Guests</label>
            <div>{booking.guests} Guests</div>
          </DetailItem>
          <DetailItem>
            <label>Total Price</label>
            <div>${booking.totalPrice.toLocaleString()}</div>
          </DetailItem>
        </DetailsGrid>

        <BookingActions>
          <ActionBtn onClick={handleViewDetail}>View Details</ActionBtn>
          {booking.status === 'upcoming' && (
            <ActionBtn $primary>Contact Concierge</ActionBtn>
          )}
          {booking.status === 'completed' && (
            <ActionBtn $primary>Book Again</ActionBtn>
          )}
        </BookingActions>
      </BookingContent>
    </StyledCard>
  );
};

export default BookingCard;
