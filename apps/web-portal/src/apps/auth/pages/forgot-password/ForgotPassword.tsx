import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { LOGIN_ROUTE } from '../../constants';
import { useForgotPassword } from '../../services/mutation';
import { notification } from 'antd';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher';
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
  ForgotSuccessWrapper,
  ForgotSuccessIcon,
  ForgotSuccessTitle,
  ForgotSuccessDesc,
  ForgotPageFooter,
  ForgotPageFooterInner,
  ForgotFooterCopy,
  ForgotFooterLinks,
} from '../../styled';
import forgotPasswordBg from '@/assets/images/forgot_password_bg.png';

const FORGOT_IMAGE = forgotPasswordBg;

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation('auth');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const { mutateAsync: forgotPasswordMutate } = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    
    try {
      await forgotPasswordMutate({ email });
      setSubmitted(true);
    } catch (error: any) {
      notification.error({
        message: t('forgot.error_title', 'Lỗi gửi yêu cầu'),
        description: error.response?.data?.message || t('forgot.error_desc', 'Không thể gửi email đặt lại mật khẩu'),
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <ForgotPageWrapper>
      {/* Header */}
      <ForgotHeader>
        <ForgotNav>
          <ForgotBrand>Domin Tactic</ForgotBrand>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <LanguageSwitcher />
            <Link to={LOGIN_ROUTE}>
              <ForgotNavLink as="span">{t('forgot.back_to_login', 'Quay lại Đăng nhập')}</ForgotNavLink>
            </Link>
          </div>
        </ForgotNav>
      </ForgotHeader>

      {/* Main */}
      <ForgotMain>
        <ForgotContentGrid>
          {/* Image panel */}
          <ForgotImagePanel>
            <ForgotImageCover src={FORGOT_IMAGE} alt="Luxury living room" />
            <ForgotImageOverlay />
            <ForgotImageText>
              <ForgotImageHeading>{t('forgot.heritage_title', 'Tìm thấy sự bình yên trong từng không gian.')}</ForgotImageHeading>
              <ForgotImageDesc>
                {t('forgot.heritage_desc', 'Bộ sưu tập Heritage tập trung vào tính toàn vẹn kiến trúc và sự ấm áp của một kiệt tác đã được sống.')}
              </ForgotImageDesc>
            </ForgotImageText>
          </ForgotImagePanel>

          {/* Form panel */}
          <ForgotFormPanel>
            <ForgotFormInner>
              {!submitted ? (
                <>
                  <ForgotHeading>
                    <ForgotIconBadge>🔑</ForgotIconBadge>
                    <ForgotTitle>{t('forgot.title', 'Lấy lại quyền truy cập')}</ForgotTitle>
                    <ForgotDesc>
                      {t('forgot.desc', 'Nhập địa chỉ email gắn với tài khoản Domin của bạn. Chúng tôi sẽ gửi một liên kết bảo mật để đặt lại mật khẩu cổng thông tin của bạn.')}
                    </ForgotDesc>
                  </ForgotHeading>

                  <ForgotForm onSubmit={handleSubmit}>
                    <div>
                      <ForgotFieldLabel htmlFor="forgot-email">{t('forgot.email_label', 'Địa chỉ Email')}</ForgotFieldLabel>
                      <ForgotInputWrapper>
                        <ForgotInputIcon>✉️</ForgotInputIcon>
                        <ForgotEmailInput
                          id="forgot-email"
                          type="email"
                          required
                          placeholder={t('forgot.email_placeholder', 'ban@heritage.com')}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </ForgotInputWrapper>
                    </div>

                    <div>
                      <ForgotSubmitBtn type="submit" disabled={isPending}>
                        {isPending ? (
                          <span>{t('forgot.sending', 'Đang gửi…')}</span>
                        ) : (
                          <>
                            <span>{t('forgot.submit_btn', 'Gửi liên kết đặt lại')}</span>
                            <span>→</span>
                          </>
                        )}
                      </ForgotSubmitBtn>
                    </div>
                  </ForgotForm>

                  <ForgotFooterArea>
                    <p>
                      {t('forgot.not_received', 'Không nhận được liên kết? Kiểm tra thư rác hoặc')}{' '}
                      <a href="#">{t('forgot.try_another', 'thử email khác')}</a>.
                    </p>
                    <ForgotBackLinkWrapper>
                      <Link to={LOGIN_ROUTE}>
                        <ForgotBackLink as="span">← {t('forgot.back_to_login', 'Quay lại Đăng nhập')}</ForgotBackLink>
                      </Link>
                    </ForgotBackLinkWrapper>
                  </ForgotFooterArea>
                </>
              ) : (
                <ForgotSuccessWrapper>
                  <ForgotSuccessIcon>✅</ForgotSuccessIcon>
                  <ForgotSuccessTitle>{t('forgot.success_title', 'Đã gửi email!')}</ForgotSuccessTitle>
                  <ForgotSuccessDesc>
                    {t('forgot.success_desc', 'Chúng tôi đã gửi liên kết đặt lại mật khẩu đến {{email}}. Vui lòng kiểm tra hộp thư đến của bạn.', { email })}
                  </ForgotSuccessDesc>
                  <Link to={LOGIN_ROUTE}>
                    <ForgotBackLink as="span">← {t('forgot.back_to_login', 'Quay lại Đăng nhập')}</ForgotBackLink>
                  </Link>
                </ForgotSuccessWrapper>
              )}
            </ForgotFormInner>
          </ForgotFormPanel>
        </ForgotContentGrid>
      </ForgotMain>

      {/* Footer */}
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

export default ForgotPassword;
