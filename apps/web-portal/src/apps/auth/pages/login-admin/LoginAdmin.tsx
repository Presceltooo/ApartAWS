import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ADMIN_REGISTER_ROUTE } from '../../constants';
import { useHandleLogin } from '../../hooks/useHandleLogin';
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
} from '../../styled';

const LoginAdmin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, isPending } = useHandleLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin({ email, password });
  };

  return (
    <AdminLoginCard>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <AdminLoginTitle>Hệ Thống Quản Trị</AdminLoginTitle>
        <AdminLoginSubtitle>Vui lòng đăng nhập để quản lý hệ thống Domin Tactic</AdminLoginSubtitle>
      </div>

      <form onSubmit={handleSubmit}>
        <AdminFormGroup>
          <div>
            <AdminFieldLabel>Email Quản trị</AdminFieldLabel>
            <AdminTextInput
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginTop: 20 }}>
            <AdminFieldLabel>Mật khẩu</AdminFieldLabel>
            <AdminTextInput
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />
          </div>
        </AdminFormGroup>

        <AdminLoginSubmitBtn type="submit" disabled={isPending} style={{ marginTop: 32 }}>
          {isPending ? 'Đang xác thực...' : 'Đăng nhập hệ thống'}
        </AdminLoginSubmitBtn>
      </form>

      <AdminCardFooter>
        <p>
          Chưa có tài khoản quản trị?{' '}
          <Link to={ADMIN_REGISTER_ROUTE}>
            <AdminPrimaryLink as="span">Đăng ký ngay</AdminPrimaryLink>
          </Link>
        </p>
      </AdminCardFooter>
    </AdminLoginCard>
  );
};

export default LoginAdmin;
