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

  const { nights, subtotal, formatUSD } = useBookingCalculation(
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
            message: 'Reservation Confirmed!',
            description: `Your booking for ${propertyName} has been placed successfully.`,
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
      title="Confirm Your Reservation"
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
            Confirm Booking
            <ArrowRightOutlined />
          </Button>
          <FooterNote>You won't be charged yet.</FooterNote>
        </div>,
      ]}
    >
      <BookingSectionHeader>
        <h2>Reserve Sanctuary</h2>
        <p>{propertyName}</p>
      </BookingSectionHeader>

      <div style={{ padding: '24px 32px' }}>
        {mutationError && (
          <Alert
            type="error"
            message="Booking failed"
            description={(mutationError as any)?.message ?? 'Please try again.'}
            style={{ marginBottom: 16 }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <FormSectionHeader>Reservation details</FormSectionHeader>

          <Form.Item
            name="dates"
            label={<FieldLabel>Selected Dates</FieldLabel>}
            rules={[{ required: true, message: 'Please select your dates' }]}
          >
            <DatePicker.RangePicker
              style={{ width: '100%', height: '48px', borderRadius: '8px' }}
              suffixIcon={<CalendarOutlined />}
              disabledDate={(d) => d.isBefore(dayjs(), 'day')}
              onChange={handleDateChange}
            />
          </Form.Item>

          <Form.Item label={<FieldLabel>Guests</FieldLabel>}>
            <GuestCounterWrapper>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TeamOutlined style={{ marginRight: '12px', fontSize: '1.25rem' }} />
                <span style={{ fontSize: '1rem', fontWeight: 500 }}>{guests} Guests</span>
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

          <FormSectionHeader style={{ marginTop: '24px' }}>Price Summary</FormSectionHeader>
          <PriceSummaryCard>
            <SummaryRow>
              <span>
                ${pricePerNight} × {nights > 0 ? nights : '—'} nights
              </span>
              <span className="value">{nights > 0 ? formatUSD(subtotal) : '—'}</span>
            </SummaryRow>
            <SummaryRow>
              <span className="label-link">Cleaning fee</span>
              <span className="value">{formatUSD(cleaningFee)}</span>
            </SummaryRow>
            <SummaryRow>
              <span className="label-link">Service fee</span>
              <span className="value">{formatUSD(serviceFee)}</span>
            </SummaryRow>
            <Divider />
            <SummaryRow $isTotal>
              <span>Total</span>
              <span className="value">{nights > 0 ? formatUSD(total) : '—'}</span>
            </SummaryRow>
          </PriceSummaryCard>
        </Form>
      </div>
    </BaseModal>
  );
};

export default BookingModal;
