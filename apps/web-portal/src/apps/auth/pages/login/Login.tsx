import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { FORGOT_PASSWORD_ROUTE, REGISTER_ROUTE } from '../../constants';
import { useHandleLogin } from '../../hooks/useHandleLogin';
import {
  UserLoginMain,
  UserLoginBgWrapper,
  UserLoginBgImage,
  UserLoginBgOverlay,
  UserLoginBranding,
  UserLoginBrandingLabel,
  UserLoginBrandingTitle,
  UserLoginBrandingDivider,
  UserLoginBrandingDesc,
  UserLoginCardWrapper,
  UserLoginCard,
  UserLoginCardHeader,
  UserLoginCardTitle,
  UserLoginCardSubtitle,
  UserFormGroup,
  UserFieldWrapper,
  UserFieldLabel,
  UserTextInput,
  UserRememberRow,
  UserRememberLabel,
  UserForgotLink,
  UserLoginSubmitBtn,
  UserDividerRow,
  UserDividerLine,
  UserDividerText,
  UserSocialGrid,
  UserSocialBtn,
  UserCardFooter,
  UserPrimaryLink,
  UserLoginQuote,
  UserSupportBtn,
  UserFixedSupportWrapper,
} from '../../styled';
import auraBg from '@/assets/images/aura_bg.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { handleLogin, isPending } = useHandleLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin({ email, password });
  };

  return (
    <UserLoginMain>
      {/* Background */}
      <UserLoginBgWrapper>
        <UserLoginBgImage src={auraBg} alt="Aura Heritage Background" />
        <UserLoginBgOverlay />
      </UserLoginBgWrapper>

      {/* Left Branding */}
      <UserLoginBranding>
        <UserLoginBrandingLabel>Bộ Sưu Tập Heritage</UserLoginBrandingLabel>
        <UserLoginBrandingTitle>
          Aura <br />
          Heritage
        </UserLoginBrandingTitle>
        <UserLoginBrandingDivider />
        <UserLoginBrandingDesc>
          Trải nghiệm không gian sống được chắt lọc và curated. Hành trình về nhà bắt đầu từ đây.
        </UserLoginBrandingDesc>
      </UserLoginBranding>

      {/* Login Card */}
      <UserLoginCardWrapper>
        <UserLoginCard>
          <UserLoginCardHeader>
            <UserLoginCardTitle>Chào mừng trở lại</UserLoginCardTitle>
            <UserLoginCardSubtitle>Vui lòng nhập thông tin để tiếp cận không gian của bạn.</UserLoginCardSubtitle>
          </UserLoginCardHeader>

          <form onSubmit={handleSubmit}>
            <UserFormGroup>
              {/* Email */}
              <UserFieldWrapper>
                <UserFieldLabel>Địa chỉ Email</UserFieldLabel>
                <UserTextInput
                  type="email"
                  placeholder="ten@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </UserFieldWrapper>

              {/* Password */}
              <UserFieldWrapper>
                <UserFieldLabel>Mật khẩu</UserFieldLabel>
                <UserTextInput
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </UserFieldWrapper>
            </UserFormGroup>

            {/* Remember + Forgot */}
            <UserRememberRow>
              <UserRememberLabel>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Ghi nhớ đăng nhập</span>
              </UserRememberLabel>
              <Link to={FORGOT_PASSWORD_ROUTE}>
                <UserForgotLink as="span">Quên mật khẩu?</UserForgotLink>
              </Link>
            </UserRememberRow>

            {/* Submit */}
            <UserLoginSubmitBtn type="submit" disabled={isPending}>
              {isPending ? 'Đang đăng nhập…' : <span>Đăng nhập <span>→</span></span>}
            </UserLoginSubmitBtn>
          </form>

          {/* Divider */}
          <UserDividerRow>
            <UserDividerLine />
            <UserDividerText>hoặc tiếp tục với</UserDividerText>
            <UserDividerLine />
          </UserDividerRow>

          {/* Social login */}
          <UserSocialGrid>
            <UserSocialBtn type="button">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Google</span>
            </UserSocialBtn>
            <UserSocialBtn type="button">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C4.7 17.3 3.8 12.4 6.3 8.15c1.24-2.14 3.4-3.4 5.54-3.37 1.63.03 2.65.7 3.63.7.96 0 2.25-.84 4.15-.65 1.94.18 3.38.88 4.3 2.24-3.9 2.34-3.26 7.4.38 8.86-.77 1.94-1.8 3.87-3.45 5.55-.3.3-.65.6-.8.8zM12.03 4.8c-.22-4.07 3.35-4.52 3.6-4.8.35 3.3-3.1 4.72-3.6 4.8z" />
              </svg>
              <span>Apple</span>
            </UserSocialBtn>
          </UserSocialGrid>

          {/* Footer */}
          <UserCardFooter>
            <p>
              Chưa có tài khoản?{' '}
              <Link to={REGISTER_ROUTE}>
                <UserPrimaryLink as="span">Đăng ký thành viên</UserPrimaryLink>
              </Link>
            </p>
          </UserCardFooter>
        </UserLoginCard>

        <UserLoginQuote>"Kiến trúc là trò chơi của ánh sáng và bóng tối."</UserLoginQuote>
      </UserLoginCardWrapper>

      {/* Support */}
      <UserFixedSupportWrapper>
        <UserSupportBtn type="button">❓ HỖ TRỢ</UserSupportBtn>
      </UserFixedSupportWrapper>
    </UserLoginMain>
  );
};

export default Login;
