import React from 'react';
import { Outlet, Link, useRouterState } from '@tanstack/react-router';
import { 
  SearchOutlined, 
  UserOutlined, 
  MenuOutlined 
} from '@ant-design/icons';
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
            <PortalProfileBtn>
              <UserOutlined />
              <span className="hidden md:inline">Profile</span>
            </PortalProfileBtn>
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
