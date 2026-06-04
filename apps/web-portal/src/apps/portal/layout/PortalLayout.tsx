import React, { useState } from 'react';
import { Outlet, Link, useRouterState } from '@tanstack/react-router';
import { 
  SearchOutlined, 
  UserOutlined, 
  MenuOutlined,
  LogoutOutlined 
} from '@ant-design/icons';
import { Dropdown, Drawer, Button } from 'antd';
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
  DesktopOnlyActions,
  MobileMenuButton,
  portalTheme,
} from '../styled';
import { useGetMe } from '@apps/auth/services/query';
import { useQueryClient } from '@tanstack/react-query';

const PortalLayout: React.FC = () => {
  const { t } = useTranslation('common');
  const queryClient = useQueryClient();
  const accessToken = tokenManager.getAccessToken();
  const { data: userData } = useGetMe({ enabled: !!accessToken });
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();
  const { mutate: logoutMutate } = useLogout();
  const isLoggedIn = !!tokenManager.getAccessToken();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                        queryClient.clear();
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
              <DesktopOnlyActions>
                <Link to="/dang-nhap">
                  <PortalAuthBtn>{t('nav.login')}</PortalAuthBtn>
                </Link>
                <Link to="/dang-ky">
                  <PortalRegisterBtn>{t('nav.register')}</PortalRegisterBtn>
                </Link>
              </DesktopOnlyActions>
            )}
            {/* Mobile menu button */}
            <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)}>
              <MenuOutlined />
            </MobileMenuButton>
          </PortalHeaderActions>
        </PortalHeaderInner>
      </PortalHeaderNav>

      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <img src="/logo.png" alt="Domin Tactic Logo" style={{ height: '3.2rem', width: '3.2rem', objectFit: 'contain' }} />
            <span style={{ fontSize: '1.8rem', fontWeight: 700, color: portalTheme.colors.primary }}>Domin Tactic</span>
          </div>
        }
        placement="right"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        width={280}
        styles={{
          body: {
            padding: '24px',
            backgroundColor: portalTheme.colors.surface,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <div style={{ 
                fontSize: '1.6rem', 
                fontWeight: 600, 
                color: currentPath === '/' ? portalTheme.colors.primary : portalTheme.colors.onSurface,
                padding: '10px 0',
                borderBottom: `1px solid ${portalTheme.colors.outlineVariant}`
              }}>
                {t('nav.home')}
              </div>
            </Link>
            <Link to="/can-ho" onClick={() => setIsMobileMenuOpen(false)}>
              <div style={{ 
                fontSize: '1.6rem', 
                fontWeight: 600, 
                color: (currentPath.startsWith('/can-ho') || currentPath.startsWith('/apartment')) ? portalTheme.colors.primary : portalTheme.colors.onSurface,
                padding: '10px 0',
                borderBottom: `1px solid ${portalTheme.colors.outlineVariant}`
              }}>
                {t('nav.apartments')}
              </div>
            </Link>
            <Link to="/bookings" onClick={() => setIsMobileMenuOpen(false)}>
              <div style={{ 
                fontSize: '1.6rem', 
                fontWeight: 600, 
                color: currentPath.startsWith('/bookings') ? portalTheme.colors.primary : portalTheme.colors.onSurface,
                padding: '10px 0',
                borderBottom: `1px solid ${portalTheme.colors.outlineVariant}`
              }}>
                {t('nav.bookings')}
              </div>
            </Link>
            <Link to="/concierge" onClick={() => setIsMobileMenuOpen(false)}>
              <div style={{ 
                fontSize: '1.6rem', 
                fontWeight: 600, 
                color: currentPath === '/concierge' ? portalTheme.colors.primary : portalTheme.colors.onSurface,
                padding: '10px 0',
                borderBottom: `1px solid ${portalTheme.colors.outlineVariant}`
              }}>
                {t('nav.services')}
              </div>
            </Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
              <div style={{ 
                fontSize: '1.6rem', 
                fontWeight: 600, 
                color: currentPath === '/about' ? portalTheme.colors.primary : portalTheme.colors.onSurface,
                padding: '10px 0',
                borderBottom: `1px solid ${portalTheme.colors.outlineVariant}`
              }}>
                {t('nav.about')}
              </div>
            </Link>
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
          {isLoggedIn ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0' }}>
                <UserOutlined style={{ fontSize: '1.8rem', color: portalTheme.colors.primary }} />
                <span style={{ fontSize: '1.6rem', fontWeight: 600 }}>{userData?.data.fullName}</span>
              </div>
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                <Button type="default" style={{ width: '100%', height: '45px', borderRadius: '8px', fontSize: '1.5rem', fontWeight: 600 }}>
                  {t('nav.profile')}
                </Button>
              </Link>
              <Button 
                danger 
                type="primary" 
                style={{ width: '100%', height: '45px', borderRadius: '8px', fontSize: '1.5rem', fontWeight: 600 }}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  const refreshToken = tokenManager.getRefreshToken();
                  if (refreshToken) logoutMutate({ refreshToken });
                  tokenManager.removeAccessToken();
                  tokenManager.removeRefreshToken();
                  queryClient.clear();
                  navigate({ to: '/' });
                }}
              >
                {t('nav.logout')}
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/dang-nhap" onClick={() => setIsMobileMenuOpen(false)}>
                <Button type="default" style={{ width: '100%', height: '45px', borderRadius: '8px', fontSize: '1.5rem', fontWeight: 600 }}>
                  {t('nav.login')}
                </Button>
              </Link>
              <Link to="/dang-ky" onClick={() => setIsMobileMenuOpen(false)}>
                <Button type="primary" style={{ width: '100%', height: '45px', borderRadius: '8px', fontSize: '1.5rem', fontWeight: 600, backgroundColor: portalTheme.colors.primary, borderColor: portalTheme.colors.primary }}>
                  {t('nav.register')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Drawer>

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
