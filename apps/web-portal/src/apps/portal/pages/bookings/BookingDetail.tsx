import React, { useState } from 'react';
import { Link, useParams, useNavigate } from '@tanstack/react-router';
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
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${portalTheme.colors.onSurfaceVariant};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
  &:hover { color: ${portalTheme.colors.primary}; }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: -0.02em;
  color: ${portalTheme.colors.onSurface};
  margin-bottom: 0.5rem;
`;

const BookingIdBadge = styled.span`
  font-family: monospace;
  font-size: 0.8125rem;
  color: ${portalTheme.colors.outline};
  background: ${portalTheme.colors.surfaceContainerLow};
  padding: 0.25rem 0.625rem;
  border-radius: 0.25rem;
`;

const Card = styled.div`
  background: ${portalTheme.colors.surfaceContainerLowest};
  border: 1px solid rgba(224, 192, 182, 0.2);
  border-radius: 0.75rem;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 16px rgba(74, 27, 12, 0.04);
`;

const CardTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${portalTheme.colors.onSurface};
  margin: 0 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AptImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

// ─── Status helpers ────────────────────────────────────────────────────────────

const statusConfig: Record<
  BookingStatus,
  { color: string; icon: React.ReactNode; label: string }
> = {
  PENDING: { color: 'gold', icon: <ClockCircleOutlined />, label: 'Đang chờ xác nhận' },
  CONFIRMED: { color: 'blue', icon: <CheckCircleOutlined />, label: 'Đã xác nhận' },
  COMPLETED: { color: 'green', icon: <CheckCircleOutlined />, label: 'Hoàn thành' },
  CANCELLED: { color: 'red', icon: <StopOutlined />, label: 'Đã huỷ' },
};

const paymentStatusConfig: Record<
  PaymentStatus,
  { color: string; icon: React.ReactNode; label: string }
> = {
  UNPAID: { color: 'warning', icon: <ExclamationCircleOutlined />, label: 'Chưa thanh toán' },
  PAID: { color: 'success', icon: <CheckCircleOutlined />, label: 'Đã thanh toán' },
  FAILED: { color: 'error', icon: <CloseCircleOutlined />, label: 'Thanh toán thất bại' },
  REFUNDED: { color: 'default', icon: <SyncOutlined />, label: 'Đã hoàn tiền' },
};

// ─── BookingDetail Page ────────────────────────────────────────────────────────

const BookingDetail: React.FC = () => {
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
          message: 'Đã huỷ đặt phòng',
          description: 'Đơn đặt phòng của bạn đã được huỷ thành công.',
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
        notification.error({ message: 'Không thể tạo link thanh toán. Vui lòng thử lại.' });
        setIsRedirectingToVnpay(false);
      }
    } catch {
      notification.error({ message: 'Lỗi kết nối. Vui lòng thử lại sau.' });
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
            <ArrowLeftOutlined /> Back to Reservations
          </BackBtn>
        </TopBar>
        <Card>
          <p>Unable to load booking details. <Link to="/bookings">Go back</Link></p>
        </Card>
      </PageWrapper>
    );
  }

  const apt = booking.apartment;
  const startDate = new Date(booking.startDate).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const endDate = new Date(booking.endDate).toLocaleDateString('en-GB', {
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
          <ArrowLeftOutlined /> Back to Reservations
        </BackBtn>
        <BookingIdBadge>{id.slice(0, 16).toUpperCase()}</BookingIdBadge>
      </TopBar>

      <PageTitle>Booking Details</PageTitle>

      {/* Status card */}
      <Card>
        <CardTitle>
          {statusInfo.icon}
          Trạng thái đơn đặt phòng
        </CardTitle>
        <Tag color={statusInfo.color} style={{ fontSize: '1rem', padding: '0.25rem 0.75rem' }}>
          {statusInfo.label}
        </Tag>

        <Divider style={{ margin: '1rem 0' }} />

        <CardTitle>
          <CreditCardOutlined />
          Trạng thái thanh toán
        </CardTitle>
        <Tag color={paymentInfo.color} icon={paymentInfo.icon} style={{ fontSize: '1rem', padding: '0.25rem 0.75rem' }}>
          {paymentInfo.label}
        </Tag>
        {paymentStatus === 'PAID' && booking?.paymentDate && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: portalTheme.colors.onSurfaceVariant }}>
            Thanh toán lúc: {new Date(booking.paymentDate).toLocaleString('vi-VN')}
          </p>
        )}
      </Card>

      {/* Apartment info */}
      <Card>
        <CardTitle>
          <HomeOutlined />
          Property
        </CardTitle>
        {apt?.images?.[0] && (
          <AptImage
            src={apt.images[0]}
            alt={apt.title}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        <Descriptions column={1} size="small" bordered>
          <Descriptions.Item label="Title">{apt?.title ?? `Apartment #${booking.apartmentId.slice(0, 8)}`}</Descriptions.Item>
          {apt?.location && (
            <Descriptions.Item label={<><EnvironmentOutlined /> Location</>}>
              {apt.location}
            </Descriptions.Item>
          )}
          {apt?.pricePerNight && (
            <Descriptions.Item label={<><DollarOutlined /> Giá/đêm</>}>
              {apt.pricePerNight.toLocaleString('vi-VN')} ₫
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* Dates & price */}
      <Card>
        <CardTitle>
          <CalendarOutlined />
          Reservation Details
        </CardTitle>
        <Descriptions column={2} size="small" bordered>
          <Descriptions.Item label="Check-in">{startDate}</Descriptions.Item>
          <Descriptions.Item label="Check-out">{endDate}</Descriptions.Item>
          <Descriptions.Item label="Thời gian">{nights} đêm</Descriptions.Item>
          <Descriptions.Item label={<><DollarOutlined /> Tổng cộng</>}>
            <strong style={{ color: portalTheme.colors.primary, fontSize: '1.125rem' }}>
              {booking.totalPrice.toLocaleString('vi-VN')} ₫
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
        >
          Tất cả đặt phòng
        </Button>

        {/* Nút thanh toán VNPay: hiện khi PENDING và chưa thanh toán */}
        {status === 'PENDING' && paymentStatus !== 'PAID' && (
          <Button
            type="primary"
            icon={<CreditCardOutlined />}
            loading={isRedirectingToVnpay}
            onClick={handleVnpayPayment}
            style={{ background: '#005BAC', borderColor: '#005BAC' }}
          >
            Thanh toán qua VNPay
          </Button>
        )}

        {canCancel && (
          <Popconfirm
            title="Huỷ đơn đặt phòng?"
            description="Hành động này không thể hoàn tác."
            onConfirm={handleCancel}
            okText="Xác nhận huỷ"
            cancelText="Giữ lại"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              icon={<CloseCircleOutlined />}
              loading={isCancelling}
            >
              Huỷ đặt phòng
            </Button>
          </Popconfirm>
        )}

        {apt?.id && (
          <Button
            onClick={() => navigate({ to: '/apartment/$id', params: { id: apt.id } })}
          >
            Xem căn hộ
          </Button>
        )}
      </ActionRow>
    </PageWrapper>
  );
};

export default BookingDetail;
