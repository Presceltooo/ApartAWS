import { Button } from 'antd';
import { Link } from '@tanstack/react-router';
import { Content, Wrapper } from './styled';
import { useTranslation } from 'react-i18next';

const NotFound404 = () => {
  const { t } = useTranslation('common');

  return (
    <Wrapper>
      <Content>
        <h2>{t('not_found', 'Xin lỗi, địa chỉ bạn truy cập không tồn tại.')}</h2>
        <Link to="/">
          <Button type="primary">{t('back_to_home', 'Về trang chủ')}</Button>
        </Link>
      </Content>
    </Wrapper>
  );
};

export default NotFound404;
