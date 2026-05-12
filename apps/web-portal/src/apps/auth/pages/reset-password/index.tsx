import React, { useState } from 'react';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
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

const RESET_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCrsy1VNp8fR2hweZxATSAsTs01iv9NE02X2zHHXhWSq-yazLJQm8AGGdGVidelP4ubyqkb6neE1imQj-lMvKOgQ1I9cOeqlQqvACcGD9D3nOwNXvwl7HRz-esb3fWLxWobXtdUNFRnmDSh3QAoO-utgiPNPzZX4z-WxvWEFuGDejx0ltIqIFKF6xDFSkyLyt8T0218qyhGKcF0riPRgJqT1_0S_ZOvx8bBkWN1SpOZ6BqS1it3mNDKYFaeIHf0Ba_KZClFs3FPWG3P';

const ResetPassword: React.FC = () => {
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
      notification.error({ message: 'Lỗi', description: 'Đường dẫn không hợp lệ hoặc đã hết hạn.' });
      return;
    }

    if (password !== confirmPassword) {
      notification.error({ message: 'Lỗi', description: 'Mật khẩu xác nhận không khớp.' });
      return;
    }

    if (password.length < 6) {
      notification.error({ message: 'Lỗi', description: 'Mật khẩu phải có ít nhất 6 ký tự.' });
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
          <div>
            <Link to={LOGIN_ROUTE}>
              <ForgotNavLink as="span">Quay lại Đăng nhập</ForgotNavLink>
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
              <ForgotImageHeading>Mở khóa cánh cửa mới.</ForgotImageHeading>
              <ForgotImageDesc>
                Bảo vệ tài khoản của bạn bằng một mật khẩu an toàn và tiếp tục hành trình khám phá.
              </ForgotImageDesc>
            </ForgotImageText>
          </ForgotImagePanel>

          <ForgotFormPanel>
            <ForgotFormInner>
              <ForgotHeading>
                <ForgotIconBadge>🔒</ForgotIconBadge>
                <ForgotTitle>Đặt lại mật khẩu</ForgotTitle>
                <ForgotDesc>
                  Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
                </ForgotDesc>
              </ForgotHeading>

              <ForgotForm onSubmit={handleSubmit}>
                <div>
                  <ForgotFieldLabel htmlFor="new-password">Mật khẩu mới</ForgotFieldLabel>
                  <ForgotInputWrapper>
                    <ForgotInputIcon>🔑</ForgotInputIcon>
                    <ForgotEmailInput
                      id="new-password"
                      type="password"
                      required
                      placeholder="Nhập mật khẩu mới"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </ForgotInputWrapper>
                </div>
                
                <div style={{ marginTop: '1rem' }}>
                  <ForgotFieldLabel htmlFor="confirm-password">Xác nhận mật khẩu</ForgotFieldLabel>
                  <ForgotInputWrapper>
                    <ForgotInputIcon>🔑</ForgotInputIcon>
                    <ForgotEmailInput
                      id="confirm-password"
                      type="password"
                      required
                      placeholder="Nhập lại mật khẩu"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </ForgotInputWrapper>
                </div>

                <div>
                  <ForgotSubmitBtn type="submit" disabled={isPending || !token}>
                    {isPending ? (
                      <span>Đang cập nhật…</span>
                    ) : (
                      <>
                        <span>Lưu mật khẩu</span>
                        <span>→</span>
                      </>
                    )}
                  </ForgotSubmitBtn>
                </div>
              </ForgotForm>

              <ForgotFooterArea>
                <ForgotBackLinkWrapper>
                  <Link to={LOGIN_ROUTE}>
                    <ForgotBackLink as="span">← Quay lại Đăng nhập</ForgotBackLink>
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
            <a href="#">Bảo mật</a>
            <a href="#">Điều khoản</a>
          </ForgotFooterLinks>
        </ForgotPageFooterInner>
      </ForgotPageFooter>
    </ForgotPageWrapper>
  );
};

export default ResetPassword;
