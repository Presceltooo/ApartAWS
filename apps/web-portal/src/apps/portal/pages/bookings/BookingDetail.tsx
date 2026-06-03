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
  SmileOutlined,
} from '@ant-design/icons';
import { Tag, Popconfirm, notification, Skeleton, Descriptions, Divider, Rate, Input } from 'antd';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { portalTheme } from '../../styled';
import { useBookingDetail } from '@apps/portal/services/query';
import { useCancelBooking, useCreateReview } from '@apps/portal/services/mutation';
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

const StyledActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  margin-top: 3rem;
  flex-wrap: wrap;
  width: 100%;
`;

const LeftActions = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const RightActions = styled.div`
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  align-items: center;
`;

const BaseActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  height: 4.6rem;
  padding: 0 2.2rem;
  font-size: 1.405rem;
  font-weight: 600;
  border-radius: 0.8rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  font-family: inherit;
  
  &:hover {
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const BackActionButton = styled(BaseActionButton)`
  background-color: ${portalTheme.colors.surfaceContainerLowest};
  border: 1px solid ${portalTheme.colors.outlineVariant};
  color: ${portalTheme.colors.onSurfaceVariant};
  
  &:hover {
    border-color: ${portalTheme.colors.primary};
    color: ${portalTheme.colors.primary};
    background-color: rgba(216, 90, 48, 0.04);
  }
