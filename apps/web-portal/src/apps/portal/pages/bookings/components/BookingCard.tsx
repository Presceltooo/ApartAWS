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
  status: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  imageUrl: string;
}

interface BookingCardProps {
  booking: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  return (
    <StyledCard>
      <BookingImgWrapper>
        <img src={booking.imageUrl} alt={booking.property} />
        <StatusBadge $status={booking.status as any}>{booking.status}</StatusBadge>
      </BookingImgWrapper>
      <BookingContent>
        <BookingHeader>
          <div>
            <PropertyName>{booking.property}</PropertyName>
            <LocationText>{booking.location}</LocationText>
          </div>
          <BookingCode>{booking.id}</BookingCode>
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
          {booking.status === 'upcoming' && (
             <>
               <ActionBtn>Modify Dates</ActionBtn>
               <ActionBtn $primary>Contact Concierge</ActionBtn>
             </>
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
