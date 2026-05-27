import React, { useState } from 'react';
import { Link, useParams, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeftOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  DollarOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  CreditCardOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Tag, Button, Popconfirm, notification, Skeleton, Descriptions, Divider } from 'antd';
import styled from 'styled-components';
import { portalTheme } from '../../styled';
import { useBookingDetail } from '@apps/portal/services/query';
import { useCancelBooking } from '@apps/portal/services/mutation';
import { getVnpayUrl } from '@apps/portal/services/api';
import type { BookingStatus, PaymentStatus } from '@apps/portal/services/types';

// ─── Styled ───────────────────────────────────────────────────────────────────

const PageWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 4rem 2rem 6rem;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
`;

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${portalTheme.colors.onSurfaceVariant};
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
  &:hover { color: ${portalTheme.colors.primary}; }
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${portalTheme.colors.onSurface};
  margin-bottom: 2rem;
`;

const BookingIdBadge = styled.span`
  font-family: monospace;
  font-size: 1.3rem;
  font-weight: 600;
  color: ${portalTheme.colors.outline};
  background: ${portalTheme.colors.surfaceContainerLow};
  padding: 0.4rem 0.8rem;
  border-radius: 0.4rem;
`;

const Card = styled.div`
  background: ${portalTheme.colors.surfaceContainerLowest};
  border: 1px solid rgba(224, 192, 182, 0.2);
  border-radius: 0.8rem;
  padding: 2.5rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 4px 16px rgba(74, 27, 12, 0.04);
`;

const CardTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${portalTheme.colors.onSurface};
  margin: 0 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const AptImage = styled.img`
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 0.6rem;
  margin-bottom: 1.5rem;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 2.5rem;
  flex-wrap: wrap;
`;

// ─── Status configs (keys only, labels resolved dynamically) ──────────────────

const statusConfig: Record<
  BookingStatus,
  { color: string; icon: React.ReactNode; defaultLabel: string; translationKey: string }
> = {
  PENDING: { color: 'gold', icon: <ClockCircleOutlined />, defaultLabel: 'Đang chờ xác nhận', translationKey: 'booking_detail.status.pending' },
  CONFIRMED: { color: 'blue', icon: <CheckCircleOutlined />, defaultLabel: 'Đã xác nhận', translationKey: 'booking_detail.status.confirmed' },
  COMPLETED: { color: 'green', icon: <CheckCircleOutlined />, defaultLabel: 'Hoàn thành', translationKey: 'booking_detail.status.completed' },
  CANCELLED: { color: 'red', icon: <StopOutlined />, defaultLabel: 'Đã huỷ', translationKey: 'booking_detail.status.cancelled' },
};

const paymentStatusConfig: Record<
  PaymentStatus,
  { color: string; icon: React.ReactNode; defaultLabel: string; translationKey: string }
> = {
  UNPAID: { color: 'warning', icon: <ExclamationCircleOutlined />, defaultLabel: 'Chưa thanh toán', translationKey: 'booking_detail.payment_status.unpaid' },
  PAID: { color: 'success', icon: <CheckCircleOutlined />, defaultLabel: 'Đã thanh toán', translationKey: 'booking_detail.payment_status.paid' },
  FAILED: { color: 'error', icon: <CloseCircleOutlined />, defaultLabel: 'Thanh toán thất bại', translationKey: 'booking_detail.payment_status.failed' },
  REFUNDED: { color: 'default', icon: <SyncOutlined />, defaultLabel: 'Đã hoàn tiền', translationKey: 'booking_detail.payment_status.refunded' },
};

// Helper for price currency localization
const formatPrice = (value: any, _lang?: string) => {
  return `${Number(value).toLocaleString('vi-VN')} ₫`;
};

// ─── BookingDetail Page ────────────────────────────────────────────────────────

