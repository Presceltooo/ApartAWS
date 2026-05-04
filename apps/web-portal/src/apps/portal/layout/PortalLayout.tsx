import React from 'react';
import { Outlet, Link, useRouterState } from '@tanstack/react-router';
import { 
  SearchOutlined, 
  UserOutlined, 
  MenuOutlined,
  LogoutOutlined 
} from '@ant-design/icons';
import { Dropdown } from 'antd';
import { useNavigate } from '@tanstack/react-router';
import { useLogout } from '@apps/auth/services/mutation';
import tokenManager from '@shared/utils/tokenManager';
import {
  PortalLayoutWrapper,
  PortalHeaderNav,
  PortalHeaderInner,
  PortalBrandLogo,
  PortalNavLinks,
  PortalNavLink,
  PortalHeaderActions,
  PortalIconButton,
  PortalProfileBtn,
  PortalAuthBtn,
  PortalRegisterBtn,
  PortalMainContent,
  PortalFooterWrapper,
  PortalFooterInner,
  PortalFooterBrand,
  PortalFooterNav,
  PortalFooterCopyright,
} from '../styled';
import { useGetMe } from '@apps/auth/services/query';

const PortalLayout: React.FC = () => {
  const accessToken = tokenManager.getAccessToken();
  const { data: userData } = useGetMe({ enabled: !!accessToken });
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();
  const { mutate: logoutMutate } = useLogout();
  const isLoggedIn = !!tokenManager.getAccessToken();

  return (
    <PortalLayoutWrapper>
      <PortalHeaderNav>
        <PortalHeaderInner>
          <Link to="/">
            <PortalBrandLogo>Aura Heritage</PortalBrandLogo>
          </Link>
          <PortalNavLinks>
            <Link to="/" activeProps={{ className: 'active' }}>
              {({ isActive }) => <PortalNavLink as="div" $active={isActive || currentPath === '/'}>Listings</PortalNavLink>}
            </Link>
            <Link to="/can-ho" activeProps={{ className: 'active' }}>
              {({ isActive }) => <PortalNavLink as="div" $active={isActive}>Apartments</PortalNavLink>}
            </Link>
            <Link to="/bookings" activeProps={{ className: 'active' }}>
              {({ isActive }) => <PortalNavLink as="div" $active={isActive}>Bookings</PortalNavLink>}
            </Link>
            <Link to="/concierge" activeProps={{ className: 'active' }}>
              {({ isActive }) => <PortalNavLink as="div" $active={isActive}>Concierge</PortalNavLink>}
            </Link>
            <Link to="/about" activeProps={{ className: 'active' }}>
              {({ isActive }) => <PortalNavLink as="div" $active={isActive}>About</PortalNavLink>}
            </Link>
          </PortalNavLinks>
          <PortalHeaderActions>
            <PortalIconButton>
              <SearchOutlined />
            </PortalIconButton>
            
            {isLoggedIn ? (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'profile',
                      icon: <UserOutlined />,
                      label: (
                        <Link to="/profile" >
                          Profile
                        </Link>
                      ),
                    },
                    {
                      type: 'divider',
                    },
                    {
                      key: 'logout',
                      danger: true,
                      icon: <LogoutOutlined />,
                      label: 'Logout',
                      onClick: () => {
                        const refreshToken = tokenManager.getRefreshToken();
                        if (refreshToken) logoutMutate({ refreshToken });
                        tokenManager.removeAccessToken();
                        tokenManager.removeRefreshToken();
                        navigate({ to: '/' });
                      },
                    },
                  ],
                }}
                trigger={['click']}
              >
                <span style={{ cursor: 'pointer' }}>
                  <PortalProfileBtn>
                    <UserOutlined />
                    <span className="hidden md:inline">{userData?.data.fullName}</span>
                  </PortalProfileBtn>
                </span>
              </Dropdown>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link to="/dang-nhap">
                  <PortalAuthBtn>Đăng nhập</PortalAuthBtn>
                </Link>
                <Link to="/dang-ky">
                  <PortalRegisterBtn>Đăng ký</PortalRegisterBtn>
                </Link>
              </div>
            )}
            {/* Mobile menu button */}
            <PortalIconButton className="md:hidden" style={{ display: 'none' }}>
              <MenuOutlined />
            </PortalIconButton>
          </PortalHeaderActions>
        </PortalHeaderInner>
      </PortalHeaderNav>

      <PortalMainContent>
        <Outlet />
      </PortalMainContent>

      <PortalFooterWrapper>
        <PortalFooterInner>
          <PortalFooterBrand>Aura Heritage</PortalFooterBrand>
          <PortalFooterNav>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Architecture</a>
            <a href="#">Press</a>
          </PortalFooterNav>
          <PortalFooterCopyright>
            © 2024 Aura Heritage Sanctuary. Editorial Living.
          </PortalFooterCopyright>
        </PortalFooterInner>
      </PortalFooterWrapper>
    </PortalLayoutWrapper>
  );
};

export default PortalLayout;
