import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { LOGIN_ROUTE } from '../../constants';
import { useForgotPassword } from '../../services/mutation';
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
  ForgotSuccessWrapper,
  ForgotSuccessIcon,
  ForgotSuccessTitle,
  ForgotSuccessDesc,
  ForgotSuccessHighlight,
  ForgotPageFooter,
  ForgotPageFooterInner,
  ForgotFooterCopy,
  ForgotFooterLinks,
} from '../../styled';

const FORGOT_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCrsy1VNp8fR2hweZxATSAsTs01iv9NE02X2zHHXhWSq-yazLJQm8AGGdGVidelP4ubyqkb6neE1imQj-lMvKOgQ1I9cOeqlQqvACcGD9D3nOwNXvwl7HRz-esb3fWLxWobXtdUNFRnmDSh3QAoO-utgiPNPzZX4z-WxvWEFuGDejx0ltIqIFKF6xDFSkyLyt8T0218qyhGKcF0riPRgJqT1_0S_ZOvx8bBkWN1SpOZ6BqS1it3mNDKYFaeIHf0Ba_KZClFs3FPWG3P';

const ForgotPassword: React.FC = () => {
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
        message: 'Lỗi gửi yêu cầu',
        description: error.response?.data?.message || 'Không thể gửi email đặt lại mật khẩu',
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
          <ForgotBrand>Aura Heritage</ForgotBrand>
          <div>
            <Link to={LOGIN_ROUTE}>
              <ForgotNavLink as="span">Quay lại Đăng nhập</ForgotNavLink>
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
              <ForgotImageHeading>Tìm thấy sự bình yên trong từng không gian.</ForgotImageHeading>
              <ForgotImageDesc>
                Bộ sưu tập Heritage tập trung vào tính toàn vẹn kiến trúc và sự ấm áp của một kiệt tác đã được sống.
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
                    <ForgotTitle>Lấy lại quyền truy cập</ForgotTitle>
                    <ForgotDesc>
                      Nhập địa chỉ email gắn với tài khoản Aura của bạn. Chúng tôi sẽ gửi một liên kết bảo mật để đặt lại mật khẩu cổng thông tin của bạn.
                    </ForgotDesc>
                  </ForgotHeading>

                  <ForgotForm onSubmit={handleSubmit}>
                    <div>
                      <ForgotFieldLabel htmlFor="forgot-email">Địa chỉ Email</ForgotFieldLabel>
                      <ForgotInputWrapper>
                        <ForgotInputIcon>✉️</ForgotInputIcon>
                        <ForgotEmailInput
                          id="forgot-email"
                          type="email"
                          required
                          placeholder="ban@heritage.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </ForgotInputWrapper>
                    </div>

                    <div>
                      <ForgotSubmitBtn type="submit" disabled={isPending}>
                        {isPending ? (
                          <span>Đang gửi…</span>
                        ) : (
                          <>
                            <span>Gửi liên kết đặt lại</span>
                            <span>→</span>
                          </>
                        )}
                      </ForgotSubmitBtn>
                    </div>
                  </ForgotForm>

                  <ForgotFooterArea>
                    <p>
                      Không nhận được liên kết? Kiểm tra thư rác hoặc{' '}
                      <a href="#">thử email khác</a>.
                    </p>
                    <ForgotBackLinkWrapper>
                      <Link to={LOGIN_ROUTE}>
                        <ForgotBackLink as="span">← Quay lại Đăng nhập</ForgotBackLink>
                      </Link>
                    </ForgotBackLinkWrapper>
                  </ForgotFooterArea>
                </>
              ) : (
                <ForgotSuccessWrapper>
                  <ForgotSuccessIcon>✅</ForgotSuccessIcon>
                  <ForgotSuccessTitle>Đã gửi email!</ForgotSuccessTitle>
                  <ForgotSuccessDesc>
                    Chúng tôi đã gửi liên kết đặt lại mật khẩu đến{' '}
                    <ForgotSuccessHighlight>{email}</ForgotSuccessHighlight>.
                    Vui lòng kiểm tra hộp thư đến của bạn.
                  </ForgotSuccessDesc>
                  <Link to={LOGIN_ROUTE}>
                    <ForgotBackLink as="span">← Quay lại Đăng nhập</ForgotBackLink>
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
          <ForgotFooterCopy>© 2024 Aura Heritage Properties</ForgotFooterCopy>
          <ForgotFooterLinks>
            <a href="#">Bảo mật</a>
            <a href="#">Điều khoản</a>
          </ForgotFooterLinks>
        </ForgotPageFooterInner>
      </ForgotPageFooter>
    </ForgotPageWrapper>
  );
};

export default ForgotPassword;
