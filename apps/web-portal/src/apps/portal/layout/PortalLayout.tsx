import React from 'react';
import { Outlet, Link, useRouterState } from '@tanstack/react-router';
import { 
  SearchOutlined, 
  UserOutlined, 
  MenuOutlined,
  LogoutOutlined 
} from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
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
  PortalMainContent,
  PortalFooterWrapper,
  PortalFooterInner,
  PortalFooterBrand,
  PortalFooterNav,
  PortalFooterCopyright,
} from '../styled';

const PortalLayout: React.FC = () => {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();
  const { mutate: logoutMutate } = useLogout();

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
            
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'profile',
                    icon: <UserOutlined />,
                    label: 'Profile',
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
                  <span className="hidden md:inline">Profile</span>
                </PortalProfileBtn>
              </span>
            </Dropdown>
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
