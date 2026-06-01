import React, { useState } from 'react';
import { Form, DatePicker, Button, notification, Alert } from 'antd';
import {
  ArrowRightOutlined,
  CalendarOutlined,
  TeamOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import BaseModal from '@/shared/components/modals';
import dayjs, { type Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { portalTheme } from '../../../styled';
import 'dayjs/locale/vi';
import 'dayjs/locale/ja';
import {
  BookingSectionHeader,
  FormSectionHeader,
  GuestCounterWrapper,
  CounterControls,
  CounterBtn,
  PriceSummaryCard,
  SummaryRow,
  Divider,
  FooterNote,
} from './styled';
import { useCreateBooking } from '@apps/portal/services/mutation';
import { useBookingCalculation } from '@apps/portal/hooks/useBookingCalculation';
import RedirectThanhToan from '@/apps/portal/modal/Dat-phong/RedirectThanhToan';

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 24px;
  }
  .ant-form-item-label > label {
    font-size: 1.5rem !important;
    font-weight: 600 !important;
    color: ${portalTheme.colors.onSurface} !important;
    height: auto !important;
    display: inline-flex !important;
    align-items: center !important;
    margin-bottom: 8px !important;
  }
  .ant-form-item-required::after {
    font-size: 1.5rem !important;
    margin-inline-start: 6px !important;
  }
`;

const StyledRangePicker = styled(DatePicker.RangePicker)`
  &.ant-picker {
    width: 100%;
    height: 52px;
    border-radius: 8px;
    border: 1px solid rgba(153, 60, 29, 0.15);
    background-color: ${portalTheme.colors.surfaceContainerLowest};
    
    &:hover, &.ant-picker-focused {
      border-color: ${portalTheme.colors.primary};
      box-shadow: 0 0 0 2px rgba(216, 90, 48, 0.1);
    }
    
    .ant-picker-input > input {
      font-size: 1.5rem !important;
      font-weight: 500;
      color: ${portalTheme.colors.onSurface};
    }
    
    .ant-picker-separator {
      color: ${portalTheme.colors.onSurfaceVariant};
      font-size: 1.6rem;
    }
    
    .ant-picker-suffix {
      color: ${portalTheme.colors.primary};
      font-size: 1.6rem;
    }
  }
`;

interface IBookingModalProps {
  open: boolean;
  onClose: () => void;
  apartmentId: string;
  propertyName?: string;
  pricePerNight?: number;
  cleaningFee?: number;
  serviceFee?: number;
  maxGuests?: number;
}

const BookingModal: React.FC<IBookingModalProps> = ({
  open,
  onClose,
  apartmentId,
  propertyName = 'The Heritage Penthouse',
  pricePerNight = 450,
  cleaningFee = 120000,
  serviceFee = 85000,
  maxGuests = 2,
}) => {
  const [form] = Form.useForm();
  const [guests, setGuests] = useState(2);
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState('');

  const { t, i18n } = useTranslation('portal');
  const { mutate: createBooking, isPending, error: mutationError } = useCreateBooking();

  const numericPricePerNight = Number(pricePerNight);

  const { nights, subtotal } = useBookingCalculation(
    dateRange[0],
    dateRange[1],
    numericPricePerNight,
  );

  const total = subtotal + cleaningFee + serviceFee;

  React.useEffect(() => {
    dayjs.locale(i18n.language);
  }, [i18n.language]);

  React.useEffect(() => {
    if (open) {
      setGuests(Math.min(2, maxGuests));
    }
  }, [open, maxGuests]);

  const onFinish = (values: any) => {
    const [start, end] = values.dates as [Dayjs, Dayjs];
    createBooking(
      {
        apartmentId,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        totalPrice: total,
      },
      {
        onSuccess: (res) => {
          notification.success({
            message: t('booking_modal.success_title', 'Đặt phòng thành công!'),
            description: t('booking_modal.success_desc', { name: propertyName, defaultValue: `Đơn đặt phòng cho ${propertyName} đã được ghi nhận.` }),
          });
          const bookingId = res?.data?.id ?? '';
          setCreatedBookingId(bookingId);
          form.resetFields();
          setDateRange([null, null]);
          onClose();
          if (bookingId) {
            setIsRedirectModalOpen(true);
          }
        },
      },
    );
  };

  const handleDateChange = (dates: any) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]);
    } else {
      setDateRange([null, null]);
    }
  };

  return (
    <>
    <BaseModal
      title={t('booking_modal.title', 'Xác nhận đặt phòng')}
      open={open}
      onCancel={onClose}
      width={560}
      footer={[
        <div key="footer-actions" style={{ padding: '0 32px 32px' }}>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={isPending}
            style={{
              width: '100%',
              height: '56px',
              borderRadius: '8px',
              fontSize: '1.6rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #D85A30 0%, #993C1D 100%)',
              border: 'none',
              boxShadow: '0 4px 15px rgba(216, 90, 48, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            {t('booking_modal.btn_confirm', 'Xác nhận đặt phòng')}
            <ArrowRightOutlined />
          </Button>
          <FooterNote>{t('booking_modal.footer_note', 'Bạn sẽ chưa bị trừ tiền ngay lúc này.')}</FooterNote>
        </div>,
      ]}
    >
      <BookingSectionHeader>
        <h2>{t('booking_modal.sub_title', 'Đặt căn hộ')}</h2>
        <p>{propertyName}</p>
      </BookingSectionHeader>

      <div 
        style={{ padding: '24px 32px' }}
      >
        {mutationError && (
          <Alert
            type="error"
            message={t('booking_modal.error_title', 'Đặt phòng thất bại')}
            description={(mutationError as any)?.message ?? t('booking_modal.error_desc_fallback', 'Vui lòng thử lại.')}
            style={{ marginBottom: 16 }}
          />
        )}

        <StyledForm
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <FormSectionHeader>{t('booking_modal.section_details', 'Chi tiết đặt chỗ')}</FormSectionHeader>

          <Form.Item
            name="dates"
            label={t('booking_modal.label_dates', 'Ngày đã chọn')}
            rules={[{ required: true, message: t('booking_modal.validation_dates', 'Vui lòng chọn ngày') }]}
          >
            <StyledRangePicker
              suffixIcon={<CalendarOutlined />}
              disabledDate={(d) => d.isBefore(dayjs(), 'day')}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item label={t('booking_modal.label_guests', 'Số khách')}>
            <GuestCounterWrapper>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TeamOutlined style={{ marginRight: '12px', fontSize: '1.25rem' }} />
                <span style={{ fontSize: '1.05rem', fontWeight: 500 }}>
                  {t('booking_modal.guests_count', { count: guests, defaultValue: `${guests} Khách` })}
                </span>
              </div>
              <CounterControls>
                <CounterBtn
                  type="button"
                  onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
                  disabled={guests <= 1}
                >
                  <MinusOutlined />
                </CounterBtn>
                <span>{guests}</span>
                <CounterBtn 
                  type="button" 
                  onClick={() => setGuests((prev) => Math.min(maxGuests, prev + 1))}
                  disabled={guests >= maxGuests}
                >
                  <PlusOutlined />
                </CounterBtn>
              </CounterControls>
            </GuestCounterWrapper>
          </Form.Item>

          <FormSectionHeader style={{ marginTop: '24px' }}>
            {t('booking_modal.section_price', 'Tóm tắt giá')}
          </FormSectionHeader>
          <PriceSummaryCard>
            <SummaryRow>
              <span>
                {t('booking_modal.price_per_night', {
                  price: numericPricePerNight.toLocaleString('vi-VN'),
                  count: nights > 0 ? nights : '—',
                  defaultValue: `${numericPricePerNight.toLocaleString('vi-VN')} ₫ × ${nights > 0 ? nights : '—'} đêm`
                })}
              </span>
              <span className="value">{nights > 0 ? (subtotal).toLocaleString('vi-VN') + ' ₫' : '—'}</span>
            </SummaryRow>
            <SummaryRow>
              <span className="label-link">{t('booking_modal.cleaning_fee', 'Phí vệ sinh')}</span>
              <span className="value">{cleaningFee.toLocaleString('vi-VN')} ₫</span>
            </SummaryRow>
            <SummaryRow>
              <span className="label-link">{t('booking_modal.service_fee', 'Phí dịch vụ')}</span>
              <span className="value">{serviceFee.toLocaleString('vi-VN')} ₫</span>
            </SummaryRow>
            <Divider />
            <SummaryRow $isTotal>
              <span>{t('booking_modal.total', 'Tổng cộng')}</span>
              <span className="value">{nights > 0 ? (total).toLocaleString('vi-VN') + ' ₫' : '—'}</span>
            </SummaryRow>
          </PriceSummaryCard>
        </StyledForm>
      </div>
    </BaseModal>

    <RedirectThanhToan
      open={isRedirectModalOpen}
      onClose={() => setIsRedirectModalOpen(false)}
      bookingId={createdBookingId}
    />
    </>
  );
};

export default BookingModal;
