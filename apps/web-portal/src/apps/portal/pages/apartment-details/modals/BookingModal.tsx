import React, { useState } from 'react';
import { Form, DatePicker, Button, notification } from 'antd';
import { 
  ArrowRightOutlined, 
  CalendarOutlined, 
  TeamOutlined, 
  MinusOutlined, 
  PlusOutlined,
} from '@ant-design/icons';
import BaseModal from '@/shared/components/modals';
import dayjs from 'dayjs';
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
  FooterNote
} from './styled';

interface IBookingModalProps {
  open: boolean;
  onClose: () => void;
  propertyName?: string;
  pricePerNight?: number;
}

const BookingModal: React.FC<IBookingModalProps> = ({
  open,
  onClose,
  propertyName = "The Heritage Penthouse",
  pricePerNight = 450
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guests, setGuests] = useState(2);

  const onFinish = async (values: any) => {
    setIsSubmitting(true);
    console.log('Booking request values:', { ...values, guests });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    notification.success({
      message: 'Reservation Initialized',
      description: `Your request for ${propertyName} has been received.`,
    });
    onClose();
    form.resetFields();
  };

  // Mock calculation
  const nights = 3;
  const subtotal = pricePerNight * nights;
  const cleaningFee = 120;
  const serviceFee = 85;
  const total = subtotal + cleaningFee + serviceFee;

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
            loading={isSubmitting}
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
              gap: '8px'
            }}
          >
            Confirm Booking
            <ArrowRightOutlined />
          </Button>
          <FooterNote>You won't be charged yet.</FooterNote>
        </div>
      ]}
    >
      <BookingSectionHeader>
        <h2>Reserve Sanctuary</h2>
        <p>{propertyName}</p>
      </BookingSectionHeader>

      <div style={{ padding: '24px 32px' }}>
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish}
          initialValues={{
            dates: [dayjs('2024-10-15'), dayjs('2024-10-18')]
          }}
        >
          <FormSectionHeader>Reservation details</FormSectionHeader>
          
          <Form.Item 
            name="dates" 
            label={<FieldLabel>Selected Dates</FieldLabel>}
            rules={[{ required: true, message: 'Please select dates' }]}
          >
            <DatePicker.RangePicker 
              style={{ width: '100%', height: '48px', borderRadius: '8px' }}
              suffixIcon={<CalendarOutlined />}
            />
          </Form.Item>

          <Form.Item label={<FieldLabel>Guests</FieldLabel>}>
            <GuestCounterWrapper>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TeamOutlined style={{ marginRight: '12px', fontSize: '1.25rem', color: 'var(--on-surface-variant)' }} />
                <span style={{ fontSize: '1rem', fontWeight: 500 }}>{guests} Guests</span>
              </div>
              <CounterControls>
                <CounterBtn 
                  type="button"
                  onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                  disabled={guests <= 1}
                >
                  <MinusOutlined />
                </CounterBtn>
                <span>{guests}</span>
                <CounterBtn type="button" onClick={() => setGuests(prev => prev + 1)}>
                  <PlusOutlined />
                </CounterBtn>
              </CounterControls>
            </GuestCounterWrapper>
          </Form.Item>

          <FormSectionHeader style={{ marginTop: '24px' }}>Price Summary</FormSectionHeader>
          <PriceSummaryCard>
            <SummaryRow>
              <span>${pricePerNight} × {nights} nights</span>
              <span className="value">${subtotal.toLocaleString()}</span>
            </SummaryRow>
            <SummaryRow>
              <span className="label-link">Cleaning fee</span>
              <span className="value">${cleaningFee}</span>
            </SummaryRow>
            <SummaryRow>
              <span className="label-link">Service fee</span>
              <span className="value">${serviceFee}</span>
            </SummaryRow>
            <Divider />
            <SummaryRow $isTotal>
              <span>Total</span>
              <span className="value">${total.toLocaleString()}</span>
            </SummaryRow>
          </PriceSummaryCard>
        </Form>
      </div>
    </BaseModal>
  );
};

export default BookingModal;
