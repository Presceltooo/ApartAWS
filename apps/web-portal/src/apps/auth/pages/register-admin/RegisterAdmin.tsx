import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ADMIN_LOGIN_ROUTE } from '../../constants';
import { App } from 'antd';
import { useRegister } from '../../services';
import { useRouter } from '@tanstack/react-router';
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

const ADMIN_SECRET_CODE = 'ADMIN@2026';

const RegisterAdmin: React.FC = () => {
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
      notification.error({ message: 'Mã bí mật không chính xác!' });
      return;
    }

    if (form.password !== form.confirm) {
      notification.error({ message: 'Mật khẩu xác nhận không khớp!' });
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
            message: 'Đăng ký Admin thành công!',
            description: 'Vui lòng đăng nhập bằng tài khoản mới.',
          });
          router.navigate({ to: ADMIN_LOGIN_ROUTE });
        },
        onError: (err: any) => {
          notification.error({
            message: 'Đăng ký thất bại',
            description: err?.data?.message || err?.message || 'Đã có lỗi xảy ra.',
          });
        },
      }
    );
  };

  return (
    <AdminLoginCard style={{ maxWidth: 500 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <AdminLoginTitle>Đăng ký Quản trị viên</AdminLoginTitle>
        <AdminLoginSubtitle>Tạo tài khoản quản lý hệ thống Domin Tactic</AdminLoginSubtitle>
      </div>

      <form onSubmit={handleSubmit}>
        <AdminFormGroup>
          <div>
            <AdminFieldLabel>Họ và Tên</AdminFieldLabel>
            <AdminTextInput
              type="text"
              placeholder="Nguyễn Văn A"
              value={form.fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('fullName', e.target.value)}
              required
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <AdminFieldLabel>Email Quản trị</AdminFieldLabel>
            <AdminTextInput
              type="email"
              placeholder="admin@example.com"
              value={form.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
              required
            />
          </div>

          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <AdminFieldLabel>Mật khẩu</AdminFieldLabel>
              <AdminTextInput
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('password', e.target.value)}
                required
              />
            </div>
            <div>
              <AdminFieldLabel>Xác nhận</AdminFieldLabel>
              <AdminTextInput
                type="password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('confirm', e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: 24, padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)' }}>
            <AdminFieldLabel style={{ color: '#faad14' }}>Mã bí mật xác thực Admin</AdminFieldLabel>
            <AdminTextInput
              type="password"
              placeholder="Nhập mã bí mật được cấp"
              value={form.secretCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('secretCode', e.target.value)}
              required
              style={{ borderColor: '#faad14' }}
            />
          </div>
        </AdminFormGroup>

        <AdminLoginSubmitBtn type="submit" disabled={isPending} style={{ marginTop: 32 }}>
          {isPending ? 'Đang tạo tài khoản...' : 'Đăng ký quyền Quản trị'}
        </AdminLoginSubmitBtn>
      </form>

      <AdminCardFooter>
        <p>
          Đã có tài khoản?{' '}
          <Link to={ADMIN_LOGIN_ROUTE}>
            <AdminPrimaryLink as="span">Quay lại Đăng nhập</AdminPrimaryLink>
          </Link>
        </p>
      </AdminCardFooter>
    </AdminLoginCard>
  );
};

export default RegisterAdmin;
