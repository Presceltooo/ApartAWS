import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { LOGIN_ROUTE } from '../../constants';
import { App } from 'antd';
import { useRegister } from '../../services';
import { useRouter } from '@tanstack/react-router';
import useNotification from '../../../../shared/hooks/useNotification';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher';
import registerBg from '@/assets/images/register_bg.png';
import DieuKhoanSuDung from '@/apps/auth/modal/DieuKhoanSuDung';
import ChinhSachBaoMat from '@/apps/auth/modal/ChinhSachBaoMat';
import {
  RegisterMain,
  RegisterImageSection,
  RegisterImageAbsolute,
  RegisterImageCover,
  RegisterImageOverlay,
  RegisterImageContent,
  RegisterGlassCard,
  RegisterGlassBrand,
  RegisterGlassTitle,
  RegisterGlassDesc,
  RegisterFormSection,
  RegisterHeader,
  RegisterLogoRow,
  RegisterLogoText,
  RegisterPageTitle,
  RegisterPageSubtitle,
  RegisterSocialGrid,
  RegisterSocialBtn,
  RegisterDividerRow,
  RegisterDividerLine,
  RegisterDividerText,
  RegisterForm,
  RegisterFieldGroup,
  RegisterPasswordRow,
  RegisterFieldLabel,
  RegisterInputWrapper,
  RegisterTextInput,
  RegisterInputIcon,
  RegisterTermsRow,
  RegisterTermsCheckbox,
  RegisterTermsLabel,
  RegisterSubmitBtn,
  RegisterFooter,
  UserPrimaryLink,
  UserFixedSupportWrapper,
  UserSupportBtn,
} from '../../styled';

// ảnh bên trái panel
const REGISTER_IMAGE = registerBg;

