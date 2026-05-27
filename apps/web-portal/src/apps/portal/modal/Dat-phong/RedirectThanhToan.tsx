import React from 'react';
import BaseModal from '@/shared/components/modals';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { CreditCardOutlined, CalendarOutlined } from '@ant-design/icons';

interface IRedirectThanhToanProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
}

const RedirectThanhToan: React.FC<IRedirectThanhToanProps> = ({ open, onClose, bookingId }) => {
  const { t } = useTranslation('portal');
  const navigate = useNavigate();

  const handlePayNow = () => {
    onClose();
    navigate({ to: '/bookings/$id', params: { id: bookingId } });
  };

  return (
    <BaseModal
      title={t('redirect_payment_modal.title', 'Đặt phòng thành công!')}
      open={open}
      onCancel={onClose}
      width={500}
      footer={[
        <Button key="later" onClick={onClose} style={{ height: '4rem', padding: '0 2rem' }}>
          {t('redirect_payment_modal.btn_later', 'Để sau')}
        </Button>,
        <Button
          key="pay"
          type="primary"
          icon={<CreditCardOutlined />}
          onClick={handlePayNow}
          style={{ height: '4rem', padding: '0 2.5rem' }}
        >
          {t('redirect_payment_modal.btn_pay_now', 'Thanh toán ngay')}
        </Button>
      ]}
    >
      <div style={{ padding: '24px 32px', textAlign: 'center', color: '#4A1B0C' }}>
        <CalendarOutlined style={{ fontSize: '4.8rem', color: '#D85A30', marginBottom: '16px' }} />
        <p style={{ fontSize: '1.5rem', lineHeight: '1.6', margin: 0 }}>
          {t(
            'redirect_payment_modal.desc',
            'Yêu cầu đặt phòng của bạn đã được ghi nhận. Bạn có muốn chuyển sang trang thanh toán ngay bây giờ để hoàn tất thủ tục?'
          )}
        </p>
      </div>
    </BaseModal>
  );
};

export default RedirectThanhToan;