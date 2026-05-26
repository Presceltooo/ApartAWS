import React, { useState } from 'react';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher';
import { LOGIN_ROUTE } from '../../constants';
import { useResetPassword } from '../../services/mutation';
import { notification } from 'antd';
import {
  ForgotPageWrapper,
  ForgotHeader,
  ForgotNav,
  ForgotBrand,
  ForgotNavLink,
  ForgotMain,
  ForgotContentGrid,
  ForgotImagePanel,
  ForgotImageCover,
  ForgotImageOverlay,
  ForgotImageText,
  ForgotImageHeading,
  ForgotImageDesc,
  ForgotFormPanel,
  ForgotFormInner,
  ForgotIconBadge,
  ForgotHeading,
  ForgotTitle,
  ForgotDesc,
  ForgotForm,
  ForgotFieldLabel,
  ForgotInputWrapper,
  ForgotInputIcon,
  ForgotEmailInput,
  ForgotSubmitBtn,
  ForgotFooterArea,
  ForgotBackLinkWrapper,
  ForgotBackLink,
  ForgotPageFooter,
  ForgotPageFooterInner,
  ForgotFooterCopy,
  ForgotFooterLinks,
} from '../../styled';

import loginBg from '@/assets/images/login_bg.png';

const RESET_IMAGE = loginBg;

const ResetPassword: React.FC = () => {
  const { t } = useTranslation('auth');
  const search = useSearch({ strict: false });
  const token = (search as any).token || '';
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPending, setIsPending] = useState(false);

  const { mutateAsync: resetPasswordMutate } = useResetPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      notification.error({
        message: t('reset.error', 'Lỗi'),
        description: t('reset.invalid_token', 'Đường dẫn không hợp lệ hoặc đã hết hạn.')
      });
      return;
    }

    if (password !== confirmPassword) {
      notification.error({
        message: t('reset.error', 'Lỗi'),
        description: t('reset.password_mismatch', 'Mật khẩu xác nhận không khớp.')
      });
      return;
    }

    if (password.length < 6) {
      notification.error({
        message: t('reset.error', 'Lỗi'),
        description: t('reset.password_length', 'Mật khẩu phải có ít nhất 6 ký tự.')
      });
      return;
    }

    setIsPending(true);
    
    try {
      await resetPasswordMutate({ token, newPassword: password });
      navigate({ to: LOGIN_ROUTE });
    } catch (error: any) {
      // Error is handled in the mutation hook via notification
    } finally {
      setIsPending(false);
    }
  };

  return (
    <ForgotPageWrapper>
      <ForgotHeader>
        <ForgotNav>
          <ForgotBrand>Domin Tactic</ForgotBrand>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <LanguageSwitcher />
            <Link to={LOGIN_ROUTE}>
              <ForgotNavLink as="span">{t('reset.back_to_login', 'Quay lại Đăng nhập')}</ForgotNavLink>
            </Link>
          </div>
        </ForgotNav>
      </ForgotHeader>

      <ForgotMain>
        <ForgotContentGrid>
          <ForgotImagePanel>
            <ForgotImageCover src={RESET_IMAGE} alt="Luxury living room" />
            <ForgotImageOverlay />
            <ForgotImageText>
              <ForgotImageHeading>{t('reset.heritage_title', 'Mở khóa cánh cửa mới.')}</ForgotImageHeading>
              <ForgotImageDesc>
                {t('reset.heritage_desc', 'Bảo vệ tài khoản của bạn bằng một mật khẩu an toàn và tiếp tục hành trình khám phá.')}
              </ForgotImageDesc>
            </ForgotImageText>
          </ForgotImagePanel>

          <ForgotFormPanel>
            <ForgotFormInner>
              <ForgotHeading>
                <ForgotIconBadge>🔒</ForgotIconBadge>
                <ForgotTitle>{t('reset.title', 'Đặt lại mật khẩu')}</ForgotTitle>
                <ForgotDesc>
                  {t('reset.desc', 'Vui lòng nhập mật khẩu mới cho tài khoản của bạn.')}
                </ForgotDesc>
              </ForgotHeading>

              <ForgotForm onSubmit={handleSubmit}>
                <div>
                  <ForgotFieldLabel htmlFor="new-password">{t('reset.new_password', 'Mật khẩu mới')}</ForgotFieldLabel>
                  <ForgotInputWrapper>
                    <ForgotInputIcon>🔑</ForgotInputIcon>
                    <ForgotEmailInput
                      id="new-password"
                      type="password"
                      required
                      placeholder={t('reset.new_password_placeholder', 'Nhập mật khẩu mới')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </ForgotInputWrapper>
                </div>
                
                <div style={{ marginTop: '1rem' }}>
                  <ForgotFieldLabel htmlFor="confirm-password">{t('reset.confirm_password', 'Xác nhận mật khẩu')}</ForgotFieldLabel>
                  <ForgotInputWrapper>
                    <ForgotInputIcon>🔑</ForgotInputIcon>
                    <ForgotEmailInput
                      id="confirm-password"
                      type="password"
                      required
                      placeholder={t('reset.confirm_password_placeholder', 'Nhập lại mật khẩu')}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </ForgotInputWrapper>
                </div>

                <div>
                  <ForgotSubmitBtn type="submit" disabled={isPending || !token}>
                    {isPending ? (
                      <span>{t('reset.updating', 'Đang cập nhật…')}</span>
                    ) : (
                      <>
                        <span>{t('reset.submit_btn', 'Lưu mật khẩu')}</span>
                        <span>→</span>
                      </>
                    )}
                  </ForgotSubmitBtn>
                </div>
              </ForgotForm>

              <ForgotFooterArea>
                <ForgotBackLinkWrapper>
                  <Link to={LOGIN_ROUTE}>
                    <ForgotBackLink as="span">← {t('reset.back_to_login', 'Quay lại Đăng nhập')}</ForgotBackLink>
                  </Link>
                </ForgotBackLinkWrapper>
              </ForgotFooterArea>
            </ForgotFormInner>
          </ForgotFormPanel>
        </ForgotContentGrid>
      </ForgotMain>

      <ForgotPageFooter>
        <ForgotPageFooterInner>
          <ForgotFooterCopy>© 2024 Domin Tactic Properties</ForgotFooterCopy>
          <ForgotFooterLinks>
            <a href="#">{t('forgot.privacy', 'Bảo mật')}</a>
            <a href="#">{t('forgot.terms', 'Điều khoản')}</a>
          </ForgotFooterLinks>
        </ForgotPageFooterInner>
      </ForgotPageFooter>
    </ForgotPageWrapper>
  );
};

export default ResetPassword;
