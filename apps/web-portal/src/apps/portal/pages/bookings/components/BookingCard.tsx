import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('portal');

  const handleViewDetail = () => {
    if (onViewDetail) onViewDetail(booking.id);
  };

  const getStatusLabel = (status?: string) => {
    if (!status) return '';
    switch (status.toUpperCase()) {
      case 'PENDING':
        return t('bookings.status.pending', 'Chờ xác nhận');
      case 'CONFIRMED':
        return t('bookings.status.confirmed', 'Đã xác nhận');
      case 'COMPLETED':
        return t('bookings.status.completed', 'Đã hoàn thành');
      case 'CANCELLED':
        return t('bookings.status.cancelled', 'Đã hủy');
      default:
        return status;
    }
  };

  return (
    <StyledCard>
      <BookingImgWrapper>
        <img src={booking.imageUrl} alt={booking.property} />
        <StatusBadge $status={booking.status}>{getStatusLabel(booking.rawStatus ?? booking.status)}</StatusBadge>
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
            <label>{t('bookings.card.check_in', 'Ngày nhận phòng')}</label>
            <div>{booking.checkIn}</div>
          </DetailItem>
          <DetailItem>
            <label>{t('bookings.card.check_out', 'Ngày trả phòng')}</label>
            <div>{booking.checkOut}</div>
          </DetailItem>
          <DetailItem>
            <label>{t('bookings.card.guests', 'Khách')}</label>
            <div>{t('bookings.card.guests_count', { count: booking.guests, defaultValue: `${booking.guests} Khách` })}</div>
          </DetailItem>
          <DetailItem>
            <label>{t('bookings.card.total_price', 'Tổng giá')}</label>
            <div>${booking.totalPrice.toLocaleString()}</div>
          </DetailItem>
        </DetailsGrid>

        <BookingActions>
          <ActionBtn onClick={handleViewDetail}>{t('bookings.card.view_details', 'Xem chi tiết')}</ActionBtn>
          {booking.status === 'upcoming' && (
            <ActionBtn $primary>{t('bookings.card.contact_concierge', 'Liên hệ quản gia')}</ActionBtn>
          )}
          {booking.status === 'completed' && (
            <ActionBtn $primary>{t('bookings.card.book_again', 'Đặt lại phòng')}</ActionBtn>
          )}
        </BookingActions>
      </BookingContent>
    </StyledCard>
  );
};

export default BookingCard;
