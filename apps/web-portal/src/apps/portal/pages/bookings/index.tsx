import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { CalendarOutlined } from '@ant-design/icons';
import { Skeleton } from 'antd';
import {
  BookingsPageWrapper,
  PageHeader,
  PageTitle,
  PageSubtitle,
  TabsRow,
  TabBtn,
  BookingsList,
  EmptyState,
} from './styles/styled';
import BookingCard from './components/BookingCard';
import { useBookingsData } from './hooks/useData';
import { useBookingsActions, type BookingStatus } from './hooks/useActions';
import type { IBooking } from '@apps/portal/services/types';

// Map backend BookingStatus → UI tab
const statusToTab = (status: IBooking['status']): BookingStatus => {
  switch (status) {
    case 'PENDING':
    case 'CONFIRMED':
      return 'upcoming';
    case 'COMPLETED':
      return 'completed';
    case 'CANCELLED':
      return 'cancelled';
    default:
      return 'upcoming';
  }
};

const Bookings: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, isLoading, isError } = useBookingsData();
  const { activeTab, handleTabChange } = useBookingsActions();

  // Map IBooking → local format + tab key
  const mappedBookings = bookings.map((b) => ({
    id: b.id,
    property: b.apartment?.title ?? `Căn hộ #${b.apartmentId.slice(0, 8)}`,
    location: b.apartment?.location ?? '—',
    status: statusToTab(b.status),
    checkIn: new Date(b.startDate).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' }),
    checkOut: new Date(b.endDate).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' }),
    guests: 1,
    totalPrice: b.totalPrice,
    imageUrl: b.apartment?.images?.[0] ?? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    rawStatus: b.status,
    bookingId: b.id,
  }));

  const filteredBookings = mappedBookings.filter((b) => b.status === activeTab);

  const getTabCount = (tab: BookingStatus) =>
    mappedBookings.filter((b) => b.status === tab).length;

  const handleViewDetail = (bookingId: string) => {
    navigate({ to: '/bookings/$id', params: { id: bookingId } });
  };

  if (isLoading) {
    return (
      <BookingsPageWrapper>
        <PageHeader>
          <PageTitle>Đặt phòng của tôi</PageTitle>
        </PageHeader>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} active paragraph={{ rows: 4 }} style={{ marginBottom: '2rem' }} />
        ))}
      </BookingsPageWrapper>
    );
  }

  return (
    <BookingsPageWrapper>
      <PageHeader>
        <PageTitle>Đặt phòng của tôi</PageTitle>
        <PageSubtitle>Quản lý các chuyến đi sắp tới và xem lại lịch sử đặt phòng của bạn.</PageSubtitle>
      </PageHeader>

      <TabsRow>
        <TabBtn $active={activeTab === 'upcoming'} onClick={() => handleTabChange('upcoming')}>
          Sắp tới ({getTabCount('upcoming')})
        </TabBtn>
        <TabBtn $active={activeTab === 'completed'} onClick={() => handleTabChange('completed')}>
          Đã hoàn thành ({getTabCount('completed')})
        </TabBtn>
        <TabBtn $active={activeTab === 'cancelled'} onClick={() => handleTabChange('cancelled')}>
          Đã hủy ({getTabCount('cancelled')})
        </TabBtn>
      </TabsRow>

      {isError && (
        <EmptyState>
          <CalendarOutlined style={{ fontSize: '4rem', color: '#e5e2dd', marginBottom: '1.5rem' }} />
          <h3>Không thể tải dữ liệu đặt phòng</h3>
          <p>Vui lòng kiểm tra kết nối và thử lại.</p>
        </EmptyState>
      )}

      {!isError && filteredBookings.length > 0 ? (
        <BookingsList>
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onViewDetail={handleViewDetail}
            />
          ))}
        </BookingsList>
      ) : (
        !isError && (
          <EmptyState>
            <CalendarOutlined style={{ fontSize: '4rem', color: '#e5e2dd', marginBottom: '1.5rem' }} />
            <h3>Trống</h3>
            <p>
              Bạn hiện không có đặt phòng nào ở mục này. Hãy khám phá các căn hộ tuyệt vời của chúng tôi.
            </p>
            <button onClick={() => navigate({ to: '/can-ho' })}>Khám phá ngay</button>
          </EmptyState>
        )
      )}
    </BookingsPageWrapper>
  );
};

export default Bookings;
