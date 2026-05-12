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
import {
  BookingSectionHeader,
  FormSectionHeader,
  FieldLabel,
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

interface IBookingModalProps {
  open: boolean;
  onClose: () => void;
  apartmentId: string;
  propertyName?: string;
  pricePerNight?: number;
}

const BookingModal: React.FC<IBookingModalProps> = ({
  open,
  onClose,
  apartmentId,
  propertyName = 'The Heritage Penthouse',
  pricePerNight = 450,
}) => {
  const [form] = Form.useForm();
  const [guests, setGuests] = useState(2);
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);

  const { mutate: createBooking, isPending, error: mutationError } = useCreateBooking();

  const { nights, subtotal } = useBookingCalculation(
    dateRange[0],
    dateRange[1],
    pricePerNight,
  );

  const cleaningFee = 120;
  const serviceFee = 85;
  const total = subtotal + cleaningFee + serviceFee;

  const onFinish = (values: { dates: [Dayjs, Dayjs] }) => {
    const [start, end] = values.dates;
    createBooking(
      {
        apartmentId,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        totalPrice: total,
      },
      {
        onSuccess: () => {
          notification.success({
            message: 'Đặt phòng thành công!',
            description: `Đơn đặt phòng cho ${propertyName} đã được ghi nhận.`,
          });
          form.resetFields();
          setDateRange([null, null]);
          onClose();
        },
      },
    );
  };

  const handleDateChange = (_: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings);
  };

  return (
    <BaseModal
      title="Xác nhận đặt phòng"
      open={open}
      onCancel={onClose}
      width={520}
      footer={[
        <div key="footer-actions" style={{ padding: '0 32px 32px' }}>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={isPending}
            style={{
              width: '100%',
              height: '52px',
              borderRadius: '8px',
              fontSize: '1.125rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #D85A30 0%, #993C1D 100%)',
              border: 'none',
              boxShadow: '0 4px 15px rgba(216, 90, 48, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            Xác nhận đặt phòng
            <ArrowRightOutlined />
          </Button>
          <FooterNote>Bạn sẽ chưa bị trừ tiền ngay lúc này.</FooterNote>
        </div>,
      ]}
    >
      <BookingSectionHeader>
        <h2>Đặt căn hộ</h2>
        <p>{propertyName}</p>
      </BookingSectionHeader>

      <div style={{ padding: '24px 32px' }}>
        {mutationError && (
          <Alert
            type="error"
            message="Đặt phòng thất bại"
            description={(mutationError as any)?.message ?? 'Vui lòng thử lại.'}
            style={{ marginBottom: 16 }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <FormSectionHeader>Chi tiết đặt chỗ</FormSectionHeader>

          <Form.Item
            name="dates"
            label={<FieldLabel>Ngày đã chọn</FieldLabel>}
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <DatePicker.RangePicker
              style={{ width: '100%', height: '48px', borderRadius: '8px' }}
              suffixIcon={<CalendarOutlined />}
              disabledDate={(d) => d.isBefore(dayjs(), 'day')}
              onChange={handleDateChange}
            />
          </Form.Item>

          <Form.Item label={<FieldLabel>Số khách</FieldLabel>}>
            <GuestCounterWrapper>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TeamOutlined style={{ marginRight: '12px', fontSize: '1.25rem' }} />
                <span style={{ fontSize: '1rem', fontWeight: 500 }}>{guests} Khách</span>
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
                <CounterBtn type="button" onClick={() => setGuests((prev) => prev + 1)}>
                  <PlusOutlined />
                </CounterBtn>
              </CounterControls>
            </GuestCounterWrapper>
          </Form.Item>

          <FormSectionHeader style={{ marginTop: '24px' }}>Tóm tắt giá</FormSectionHeader>
          <PriceSummaryCard>
            <SummaryRow>
              <span>
                {pricePerNight.toLocaleString('vi-VN')} ₫ × {nights > 0 ? nights : '—'} đêm
              </span>
              <span className="value">{nights > 0 ? (subtotal).toLocaleString('vi-VN') + ' ₫' : '—'}</span>
            </SummaryRow>
            <SummaryRow>
              <span className="label-link">Phí vệ sinh</span>
              <span className="value">{cleaningFee.toLocaleString('vi-VN')} ₫</span>
            </SummaryRow>
            <SummaryRow>
              <span className="label-link">Phí dịch vụ</span>
              <span className="value">{serviceFee.toLocaleString('vi-VN')} ₫</span>
            </SummaryRow>
            <Divider />
            <SummaryRow $isTotal>
              <span>Tổng cộng</span>
              <span className="value">{nights > 0 ? (total).toLocaleString('vi-VN') + ' ₫' : '—'}</span>
            </SummaryRow>
          </PriceSummaryCard>
        </Form>
      </div>
    </BaseModal>
  );
};

export default BookingModal;
