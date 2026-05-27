import React from 'react';
import BaseModal from '@/shared/components/modals';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

interface IChinhSachBaoMatProps {
  open: boolean;
  onClose: () => void;
}

const ChinhSachBaoMat: React.FC<IChinhSachBaoMatProps> = ({ open, onClose }) => {
  const { t } = useTranslation('auth');

  return (
    <BaseModal
      title={t('privacy_modal.title', 'Chính sách bảo mật')}
      open={open}
      onCancel={onClose}
      width={700}
      footer={[
        <Button key="close" type="primary" onClick={onClose} style={{ height: '4rem', padding: '0 2.5rem' }}>
          {t('privacy_modal.understand', 'Tôi đã hiểu')}
        </Button>
      ]}
    >
      <div style={{ fontSize: '1.4rem', lineHeight: '1.6', color: '#4A1B0C' }}>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '12px' }}>
          {t('privacy_modal.sec1_title', '1. Thu thập thông tin cá nhân')}
        </h3>
        <p style={{ marginBottom: '16px' }}>
          {t('privacy_modal.sec1_desc', 'Khi đăng ký tài khoản tại Domin Tactic (ApartAWS), chúng tôi sẽ thu thập một số thông tin cá nhân của bạn bao gồm: Họ tên, địa chỉ email, số điện thoại, và thông tin giao dịch cần thiết khác để cung cấp dịch vụ.')}
        </p>

        <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '12px' }}>
          {t('privacy_modal.sec2_title', '2. Sử dụng thông tin cá nhân')}
        </h3>
        <p style={{ marginBottom: '16px' }}>
          {t('privacy_modal.sec2_desc_intro', 'Thông tin cá nhân của bạn được thu thập nhằm mục đích:')}<br />
          - {t('privacy_modal.sec2_desc_1', 'Xác thực tài khoản và xử lý các yêu cầu đặt phòng.')}<br />
          - {t('privacy_modal.sec2_desc_2', 'Gửi các thông báo liên quan đến trạng thái giao dịch và hỗ trợ khách hàng.')}<br />
          - {t('privacy_modal.sec2_desc_3', 'Cải thiện chất lượng dịch vụ và nâng cao trải nghiệm người dùng.')}<br />
          - {t('privacy_modal.sec2_desc_4', 'Gửi các thông tin khuyến mãi hoặc cập nhật quan trọng (nếu bạn đồng ý nhận).')}
        </p>

        <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '12px' }}>
          {t('privacy_modal.sec3_title', '3. Bảo mật thông tin')}
        </h3>
        <p style={{ marginBottom: '16px' }}>
          {t('privacy_modal.sec3_desc', 'Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo vệ dữ liệu cá nhân của bạn khỏi các hành vi truy cập trái phép, mất mát hoặc tiết lộ không mong muốn. Mật khẩu tài khoản của bạn được mã hóa an toàn trên hệ thống.')}
        </p>

        <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '12px' }}>
          {t('privacy_modal.sec4_title', '4. Chia sẻ thông tin với bên thứ ba')}
        </h3>
        <p style={{ marginBottom: '16px' }}>
          {t('privacy_modal.sec4_desc_intro', 'Chúng tôi cam kết không bán, trao đổi thông tin cá nhân của bạn cho bên thứ ba. Tuy nhiên, thông tin có thể được chia sẻ trong các trường hợp:')}<br />
          - {t('privacy_modal.sec4_desc_1', 'Chia sẻ thông tin liên lạc cần thiết với chủ căn hộ để thực hiện việc đặt phòng.')}<br />
          - {t('privacy_modal.sec4_desc_2', 'Khi có yêu cầu hợp pháp từ các cơ quan chức năng có thẩm quyền.')}
        </p>

        <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '12px' }}>
          {t('privacy_modal.sec5_title', '5. Quyền lợi của người dùng')}
        </h3>
        <p style={{ marginBottom: '16px' }}>
          {t('privacy_modal.sec5_desc', 'Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân của mình bất kỳ lúc nào thông qua phần cài đặt tài khoản cá nhân hoặc liên hệ trực tiếp với bộ phận hỗ trợ khách hàng của chúng tôi.')}
        </p>
      </div>
    </BaseModal>
  );
};

export default ChinhSachBaoMat;