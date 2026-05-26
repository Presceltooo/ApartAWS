import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ADMIN_LOGIN_ROUTE } from '../../constants';
import { App } from 'antd';
import { useRegister } from '../../services';
import { useRouter } from '@tanstack/react-router';
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

const ADMIN_SECRET_CODE = 'ADMIN@2026';

const RegisterAdmin: React.FC = () => {
  const { t } = useTranslation('auth');
  const { notification } = App.useApp();
  const router = useRouter();
  const { mutate: registerMutate, isPending } = useRegister();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirm: '',
    secretCode: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.secretCode !== ADMIN_SECRET_CODE) {
      notification.error({ message: t('register.invalid_secret_code', 'Mã bí mật không chính xác!') });
      return;
    }

    if (form.password !== form.confirm) {
      notification.error({ message: t('register.password_mismatch', 'Mật khẩu xác nhận không khớp!') });
      return;
    }

    registerMutate(
      {
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        role: 'ADMIN',
      },
      {
        onSuccess: () => {
          notification.success({
            message: t('register.success_msg_admin', 'Đăng ký Admin thành công!'),
            description: t('register.success_desc_admin', 'Vui lòng đăng nhập bằng tài khoản mới.'),
          });
          router.navigate({ to: ADMIN_LOGIN_ROUTE });
        },
        onError: (err: any) => {
          notification.error({
            message: t('register.fail_msg', 'Đăng ký thất bại'),
            description: err?.data?.message || err?.message || 'Đã có lỗi xảy ra.',
          });
        },
      }
    );
  };

  return (
    <>
      {/* Support and Language Switcher */}
      <UserFixedSupportWrapper>
        <LanguageSwitcher />
      </UserFixedSupportWrapper>

      <AdminLoginCard style={{ maxWidth: 500 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <AdminLoginTitle>{t('register.admin_title', 'Đăng ký Quản trị viên')}</AdminLoginTitle>
          <AdminLoginSubtitle>{t('register.admin_subtitle', 'Tạo tài khoản quản lý hệ thống Domin Tactic')}</AdminLoginSubtitle>
        </div>

        <form onSubmit={handleSubmit}>
          <AdminFormGroup>
            <div>
              <AdminFieldLabel>{t('register.full_name', 'Họ và Tên')}</AdminFieldLabel>
              <AdminTextInput
                type="text"
                placeholder={t('register.full_name_placeholder', 'Nguyễn Văn A')}
                value={form.fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('fullName', e.target.value)}
                required
              />
            </div>

            <div style={{ marginTop: 16 }}>
              <AdminFieldLabel>{t('login.admin_email_label', 'Email Quản trị')}</AdminFieldLabel>
              <AdminTextInput
                type="email"
                placeholder={t('login.email_placeholder', 'admin@example.com')}
                value={form.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
                required
              />
            </div>

            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <AdminFieldLabel>{t('register.password', 'Mật khẩu')}</AdminFieldLabel>
                <AdminTextInput
                  type="password"
                  placeholder={t('register.password_placeholder', '••••••••')}
                  value={form.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('password', e.target.value)}
                  required
                />
              </div>
              <div>
                <AdminFieldLabel>{t('register.confirm_password', 'Xác nhận')}</AdminFieldLabel>
                <AdminTextInput
                  type="password"
                  placeholder={t('register.confirm_password_placeholder', '••••••••')}
                  value={form.confirm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('confirm', e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: 24, padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)' }}>
              <AdminFieldLabel style={{ color: '#faad14' }}>{t('register.admin_secret_code', 'Mã bí mật xác thực Admin')}</AdminFieldLabel>
              <AdminTextInput
                type="password"
                placeholder={t('register.admin_secret_code_placeholder', 'Nhập mã bí mật được cấp')}
                value={form.secretCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('secretCode', e.target.value)}
                required
                style={{ borderColor: '#faad14' }}
              />
            </div>
          </AdminFormGroup>

          <AdminLoginSubmitBtn type="submit" disabled={isPending} style={{ marginTop: 32 }}>
            {isPending ? t('register.signing_up', 'Đang xử lý...') : t('register.admin_submit', 'Đăng ký quyền Quản trị')}
          </AdminLoginSubmitBtn>
        </form>

        <AdminCardFooter>
          <p>
            {t('register.admin_has_account', 'Đã có tài khoản? Quay lại đăng nhập')}{' '}
            <Link to={ADMIN_LOGIN_ROUTE}>
              <AdminPrimaryLink as="span">{t('register.login_now', 'Đăng nhập')}</AdminPrimaryLink>
            </Link>
          </p>
        </AdminCardFooter>
      </AdminLoginCard>
    </>
  );
};

export default RegisterAdmin;
