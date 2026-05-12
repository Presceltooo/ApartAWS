import React from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Result, Button, Descriptions, Typography } from 'antd';
import styled from 'styled-components';
import { portalTheme } from '../../styled';

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

// Mapping mã lỗi VNPay sang tiếng Việt
const vnpayErrorMap: Record<string, string> = {
  '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
  '09': 'Giao dịch không thành công: Thẻ/Tài khoản chưa đăng ký dịch vụ Internet Banking.',
  '10': 'Giao dịch không thành công: Xác thực thông tin thẻ/tài khoản quá 3 lần.',
  '11': 'Giao dịch không thành công: Đã hết hạn chờ thanh toán.',
  '12': 'Giao dịch không thành công: Thẻ/Tài khoản bị khóa.',
  '13': 'Giao dịch không thành công: Sai mật khẩu OTP.',
  '24': 'Giao dịch bị hủy bỏ.',
  '51': 'Tài khoản không đủ số dư.',
  '65': 'Tài khoản vượt quá hạn mức giao dịch trong ngày.',
  '75': 'Ngân hàng thanh toán đang bảo trì.',
  '79': 'Nhập sai mật khẩu thanh toán quá số lần quy định.',
  '99': 'Lỗi không xác định.',
};

// ─── Component ────────────────────────────────────────────────────────────────

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
  // Đọc query params từ URL
  const search = useSearch({ strict: false }) as PaymentResultSearch;

  const { status, txnRef, amount, transactionId, code } = search;

  if (status === 'success') {
    return (
      <PageWrapper>
        <ResultCard>
          <Result
            status="success"
            title="Thanh toán thành công!"
            subTitle={`Giao dịch của bạn đã được xử lý thành công.`}
            extra={[
              <Button
                type="primary"
                key="bookings"
                onClick={() => navigate({ to: '/bookings' })}
              >
                Xem đặt phòng của tôi
              </Button>,
              <Button key="home" onClick={() => navigate({ to: '/' })}>
                Về trang chủ
              </Button>,
            ]}
          >
            <Descriptions column={1} bordered size="small">
              {transactionId && (
                <Descriptions.Item label="Mã giao dịch VNPay">
                  <Text copyable>{transactionId}</Text>
                </Descriptions.Item>
              )}
              {txnRef && (
                <Descriptions.Item label="Mã đơn hàng">
                  <Text copyable code>{txnRef}</Text>
                </Descriptions.Item>
              )}
              {amount && (
                <Descriptions.Item label="Số tiền">
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

  // Trạng thái thất bại hoặc lỗi
  const errorMessage =
    code ? (vnpayErrorMap[code] ?? `Giao dịch thất bại (mã lỗi: ${code}).`) : 'Đã có lỗi xảy ra trong quá trình thanh toán.';

  return (
    <PageWrapper>
      <ResultCard>
        <Result
          status="error"
          title="Thanh toán không thành công"
          subTitle={errorMessage}
          extra={[
            <Button
              type="primary"
              key="retry"
              onClick={() => navigate({ to: '/bookings' })}
            >
              Quay lại đặt phòng
            </Button>,
            <Button key="home" onClick={() => navigate({ to: '/' })}>
              Về trang chủ
            </Button>,
          ]}
        >
          {txnRef && (
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Mã đơn hàng">
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