`;


const VNPayActionButton = styled(BaseActionButton)`
  background: linear-gradient(135deg, #005BAC 0%, #004481 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 91, 172, 0.15);
  
  &:hover {
    box-shadow: 0 6px 16px rgba(0, 91, 172, 0.25);
    opacity: 0.95;
  }
`;

const DangerActionButton = styled(BaseActionButton)`
  background-color: ${portalTheme.colors.surfaceContainerLowest};
  border: 1px solid rgba(220, 53, 69, 0.3);
  color: #dc3545;
  
  &:hover {
    border-color: #dc3545;
    background-color: rgba(220, 53, 69, 0.04);
  }
`;

const SecondaryActionButton = styled(BaseActionButton)`
  background-color: ${portalTheme.colors.surfaceContainerLowest};
  border: 1px solid ${portalTheme.colors.outlineVariant};
  color: ${portalTheme.colors.onSurface};
  
  &:hover {
    border-color: ${portalTheme.colors.primary};
    color: ${portalTheme.colors.primary};
    background-color: rgba(216, 90, 48, 0.04);
  }
`;

const ReviewSection = styled(Card)`
  background: linear-gradient(135deg, #fcf9f4 0%, #f6f3ee 100%);
  border: 1px solid rgba(216, 90, 48, 0.15);
  box-shadow: 0 8px 30px rgba(216, 90, 48, 0.05);
`;

const RatingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  
  .ant-rate {
    font-size: 2.8rem;
    color: #D85A30;
  }
`;

const RatingLabel = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${portalTheme.colors.onSurfaceVariant};
`;

const ReviewTextArea = styled(Input.TextArea)`
  margin-bottom: 2rem;
  display: block;
  width: 100%;
  min-height: 120px !important;

  &.ant-input-textarea {
    min-height: 120px !important;
  }

  textarea.ant-input {
    border: 1px solid ${portalTheme.colors.outlineVariant} !important;
    border-radius: 0.8rem !important;
    padding: 1.2rem !important;
    font-size: 1.45rem !important;
    color: ${portalTheme.colors.onSurface} !important;
    background-color: white !important;
    transition: all 0.2s !important;
    font-family: inherit !important;
    height: 100% !important;
    min-height: 120px !important; /* Make it longer/taller */
    resize: vertical !important;
    
    &:hover, &:focus {
      border-color: ${portalTheme.colors.primary} !important;
      box-shadow: 0 0 0 2px rgba(216, 90, 48, 0.1) !important;
    }
  }
`;

const SubmitReviewBtn = styled(BaseActionButton)`
  background: linear-gradient(135deg, #D85A30 0%, #993C1D 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(216, 90, 48, 0.15);
  margin-top: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  align-self: flex-end; /* Push button to the right */
  
  &:hover {
    box-shadow: 0 6px 16px rgba(216, 90, 48, 0.25);
    opacity: 0.95;
  }
`;

const ReviewDisplayCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(216, 90, 48, 0.02);
  border-radius: 0.8rem;
  border-left: 4px solid #D85A30;
`;

const ReviewFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: flex-start;
  width: 100%;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .rating-score {
    font-size: 1.6rem;
    font-weight: 700;
    color: #4A1B0C;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ReviewComment = styled.p`
  font-size: 1.45rem;
  color: ${portalTheme.colors.onSurfaceVariant};
  line-height: 1.6;
  margin: 0;
  font-style: italic;
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
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');

  const { data: response, isLoading, isError } = useBookingDetail(id ?? '');
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();
  const { mutate: submitReview, isPending: isSubmitting } = useCreateReview(response?.data?.apartmentId ?? '');

  const booking = response?.data ?? null;

  const handleReviewSubmit = () => {
    if (!booking) return;
    if (!rating) {
      notification.error({ message: t('booking_detail.review.rating_required', 'Vui lòng chọn số sao đánh giá.') });
      return;
    }
    
    submitReview(
      { bookingId: booking.id, rating, comment },
      {
        onSuccess: () => {
          notification.success({
            message: t('booking_detail.review.success_title', 'Cảm ơn đánh giá của bạn!'),
            description: t('booking_detail.review.success_desc', 'Đánh giá đã được gửi thành công và hiển thị công khai.'),
          });
        },
      }
    );
  };
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
  const startDate = dayjs(booking.startDate).format('DD/MM/YYYY');
  const endDate = dayjs(booking.endDate).format('DD/MM/YYYY');
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
          <Descriptions.Item label={t('booking_detail.duration', 'Thời gian')} span={2}>
            {t('booking_detail.duration_nights', { count: nights, defaultValue: `${nights} đêm` })}
          </Descriptions.Item>
        </Descriptions>

        {/* Price breakdown — same logic as BookingModal */}
        {(() => {
          const CLEANING_FEE = 120000;
          const SERVICE_FEE = 85000;
          const pricePerNightVal = Number(apt?.pricePerNight ?? 0);
          const subtotal = pricePerNightVal * nights;
          // If totalPrice equals subtotal only (old bookings without fees), show as-is
          const hasExtraFees = Number(booking.totalPrice) >= subtotal + CLEANING_FEE + SERVICE_FEE - 1;

          return (
            <div style={{ marginTop: '1.5rem', background: 'rgba(216,90,48,0.04)', borderRadius: '0.6rem', padding: '1.5rem 2rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4A1B0C', marginBottom: '1rem' }}>
                {t('booking_detail.price_summary', 'Tóm tắt giá')}
              </div>

              {/* pricePerNight × nights */}
              {pricePerNightVal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', marginBottom: '0.6rem', color: '#6B3020' }}>
                  <span>{pricePerNightVal.toLocaleString('vi-VN')} ₫ × {nights} {t('booking_detail.nights', 'đêm')}</span>
                  <span>{subtotal.toLocaleString('vi-VN')} ₫</span>
                </div>
              )}

              {/* Phí vệ sinh & dịch vụ — chỉ hiển thị nếu booking có cộng phí */}
              {hasExtraFees && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', marginBottom: '0.6rem', color: '#6B3020' }}>
                    <span>{t('booking_detail.cleaning_fee', 'Phí vệ sinh')}</span>
                    <span>{CLEANING_FEE.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', marginBottom: '1rem', color: '#6B3020' }}>
                    <span>{t('booking_detail.service_fee', 'Phí dịch vụ')}</span>
                    <span>{SERVICE_FEE.toLocaleString('vi-VN')} ₫</span>
                  </div>
                </>
              )}

              <div style={{ height: '1px', background: 'rgba(216,90,48,0.2)', margin: '0.8rem 0' }} />

              {/* Tổng cộng */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 700, color: '#4A1B0C' }}>
                  {t('booking_detail.total_price', 'Tổng cộng')}
                </span>
                <strong style={{ color: '#D85A30', fontSize: '2.2rem', fontWeight: 800 }}>
                  {formatPrice(booking.totalPrice, i18n.language)}
                </strong>
              </div>
            </div>
          );
        })()}
      </Card>

      {/* Review Section */}
      {status === 'COMPLETED' && (
        <ReviewSection>
          <CardTitle>
            <SmileOutlined style={{ color: '#D85A30' }} />
            {t('booking_detail.review.section_title', 'Đánh giá chuyến đi')}
          </CardTitle>
          
          {(() => {
            const alreadyReviewed = booking.apartment?.reviews?.find(
              (r: any) => r.bookingId === booking.id
            );

            return alreadyReviewed ? (
              <ReviewDisplayCard>
                <ReviewHeader>
                  <div className="rating-score">
                    <Rate disabled defaultValue={alreadyReviewed.rating} style={{ color: '#D85A30', fontSize: '1.8rem' }} />
                    <span>({alreadyReviewed.rating} {t('booking_detail.review.stars', 'sao')})</span>
                  </div>
                  <span style={{ fontSize: '1.25rem', color: portalTheme.colors.outline }}>
                    {dayjs(alreadyReviewed.createdAt).format('DD/MM/YYYY')}
                  </span>
                </ReviewHeader>
                {alreadyReviewed.comment && (
                  <ReviewComment>"{alreadyReviewed.comment}"</ReviewComment>
                )}
              </ReviewDisplayCard>
            ) : (
              <ReviewFormContainer>
                <p style={{ fontSize: '1.4rem', color: portalTheme.colors.onSurfaceVariant, margin: 0 }}>
                  {t('booking_detail.review.prompt', 'Chia sẻ cảm nhận của bạn về căn hộ để giúp đỡ cộng đồng du khách.')}
                </p>
                
                <RatingWrapper style={{ marginBottom: 0 }}>
                  <RatingLabel>{t('booking_detail.review.rating_label', 'Điểm đánh giá')}</RatingLabel>
                  <Rate value={rating} onChange={setRating} />
                </RatingWrapper>
                
                <div style={{ width: '100%' }}>
                  <RatingLabel style={{ marginBottom: '0.8rem' }}>{t('booking_detail.review.comment_label', 'Nhận xét chi tiết')}</RatingLabel>
                  <ReviewTextArea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t('booking_detail.review.comment_placeholder', 'Nhập nhận xét của bạn về không gian, tiện nghi, vị trí...')}
                    maxLength={500}
                    showCount
                  />
                </div>
                
                <SubmitReviewBtn onClick={handleReviewSubmit} disabled={isSubmitting}>
                  {t('booking_detail.review.submit_btn', 'Gửi đánh giá')}
                </SubmitReviewBtn>
              </ReviewFormContainer>
            );
          })()}
        </ReviewSection>
      )}

      {/* Actions */}
      <StyledActionRow>
        <LeftActions>
          <BackActionButton onClick={() => navigate({ to: '/bookings' })}>
            <ArrowLeftOutlined /> {t('booking_detail.btn_all_bookings', 'Tất cả đặt phòng')}
          </BackActionButton>
        </LeftActions>

        <RightActions>
          {(status === 'PENDING' || status === 'CONFIRMED') && paymentStatus !== 'PAID' && (
            <VNPayActionButton
              onClick={handleVnpayPayment}
              disabled={isRedirectingToVnpay}
            >
              <CreditCardOutlined />
              {t('booking_detail.btn_pay_vnpay', 'Thanh toán qua VNPay')}
            </VNPayActionButton>
          )}

          {apt?.id && (
            <SecondaryActionButton
              onClick={() => navigate({ to: '/apartment/$id', params: { id: apt.id } })}
            >
              <HomeOutlined />
              {t('booking_detail.btn_view_apartment', 'Xem căn hộ')}
            </SecondaryActionButton>
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
              <DangerActionButton disabled={isCancelling}>
                <CloseCircleOutlined />
                {t('booking_detail.btn_cancel_booking', 'Huỷ đặt phòng')}
              </DangerActionButton>
            </Popconfirm>
          )}
        </RightActions>
      </StyledActionRow>
    </PageWrapper>
  );
};

export default BookingDetail;