const BookingDetail: React.FC = () => {
  const { t, i18n } = useTranslation('portal');
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const [isRedirectingToVnpay, setIsRedirectingToVnpay] = useState(false);

  const { data: response, isLoading, isError } = useBookingDetail(id ?? '');
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();

  const booking = response?.data ?? null;
  const status = booking?.status ?? 'PENDING';
  const paymentStatus = booking?.paymentStatus ?? 'UNPAID';
  const statusInfo = statusConfig[status];
  const paymentInfo = paymentStatusConfig[paymentStatus];

  const handleCancel = () => {
    cancelBooking(id, {
      onSuccess: () => {
        notification.success({
          message: t('booking_detail.notifications.cancel_success', 'Đã huỷ đặt phòng'),
          description: t('booking_detail.notifications.cancel_success_desc', 'Đơn đặt phòng của bạn đã được huỷ thành công.'),
        });
      },
    });
  };

  const handleVnpayPayment = async () => {
    setIsRedirectingToVnpay(true);
    try {
      const res = await getVnpayUrl(id);
      const paymentUrl = res?.data?.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        notification.error({ message: t('booking_detail.notifications.pay_error', 'Không thể tạo link thanh toán. Vui lòng thử lại.') });
        setIsRedirectingToVnpay(false);
      }
    } catch {
      notification.error({ message: t('booking_detail.notifications.pay_conn_error', 'Lỗi kết nối. Vui lòng thử lại sau.') });
      setIsRedirectingToVnpay(false);
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <Skeleton active paragraph={{ rows: 8 }} />
      </PageWrapper>
    );
  }

  if (isError || !booking) {
    return (
      <PageWrapper>
        <TopBar>
          <BackBtn onClick={() => navigate({ to: '/bookings' })}>
            <ArrowLeftOutlined /> {t('booking_detail.back_to_list', 'Quay lại danh sách')}
          </BackBtn>
        </TopBar>
        <Card>
          <p>
            {t('booking_detail.load_error', 'Không thể tải thông tin đặt phòng.')}{' '}
            <Link to="/bookings">{t('booking_detail.back_to_list', 'Quay lại')}</Link>
          </p>
        </Card>
      </PageWrapper>
    );
  }

  const apt = booking.apartment;
  const startDate = new Date(booking.startDate).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : i18n.language === 'ja' ? 'ja-JP' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const endDate = new Date(booking.endDate).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : i18n.language === 'ja' ? 'ja-JP' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const nights = Math.max(
    0,
    Math.round(
      (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );

  const canCancel = status === 'PENDING' || status === 'CONFIRMED';

  return (
    <PageWrapper>
      <TopBar>
        <BackBtn onClick={() => navigate({ to: '/bookings' })}>
          <ArrowLeftOutlined /> {t('booking_detail.back_to_list', 'Quay lại danh sách')}
        </BackBtn>
        <BookingIdBadge>{id.slice(0, 16).toUpperCase()}</BookingIdBadge>
      </TopBar>

      <PageTitle>{t('booking_detail.title', 'Chi tiết đặt phòng')}</PageTitle>

      {/* Status card */}
      <Card>
        <CardTitle>
          {statusInfo.icon}
          {t('booking_detail.status_card_title', 'Trạng thái đơn đặt phòng')}
        </CardTitle>
        <Tag color={statusInfo.color} style={{ fontSize: '1.3rem', padding: '0.4rem 1.2rem', borderRadius: '0.4rem' }}>
          {t(statusInfo.translationKey, statusInfo.defaultLabel)}
        </Tag>

        <Divider style={{ margin: '1.5rem 0' }} />

        <CardTitle>
          <CreditCardOutlined />
          {t('booking_detail.payment_card_title', 'Trạng thái thanh toán')}
        </CardTitle>
        <Tag color={paymentInfo.color} icon={paymentInfo.icon} style={{ fontSize: '1.3rem', padding: '0.4rem 1.2rem', borderRadius: '0.4rem' }}>
          {t(paymentInfo.translationKey, paymentInfo.defaultLabel)}
        </Tag>
        {paymentStatus === 'PAID' && booking?.paymentDate && (
          <p style={{ marginTop: '0.8rem', fontSize: '1.4rem', color: portalTheme.colors.onSurfaceVariant }}>
            {t('booking_detail.payment_date', { date: new Date(booking.paymentDate).toLocaleString(i18n.language === 'vi' ? 'vi-VN' : i18n.language === 'ja' ? 'ja-JP' : 'en-US'), defaultValue: `Thanh toán lúc: ${new Date(booking.paymentDate).toLocaleString()}` })}
          </p>
        )}
      </Card>

      {/* Apartment info */}
      <Card>
        <CardTitle>
          <HomeOutlined />
          {t('booking_detail.apartment_info', 'Thông tin căn hộ')}
        </CardTitle>
        {apt?.images?.[0] && (
          <AptImage
            src={apt.images[0]}
            alt={apt.title}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        <Descriptions column={1} size="middle" bordered>
          <Descriptions.Item label={t('booking_detail.apartment_name', 'Tên căn hộ')}>{apt?.title ?? `${t('details.apartment', 'Căn hộ')} #${booking.apartmentId.slice(0, 8)}`}</Descriptions.Item>
          {apt?.location && (
            <Descriptions.Item label={<><EnvironmentOutlined /> {t('booking_detail.address', 'Địa chỉ')}</>}>
              {apt.location}
            </Descriptions.Item>
          )}
          {apt?.pricePerNight && (
            <Descriptions.Item label={<><DollarOutlined /> {t('booking_detail.price_per_night', 'Giá/đêm')}</>}>
              {formatPrice(apt.pricePerNight, i18n.language)}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* Dates & price */}
      <Card>
        <CardTitle>
          <CalendarOutlined />
          {t('booking_detail.booking_info', 'Thông tin đặt chỗ')}
        </CardTitle>
        <Descriptions column={2} size="middle" bordered>
          <Descriptions.Item label={t('booking_detail.check_in', 'Check-in')}>{startDate}</Descriptions.Item>
          <Descriptions.Item label={t('booking_detail.check_out', 'Check-out')}>{endDate}</Descriptions.Item>
          <Descriptions.Item label={t('booking_detail.duration', 'Thời gian')}>{t('booking_detail.duration_nights', { count: nights, defaultValue: `${nights} đêm` })}</Descriptions.Item>
          <Descriptions.Item label={<><DollarOutlined /> {t('booking_detail.total_price', 'Tổng cộng')}</>}>
            <strong style={{ color: portalTheme.colors.primary, fontSize: '2rem' }}>
              {formatPrice(booking.totalPrice, i18n.language)}
            </strong>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Actions */}
      <ActionRow>
        <Button
          type="default"
          onClick={() => navigate({ to: '/bookings' })}
          icon={<ArrowLeftOutlined />}
          style={{ height: '4rem', fontSize: '1.4rem', fontWeight: 600 }}
        >
          {t('booking_detail.btn_all_bookings', 'Tất cả đặt phòng')}
        </Button>

        {/* VNPay payment button: shown if status is PENDING and unpaid */}
        {status === 'PENDING' && paymentStatus !== 'PAID' && (
          <Button
            type="primary"
            icon={<CreditCardOutlined />}
            loading={isRedirectingToVnpay}
            onClick={handleVnpayPayment}
            style={{ background: '#005BAC', borderColor: '#005BAC', height: '4rem', fontSize: '1.4rem', fontWeight: 600 }}
          >
            {t('booking_detail.btn_pay_vnpay', 'Thanh toán qua VNPay')}
          </Button>
        )}

        {canCancel && (
          <Popconfirm
            title={t('booking_detail.cancel_confirm.title', 'Huỷ đơn đặt phòng?')}
            description={t('booking_detail.cancel_confirm.desc', 'Hành động này không thể hoàn tác.')}
            onConfirm={handleCancel}
            okText={t('booking_detail.cancel_confirm.ok', 'Xác nhận huỷ')}
            cancelText={t('booking_detail.cancel_confirm.cancel', 'Giữ lại')}
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              icon={<CloseCircleOutlined />}
              loading={isCancelling}
              style={{ height: '4rem', fontSize: '1.4rem', fontWeight: 600 }}
            >
              {t('booking_detail.btn_cancel_booking', 'Huỷ đặt phòng')}
            </Button>
          </Popconfirm>
        )}

        {apt?.id && (
          <Button
            onClick={() => navigate({ to: '/apartment/$id', params: { id: apt.id } })}
            style={{ height: '4rem', fontSize: '1.4rem', fontWeight: 600 }}
          >
            {t('booking_detail.btn_view_apartment', 'Xem căn hộ')}
          </Button>
        )}
      </ActionRow>
    </PageWrapper>
  );
};

export default BookingDetail;
