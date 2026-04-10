import React from 'react';
import { Outlet } from '@tanstack/react-router';
import styled from 'styled-components';

const UserAuthRoot = styled.div`
  min-height: 100vh;
  background-color: #fcf9f4;
  color: #1c1c19;
  font-family: 'Inter', sans-serif;
`;

const AuthUserLayout: React.FC = () => {
  return (
    <UserAuthRoot>
      <Outlet />
    </UserAuthRoot>
  );
};

export default AuthUserLayout;
