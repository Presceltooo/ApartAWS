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
            <PortalBrandLogo>Domin Tactic</PortalBrandLogo>
          </Link>
          <PortalNavLinks>
            <Link to="/" activeProps={{ className: 'active' }}>
              {({ isActive }) => <PortalNavLink as="div" $active={isActive || currentPath === '/'}>Trang chủ</PortalNavLink>}
            </Link>
            <Link to="/can-ho" activeProps={{ className: 'active' }}>
              {({ isActive }) => <PortalNavLink as="div" $active={isActive}>Căn hộ</PortalNavLink>}
            </Link>
            <Link to="/bookings" activeProps={{ className: 'active' }}>
              {({ isActive }) => <PortalNavLink as="div" $active={isActive}>Đã đặt</PortalNavLink>}
            </Link>
            <Link to="/concierge" activeProps={{ className: 'active' }}>
              {({ isActive }) => <PortalNavLink as="div" $active={isActive}>Dịch vụ</PortalNavLink>}
            </Link>
            <Link to="/about" activeProps={{ className: 'active' }}>
              {({ isActive }) => <PortalNavLink as="div" $active={isActive}>Giới thiệu</PortalNavLink>}
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
                          Cá nhân
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
                      label: 'Đăng xuất',
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
          <PortalFooterBrand>Domin Tactic</PortalFooterBrand>
          <PortalFooterNav>
            <a href="#">Bảo mật</a>
            <a href="#">Điều khoản</a>
            <a href="#">Kiến trúc</a>
            <a href="#">Báo chí</a>
          </PortalFooterNav>
          <PortalFooterCopyright>
            © 2024 Domin Tactic Sanctuary. Sống Đẳng Cấp.
          </PortalFooterCopyright>
        </PortalFooterInner>
      </PortalFooterWrapper>
    </PortalLayoutWrapper>
  );
};

export default PortalLayout;
