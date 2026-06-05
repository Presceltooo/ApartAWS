import React from 'react';
import { Tag, Button, Descriptions, Divider, Image } from 'antd';
import { useTranslation } from 'react-i18next';
import type { IBooking } from '../../../services/types';
import dayjs from 'dayjs';
import BaseModal from '@/shared/components/modals';

interface ChiTietDatPhongModalProps {
  open: boolean;
  onClose: () => void;
  booking: IBooking | null;
}

const ChiTietDatPhongModal: React.FC<ChiTietDatPhongModalProps> = ({ open, onClose, booking }) => {
  const { t } = useTranslation('admin');

  return (
    <BaseModal
      title={t('owner.booking_detail.title', 'Chi tiết đặt phòng')}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          {t('owner.booking_detail.close', 'Đóng')}
        </Button>
      ]}
      width={900}
    >
      {booking && (
        <div 
        // style={{ padding: '24px' }}
        >
          <Descriptions title={t('owner.booking_detail.summary', 'Thông tin chung')} bordered column={2}>
            {booking.apartment?.images && booking.apartment.images.length > 0 && (
              <Descriptions.Item label={t('owner.booking_detail.images', 'Hình ảnh căn hộ')} span={2}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', padding: '4px 0' }}>
                  <Image.PreviewGroup>
                    {booking.apartment.images.map((imgUrl, idx) => (
                      <Image
                        key={idx}
                        src={imgUrl}
                        alt={`Apartment image ${idx + 1}`}
                        width={220}
                        height={140}
                        style={{ objectFit: 'cover', borderRadius: '8px', border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                      />
                    ))}
                  </Image.PreviewGroup>
                </div>
              </Descriptions.Item>
            )}
            <Descriptions.Item label={t('owner.booking_detail.booking_id', 'Mã đặt phòng')} span={2}>
              <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{booking.id}</span>
            </Descriptions.Item>
            <Descriptions.Item label={t('owner.booking_detail.property', 'Căn hộ')} span={2}>
              {booking.apartment?.title || `Apt #${booking.apartmentId}`}
            </Descriptions.Item>
            <Descriptions.Item label={t('owner.booking_detail.tenant_id', 'Khách thuê')} span={2}>
              <span style={{ fontFamily: 'monospace' }}>{booking.tenantId}</span>
            </Descriptions.Item>
            <Descriptions.Item label={t('owner.booking_detail.check_in', 'Ngày nhận phòng')}>
              {dayjs(booking.startDate).format('DD/MM/YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label={t('owner.booking_detail.check_out', 'Ngày trả phòng')}>
              {dayjs(booking.endDate).format('DD/MM/YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label={t('owner.booking_detail.guests', 'Số lượng khách')}>
              {booking.guests} {t('owner.booking_detail.guests_unit', 'khách')}
            </Descriptions.Item>
            <Descriptions.Item label={t('owner.booking_detail.nights', 'Số đêm lưu trú')}>
              {dayjs(booking.endDate).diff(dayjs(booking.startDate), 'day')} {t('owner.booking_detail.nights_unit', 'đêm')}
            </Descriptions.Item>
          </Descriptions>

          <Divider style={{ margin: '20px 0' }} />

          <Descriptions title={t('owner.booking_detail.payment_info', 'Chi tiết thanh toán & Trạng thái')} bordered column={2}>
            <Descriptions.Item label={t('owner.booking_detail.status', 'Trạng thái đặt')}>
              {(() => {
                let color = 'default';
                if (booking.status === 'PENDING') color = 'gold';
                if (booking.status === 'CONFIRMED') color = 'blue';
                if (booking.status === 'COMPLETED') color = 'green';
                if (booking.status === 'CANCELLED') color = 'red';
                return <Tag color={color}>{booking.status}</Tag>;
              })()}
            </Descriptions.Item>
            <Descriptions.Item label={t('owner.booking_detail.payment_status', 'Thanh toán')}>
              {(() => {
                let color = 'default';
                if (booking.paymentStatus === 'PAID') color = 'green';
                if (booking.paymentStatus === 'UNPAID') color = 'warning';
                if (booking.paymentStatus === 'FAILED') color = 'red';
                if (booking.paymentStatus === 'REFUNDED') color = 'purple';
                return <Tag color={color}>{booking.paymentStatus}</Tag>;
              })()}
            </Descriptions.Item>
            
            <Descriptions.Item label={t('owner.booking_detail.price_per_night', 'Giá mỗi đêm')}>
              {booking.apartment?.pricePerNight ? `${Number(booking.apartment.pricePerNight).toLocaleString('vi-VN')} ₫` : '—'}
            </Descriptions.Item>
            <Descriptions.Item label={t('owner.booking_detail.cleaning_fee', 'Phí vệ sinh')}>
              {booking.apartment?.cleaningFee ? `${Number(booking.apartment.cleaningFee).toLocaleString('vi-VN')} ₫` : '—'}
            </Descriptions.Item>
            <Descriptions.Item label={t('owner.booking_detail.service_fee', 'Phí dịch vụ')}>
              {booking.apartment?.serviceFee ? `${Number(booking.apartment.serviceFee).toLocaleString('vi-VN')} ₫` : '—'}
            </Descriptions.Item>
            <Descriptions.Item label={t('owner.booking_detail.total_price', 'Tổng cộng')}>
              <strong style={{ color: '#D85A30', fontSize: '1.6rem' }}>
                {Number(booking.totalPrice).toLocaleString('vi-VN')} ₫
              </strong>
            </Descriptions.Item>
          </Descriptions>

          {booking.vnpTransactionId && (
            <>
              <Divider style={{ margin: '20px 0' }} />
              <Descriptions title={t('owner.booking_detail.transaction_info', 'Thông tin giao dịch')} bordered column={1}>
                <Descriptions.Item label={t('owner.booking_detail.vnpay_id', 'Mã giao dịch VNPay')}>
                  <span style={{ fontFamily: 'monospace' }}>{booking.vnpTransactionId}</span>
                </Descriptions.Item>
                {booking.paymentDate && (
                  <Descriptions.Item label={t('owner.booking_detail.payment_date', 'Thời gian thanh toán')}>
                    {dayjs(booking.paymentDate).format('HH:mm DD/MM/YYYY')}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </>
          )}
        </div>
      )}
    </BaseModal>
  );
};

export default ChiTietDatPhongModal;
