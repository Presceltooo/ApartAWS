import React from 'react';
import { Outlet } from '@tanstack/react-router';
import { AdminLoginMain, AuthWrapper } from '../styled';

// Layout dành cho Admin - nền tối chuyên nghiệp
const AuthAdminLayout: React.FC = () => {
  return (
    <AdminLoginMain>
      <AuthWrapper>
        <Outlet />
      </AuthWrapper>
    </AdminLoginMain>
  );
};

export default AuthAdminLayout;
