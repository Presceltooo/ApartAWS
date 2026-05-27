import React from 'react';
import BaseModal from '@/shared/components/modals';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

interface IDieuKhoanSuDungProps {
  open: boolean;
  onClose: () => void;
}

const DieuKhoanSuDung: React.FC<IDieuKhoanSuDungProps> = ({ open, onClose }) => {
  const { t } = useTranslation('auth');

  return (
    <BaseModal
      title={t('terms_modal.title', 'Điều khoản sử dụng dịch vụ')}
      open={open}
      onCancel={onClose}
      width={700}
      footer={[
        <Button key="close" type="primary" onClick={onClose} style={{ height: '4rem', padding: '0 2.5rem' }}>
          {t('terms_modal.understand', 'Tôi đã hiểu')}
        </Button>
      ]}
    >
      <div style={{ fontSize: '1.4rem', lineHeight: '1.6', color: '#4A1B0C' }}>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '12px' }}>
          {t('terms_modal.sec1_title', '1. Giới thiệu')}
        </h3>
        <p style={{ marginBottom: '16px' }}>
          {t('terms_modal.sec1_desc', 'Chào mừng bạn đến với Domin Tactic (ApartAWS). Bằng cách đăng ký tài khoản và sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ và chịu sự ràng buộc bởi các điều khoản sử dụng dưới đây.')}
        </p>

        <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '12px' }}>
          {t('terms_modal.sec2_title', '2. Tài khoản người dùng')}
        </h3>
        <p style={{ marginBottom: '16px' }}>
          {t('terms_modal.sec2_desc', 'Khi tạo tài khoản, bạn phải cung cấp thông tin chính xác, đầy đủ và luôn cập nhật thông tin đó. Bạn có trách nhiệm bảo mật mật khẩu của mình và cho bất kỳ hoạt động nào dưới tài khoản của bạn.')}
        </p>

        <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '12px' }}>
          {t('terms_modal.sec3_title', '3. Quy định đặt phòng & dịch vụ')}
        </h3>
        <p style={{ marginBottom: '16px' }}>
          - {t('terms_modal.sec3_desc_1', 'Tất cả các yêu cầu đặt phòng phải tuân thủ quy trình kiểm duyệt và xác nhận của chúng tôi hoặc chủ căn hộ.')}<br />
          - {t('terms_modal.sec3_desc_2', 'Giá hiển thị trên hệ thống là giá cuối cùng và đã bao gồm các loại thuế phí theo quy định.')}<br />
          - {t('terms_modal.sec3_desc_3', 'Việc hủy phòng và hoàn tiền sẽ được áp dụng theo chính sách hủy phòng của từng căn hộ được ghi cụ thể tại thời điểm đặt phòng.')}
        </p>

        <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '12px' }}>
          {t('terms_modal.sec4_title', '4. Hành vi nghiêm cấm')}
        </h3>
        <p style={{ marginBottom: '16px' }}>
          - {t('terms_modal.sec4_desc_1', 'Sử dụng dịch vụ cho bất kỳ mục đích bất hợp pháp nào.')}<br />
          - {t('terms_modal.sec4_desc_2', 'Cung cấp thông tin giả mạo hoặc đăng tải nội dung sai lệch, vi phạm thuần phong mỹ tục.')}<br />
          - {t('terms_modal.sec4_desc_3', 'Can thiệp hoặc phá hoại hệ thống kỹ thuật của Domin Tactic.')}
        </p>

        <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '12px' }}>
          {t('terms_modal.sec5_title', '5. Giới hạn trách nhiệm')}
        </h3>
        <p style={{ marginBottom: '16px' }}>
          {t('terms_modal.sec5_desc', 'Domin Tactic không chịu trách nhiệm cho bất kỳ thiệt hại gián tiếp, ngẫu nhiên hoặc do hậu quả phát sinh từ việc bạn sử dụng hoặc không thể sử dụng dịch vụ của chúng tôi.')}
        </p>
      </div>
    </BaseModal>
  );
};

export default DieuKhoanSuDung;