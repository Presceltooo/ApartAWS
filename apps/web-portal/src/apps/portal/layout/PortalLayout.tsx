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
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher';
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
  const { t } = useTranslation('common');
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
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none' }}>
            <img src="/logo.png" alt="Domin Tactic Logo" style={{ height: '3.6rem', width: '3.6rem', objectFit: 'contain' }} />
            <PortalBrandLogo>Domin Tactic</PortalBrandLogo>
          </Link>
          <PortalNavLinks>
            <Link to="/" activeProps={{ className: 'active' }}>
              {({ isActive }) => <PortalNavLink as="div" $active={isActive || currentPath === '/'}>{t('nav.home')}</PortalNavLink>}
            </Link>
            <Link to="/can-ho" activeProps={{ className: 'active' }}>
              {({ isActive }) => <PortalNavLink as="div" $active={isActive || currentPath.startsWith('/can-ho') || currentPath.startsWith('/apartment')}>{t('nav.apartments')}</PortalNavLink>}
            </Link>
            <Link to="/bookings" activeProps={{ className: 'active' }}>
              {({ isActive }) => <PortalNavLink as="div" $active={isActive || currentPath.startsWith('/bookings')}>{t('nav.bookings')}</PortalNavLink>}
            </Link>
            <Link to="/concierge" activeProps={{ className: 'active' }}>
              {({ isActive }) => <PortalNavLink as="div" $active={isActive}>{t('nav.services')}</PortalNavLink>}
            </Link>
            <Link to="/about" activeProps={{ className: 'active' }}>
              {({ isActive }) => <PortalNavLink as="div" $active={isActive}>{t('nav.about')}</PortalNavLink>}
            </Link>
          </PortalNavLinks>
          <PortalHeaderActions>
            <PortalIconButton>
              <SearchOutlined />
            </PortalIconButton>
            
            <LanguageSwitcher />
            
            {isLoggedIn ? (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'profile',
                      icon: <UserOutlined />,
                      label: (
                        <Link to="/profile" >
                          {t('nav.profile')}
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
                      label: t('nav.logout'),
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
                  <PortalAuthBtn>{t('nav.login')}</PortalAuthBtn>
                </Link>
                <Link to="/dang-ky">
                  <PortalRegisterBtn>{t('nav.register')}</PortalRegisterBtn>
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
          <PortalFooterBrand style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <img src="/logo.png" alt="Domin Tactic Logo" style={{ height: '3rem', width: '3rem', objectFit: 'contain' }} />
            Domin Tactic
          </PortalFooterBrand>
          <PortalFooterNav>
            <a href="#">{t('footer.privacy')}</a>
            <a href="#">{t('footer.terms')}</a>
            <a href="#">{t('footer.architecture')}</a>
            <a href="#">{t('footer.press')}</a>
          </PortalFooterNav>
          <PortalFooterCopyright>
            {t('footer.copyright')}
          </PortalFooterCopyright>
        </PortalFooterInner>
      </PortalFooterWrapper>
    </PortalLayoutWrapper>
  );
};

export default PortalLayout;
