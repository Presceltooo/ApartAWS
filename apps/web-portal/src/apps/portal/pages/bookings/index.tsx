import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { CalendarOutlined } from '@ant-design/icons';
import { Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';
import useCheckLogin from '../../../../shared/hooks/useCheckLogin';
import useNotification from '../../../../shared/hooks/useNotification';
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
  const { t, i18n } = useTranslation('portal');
  const navigate = useNavigate();
  const { isLogin } = useCheckLogin();
  const { showErrorNotify } = useNotification();

  React.useEffect(() => {
    if (!isLogin) {
      showErrorNotify(t('bookings.login_required', 'Vui lòng đăng nhập để xem thông tin đặt phòng của bạn.'));
    }
  }, [isLogin, showErrorNotify, t]);

  const { bookings, isLoading, isError } = useBookingsData();
  const { activeTab, handleTabChange } = useBookingsActions();

  if (!isLogin) {
    return (
      <BookingsPageWrapper>
        <PageHeader>
          <PageTitle>{t('bookings.title', 'Đặt phòng của tôi')}</PageTitle>
          <PageSubtitle>{t('bookings.subtitle', 'Quản lý các chuyến đi sắp tới và xem lại lịch sử đặt phòng của bạn.')}</PageSubtitle>
        </PageHeader>
        <EmptyState>
          <CalendarOutlined style={{ fontSize: '4rem', color: '#e5e2dd', marginBottom: '1.5rem' }} />
          <h3>{t('bookings.login_required_title', 'Yêu cầu đăng nhập')}</h3>
          <p>
            {t('bookings.login_required_desc', 'Vui lòng đăng nhập để quản lý và xem lại lịch sử đặt phòng của bạn.')}
          </p>
          <button onClick={() => navigate({ to: '/dang-nhap' })}>{t('bookings.login_btn', 'Đăng nhập ngay')}</button>
        </EmptyState>
      </BookingsPageWrapper>
    );
  }

  // Map IBooking → local format + tab key
  const mappedBookings = bookings.map((b) => ({
    id: b.id,
    property: b.apartment?.title ?? `${t('details.apartment', 'Căn hộ')} #${b.apartmentId.slice(0, 8)}`,
    location: b.apartment?.location ?? '—',
    status: statusToTab(b.status),
    checkIn: new Date(b.startDate).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : i18n.language === 'ja' ? 'ja-JP' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
    checkOut: new Date(b.endDate).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : i18n.language === 'ja' ? 'ja-JP' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
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
          <PageTitle>{t('bookings.title', 'Đặt phòng của tôi')}</PageTitle>
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
        <PageTitle>{t('bookings.title', 'Đặt phòng của tôi')}</PageTitle>
        <PageSubtitle>{t('bookings.subtitle', 'Quản lý các chuyến đi sắp tới và xem lại lịch sử đặt phòng của bạn.')}</PageSubtitle>
      </PageHeader>

      <TabsRow>
        <TabBtn $active={activeTab === 'upcoming'} onClick={() => handleTabChange('upcoming')}>
          {t('bookings.tabs.upcoming', 'Sắp tới')} ({getTabCount('upcoming')})
        </TabBtn>
        <TabBtn $active={activeTab === 'completed'} onClick={() => handleTabChange('completed')}>
          {t('bookings.tabs.completed', 'Đã hoàn thành')} ({getTabCount('completed')})
        </TabBtn>
        <TabBtn $active={activeTab === 'cancelled'} onClick={() => handleTabChange('cancelled')}>
          {t('bookings.tabs.cancelled', 'Đã hủy')} ({getTabCount('cancelled')})
        </TabBtn>
      </TabsRow>

      {isError && (
        <EmptyState>
          <CalendarOutlined style={{ fontSize: '4rem', color: '#e5e2dd', marginBottom: '1.5rem' }} />
          <h3>{t('bookings.empty.load_error_title', 'Không thể tải dữ liệu đặt phòng')}</h3>
          <p>{t('bookings.empty.load_error_desc', 'Vui lòng kiểm tra kết nối và thử lại.')}</p>
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
            <h3>{t('bookings.empty.title', 'Trống')}</h3>
            <p>
              {t('bookings.empty.desc', 'Bạn hiện không có đặt phòng nào ở mục này. Hãy khám phá các căn hộ tuyệt vời của chúng tôi.')}
            </p>
            <button onClick={() => navigate({ to: '/can-ho' })}>{t('bookings.empty.explore_btn', 'Khám phá ngay')}</button>
          </EmptyState>
        )
      )}
    </BookingsPageWrapper>
  );
};

export default Bookings;
