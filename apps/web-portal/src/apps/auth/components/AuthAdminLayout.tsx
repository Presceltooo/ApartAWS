import React from 'react';
import { Outlet } from '@tanstack/react-router';
import { AuthContainer, AuthWrapper } from '../styled';

// Layout dành cho Admin - nền tối với ảnh background
const AuthAdminLayout: React.FC = () => {
  return (
    <AuthContainer>
      <AuthWrapper>
        <Outlet />
      </AuthWrapper>
    </AuthContainer>
  );
};

export default AuthAdminLayout;
