import React from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Result, Button, Descriptions, Typography } from 'antd';
import styled from 'styled-components';
import { portalTheme } from '../../styled';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const PageWrapper = styled.div`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
`;

const ResultCard = styled.div`
  background: ${portalTheme.colors.surfaceContainerLowest};
  border: 1px solid rgba(224, 192, 182, 0.2);
  border-radius: 1rem;
  padding: 3rem 2.5rem;
  max-width: 560px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(74, 27, 12, 0.08);
  text-align: center;
`;

interface PaymentResultSearch {
  status?: 'success' | 'fail' | 'error';
  txnRef?: string;
  amount?: string;
  transactionId?: string;
  code?: string;
  message?: string;
}

const KetQuaThanhToan: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('portal');
  // Đọc query params từ URL
  const search = useSearch({ strict: false }) as PaymentResultSearch;

  const { status, txnRef, amount, transactionId, code } = search;

  if (status === 'success') {
    return (
      <PageWrapper>
        <ResultCard>
          <Result
            status="success"
            title={t('payment_result.success_title', 'Thanh toán thành công!')}
            subTitle={t('payment_result.success_desc', 'Giao dịch của bạn đã được xử lý thành công.')}
            extra={[
              <Button
                type="primary"
                key="bookings"
                onClick={() => navigate({ to: '/bookings' })}
              >
                {t('payment_result.btn_my_bookings', 'Xem đặt phòng của tôi')}
              </Button>,
              <Button key="home" onClick={() => navigate({ to: '/' })}>
                {t('payment_result.btn_home', 'Về trang chủ')}
              </Button>,
            ]}
          >
            <Descriptions column={1} bordered size="small">
              {transactionId && (
                <Descriptions.Item label={t('payment_result.vnpay_tx_id', 'Mã giao dịch VNPay')}>
                  <Text copyable>{transactionId}</Text>
                </Descriptions.Item>
              )}
              {txnRef && (
                <Descriptions.Item label={t('payment_result.order_code', 'Mã đơn hàng')}>
                  <Text copyable code>{txnRef}</Text>
                </Descriptions.Item>
              )}
              {amount && (
                <Descriptions.Item label={t('payment_result.amount', 'Số tiền')}>
                  <Text strong style={{ color: '#52c41a' }}>
                    {Number(amount).toLocaleString('vi-VN')} ₫
                  </Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Result>
        </ResultCard>
      </PageWrapper>
    );
  }

  // Trạng thái thất bại hoặc lỗi: Tự động tra cứu mã lỗi động từ i18n
  const errorMessage = code
    ? t(`payment_result.error_map.${code}`, {
        defaultValue: t('payment_result.err_failed_code', { code, defaultValue: `Giao dịch thất bại (mã lỗi: ${code}).` })
      })
    : t('payment_result.err_unknown', 'Đã có lỗi xảy ra trong quá trình thanh toán.');

  return (
    <PageWrapper>
      <ResultCard>
        <Result
          status="error"
          title={t('payment_result.fail_title', 'Thanh toán không thành công')}
          subTitle={errorMessage}
          extra={[
            <Button
              type="primary"
              key="retry"
              onClick={() => navigate({ to: '/bookings' })}
            >
              {t('payment_result.btn_back_bookings', 'Quay lại đặt phòng')}
            </Button>,
            <Button key="home" onClick={() => navigate({ to: '/' })}>
              {t('payment_result.btn_home', 'Về trang chủ')}
            </Button>,
          ]}
        >
          {txnRef && (
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label={t('payment_result.order_code', 'Mã đơn hàng')}>
                <Text copyable code>{txnRef}</Text>
              </Descriptions.Item>
            </Descriptions>
          )}
        </Result>
      </ResultCard>
    </PageWrapper>
  );
};

export default KetQuaThanhToan;