const Register: React.FC = () => {
  const { t } = useTranslation('auth');
  const { showErrorNotify } = useNotification();
  const { notification } = App.useApp();
  const router = useRouter();
  const { mutate: registerMutate, isPending } = useRegister();

  const handleSocialRegister = (provider: string) => {
    showErrorNotify(t('register.social_under_development', `Tính năng đăng ký qua ${provider} đang được phát triển.`, { provider }));
  };

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirm: '',
    phone: '',
    address: '',
    role: 'TENANT',
    agreed: false,
  });

  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreed) {
      notification.warning({ message: t('register.required_terms', 'Bạn cần đồng ý với Điều khoản dịch vụ!') });
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
        phone: form.phone || undefined,
        address: form.address || undefined,
        role: form.role as 'TENANT' | 'OWNER',
      },
      {
        onSuccess: () => {
          notification.success({
            message: t('register.success_msg', 'Đăng ký thành công!'),
            description: t('register.success_desc', 'Tài khoản đã được tạo. Vui lòng đăng nhập.'),
          });
          router.navigate({ to: LOGIN_ROUTE });
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
    <RegisterMain>
      {/* Left image panel */}
      <RegisterImageSection>
        <RegisterImageAbsolute>
          <RegisterImageCover src={REGISTER_IMAGE} alt="Luxury modern architectural villa" />
          <RegisterImageOverlay />
        </RegisterImageAbsolute>
        <RegisterImageContent>
          <RegisterGlassCard>
            <RegisterGlassBrand>Domin Tactic</RegisterGlassBrand>
            <RegisterGlassTitle>{t('register.heritage_title', 'Hành trình đến cuộc sống xuất sắc bắt đầu từ đây.')}</RegisterGlassTitle>
            <RegisterGlassDesc>
              {t('register.heritage_desc', 'Khám phá bộ sưu tập không gian sống được tuyển chọn, tôn vinh lịch sử kiến trúc và hiện đại hóa xa xỉ.')}
            </RegisterGlassDesc>
          </RegisterGlassCard>
        </RegisterImageContent>
      </RegisterImageSection>

      {/* Right form section */}
      <RegisterFormSection>
        {/* Logo + Heading */}
        <RegisterHeader>
          <RegisterLogoRow>
            <span>🏛️</span>
            <RegisterLogoText>Domin Tactic</RegisterLogoText>
          </RegisterLogoRow>
          <RegisterPageTitle>{t('register.title', 'Tạo tài khoản')}</RegisterPageTitle>
          <RegisterPageSubtitle>{t('register.subtitle', 'Gia nhập cộng đồng những người yêu mến kiến trúc.')}</RegisterPageSubtitle>
        </RegisterHeader>

        {/* Social Auth */}
        <RegisterSocialGrid>
          <RegisterSocialBtn type="button" onClick={() => handleSocialRegister('Google')}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </RegisterSocialBtn>
          <RegisterSocialBtn type="button" onClick={() => handleSocialRegister('Apple')}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C4.7 17.3 3.8 12.4 6.3 8.15c1.24-2.14 3.4-3.4 5.54-3.37 1.63.03 2.65.7 3.63.7.96 0 2.25-.84 4.15-.65 1.94.18 3.38.88 4.3 2.24-3.9 2.34-3.26 7.4.38 8.86-.77 1.94-1.8 3.87-3.45 5.55-.3.3-.65.6-.8.8zM12.03 4.8c-.22-4.07 3.35-4.52 3.6-4.8.35 3.3-3.1 4.72-3.6 4.8z" />
            </svg>
            Apple
          </RegisterSocialBtn>
        </RegisterSocialGrid>

        {/* Divider */}
        <RegisterDividerRow>
          <RegisterDividerLine />
          <RegisterDividerText>{t('register.or_email', 'HOẶC ĐĂNG KÝ VỚI EMAIL')}</RegisterDividerText>
          <RegisterDividerLine />
        </RegisterDividerRow>

        {/* Form */}
        <RegisterForm onSubmit={handleSubmit}>
          {/* Full Name */}
          <RegisterFieldGroup>
            <RegisterFieldLabel>{t('register.full_name', 'Họ và Tên')}</RegisterFieldLabel>
            <RegisterInputWrapper>
              <RegisterTextInput
                type="text"
                placeholder={t('register.full_name_placeholder', 'Nguyễn Văn A')}
                value={form.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
              />
              <RegisterInputIcon>👤</RegisterInputIcon>
            </RegisterInputWrapper>
          </RegisterFieldGroup>

          {/* Email */}
          <RegisterFieldGroup>
            <RegisterFieldLabel>{t('register.email', 'Địa chỉ Email')}</RegisterFieldLabel>
            <RegisterInputWrapper>
              <RegisterTextInput
                type="email"
                placeholder={t('register.email_placeholder', 'xin-chao@auraheritage.com')}
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              <RegisterInputIcon>@</RegisterInputIcon>
            </RegisterInputWrapper>
          </RegisterFieldGroup>
          {/* Role Selection */}
          <RegisterFieldGroup>
            <RegisterFieldLabel>{t('register.role_label', 'Bạn đăng ký với tư cách')}</RegisterFieldLabel>
            <RegisterInputWrapper>
              <select
                value={form.role}
                onChange={(e) => handleChange('role', e.target.value)}
                style={{
                  width: '100%',
                  padding: '1.2rem 1.6rem 1.2rem 3.5rem',
                  borderRadius: '0.6rem',
                  border: '1px solid rgba(224, 192, 182, 0.2)',
                  fontSize: '1.5rem',
                  outline: 'none',
                  appearance: 'none',
                  backgroundColor: '#FAEEDA',
                  color: '#4A1B0C',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <option value="TENANT">{t('register.role_tenant', 'Khách thuê (Tenant)')}</option>
                <option value="OWNER">{t('register.role_owner', 'Chủ căn hộ (Owner)')}</option>
              </select>
              <RegisterInputIcon>🎭</RegisterInputIcon>
            </RegisterInputWrapper>
          </RegisterFieldGroup>

          {/* Password */}
          <RegisterPasswordRow>
            <RegisterFieldGroup>
              <RegisterFieldLabel>{t('register.password', 'Mật khẩu')}</RegisterFieldLabel>
              <RegisterTextInput
                type="password"
                placeholder={t('register.password_placeholder', '••••••••')}
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
            </RegisterFieldGroup>
            <RegisterFieldGroup>
              <RegisterFieldLabel>{t('register.confirm_password', 'Xác nhận')}</RegisterFieldLabel>
              <RegisterTextInput
                type="password"
                placeholder={t('register.confirm_password_placeholder', '••••••••')}
                value={form.confirm}
                onChange={(e) => handleChange('confirm', e.target.value)}
              />
            </RegisterFieldGroup>
          </RegisterPasswordRow>

          {/* Terms */}
          <RegisterTermsRow>
            <RegisterTermsCheckbox
              type="checkbox"
              checked={form.agreed}
              onChange={(e) => handleChange('agreed', e.target.checked)}
            />
            <RegisterTermsLabel>
              {t('register.terms_agree_1', 'Tôi đồng ý với ')}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsTermsOpen(true); }}>
                {t('register.terms_link', 'Điều khoản dịch vụ')}
              </a>
              {t('register.terms_agree_2', ' và ')}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsPrivacyOpen(true); }}>
                {t('register.privacy_link', 'Chính sách bảo mật')}
              </a>
              {t('register.terms_agree_3', ' của Domin Tactic.')}
            </RegisterTermsLabel>
          </RegisterTermsRow>

          {/* Submit */}
          <RegisterSubmitBtn type="submit" disabled={isPending}>
            {isPending ? t('register.signing_up', 'Đang xử lý…') : <span>{t('register.title', 'Tạo tài khoản')} <span>→</span></span>}
          </RegisterSubmitBtn>
        </RegisterForm>

        {/* Footer */}
        <RegisterFooter>
          <p>
            {t('register.already_account', 'Đã là thành viên?')}{' '}
            <Link to={LOGIN_ROUTE}>
              <UserPrimaryLink as="span">{t('register.login_now', 'Đăng nhập')}</UserPrimaryLink>
            </Link>
          </p>
        </RegisterFooter>
      </RegisterFormSection>

      {/* Support and Language Switcher */}
      <UserFixedSupportWrapper>
        <LanguageSwitcher />
        <UserSupportBtn type="button">{t('login.support', '❓ HỖ TRỢ')}</UserSupportBtn>
      </UserFixedSupportWrapper>

      <DieuKhoanSuDung open={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <ChinhSachBaoMat open={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </RegisterMain>
  );
};

export default Register;
