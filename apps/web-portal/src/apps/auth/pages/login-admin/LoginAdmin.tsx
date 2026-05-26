import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ADMIN_REGISTER_ROUTE } from '../../constants';
import { useHandleLogin } from '../../hooks/useHandleLogin';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher';
import {
  AdminLoginCard,
  AdminLoginTitle,
  AdminLoginSubtitle,
  AdminFormGroup,
  AdminFieldLabel,
  AdminTextInput,
  AdminLoginSubmitBtn,
  AdminCardFooter,
  AdminPrimaryLink,
  UserFixedSupportWrapper,
} from '../../styled';

const LoginAdmin: React.FC = () => {
  const { t } = useTranslation('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, isPending } = useHandleLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin({ email, password });
  };

  return (
    <>
      {/* Support and Language Switcher */}
      <UserFixedSupportWrapper>
        <LanguageSwitcher />
      </UserFixedSupportWrapper>

      <AdminLoginCard>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <AdminLoginTitle>{t('login.admin_title', 'Hệ Thống Quản Trị')}</AdminLoginTitle>
          <AdminLoginSubtitle>{t('login.admin_subtitle', 'Vui lòng đăng nhập để quản lý hệ thống Domin Tactic')}</AdminLoginSubtitle>
        </div>

        <form onSubmit={handleSubmit}>
          <AdminFormGroup>
            <div>
              <AdminFieldLabel>{t('login.admin_email_label', 'Email Quản trị')}</AdminFieldLabel>
              <AdminTextInput
                type="email"
                placeholder={t('login.email_placeholder', 'admin@example.com')}
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginTop: 20 }}>
              <AdminFieldLabel>{t('login.password', 'Mật khẩu')}</AdminFieldLabel>
              <AdminTextInput
                type="password"
                placeholder={t('login.password_placeholder', '••••••••')}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
            </div>
          </AdminFormGroup>

          <AdminLoginSubmitBtn type="submit" disabled={isPending} style={{ marginTop: 32 }}>
            {isPending ? t('login.admin_logging_in', 'Đang xác thực...') : t('login.admin_submit', 'Đăng nhập hệ thống')}
          </AdminLoginSubmitBtn>
        </form>

        <AdminCardFooter>
          <p>
            {t('login.admin_no_account', 'Chưa có tài khoản quản trị?')}{' '}
            <Link to={ADMIN_REGISTER_ROUTE}>
              <AdminPrimaryLink as="span">{t('login.admin_register_now', 'Đăng ký ngay')}</AdminPrimaryLink>
            </Link>
          </p>
        </AdminCardFooter>
      </AdminLoginCard>
    </>
  );
};

export default LoginAdmin;
