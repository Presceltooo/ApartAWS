import React, { useEffect } from 'react';
import { Outlet, Link, useRouterState, useNavigate } from '@tanstack/react-router';
import { Layout, Menu, Button } from 'antd';
import {
  PlusCircleOutlined,
  LogoutOutlined,
  HomeOutlined,
  DashboardOutlined,
  TeamOutlined,
  BuildOutlined,
  CalendarOutlined,
  ScheduleOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher';
import { useLogout } from '@apps/auth/services/mutation';
import { useGetMe } from '@apps/auth/services/query';
import tokenManager from '@shared/utils/tokenManager';
import { useQueryClient } from '@tanstack/react-query';

const { Header, Sider, Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background-color: #f6f3ee;
`;

const StyledHeader = styled(Header)`
  background: linear-gradient(135deg, #fcf9f4 0%, #f6f3ee 100%);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(224, 192, 182, 0.15);
  box-shadow: 0 4px 20px rgba(88, 66, 59, 0.04);
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 6.4rem;
  line-height: 6.4rem;
  z-index: 10;
`;

const HeaderTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #a5360d;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.02em;

  .anticon {
    font-size: 1.75rem;
    color: #D85A30;
  }
`;

const StyledSider = styled(Sider)`
  background: rgba(252, 249, 244, 0.85) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-right: none;
  box-shadow: 4px 0 20px rgba(88, 66, 59, 0.03);
  transition: all 0.2s !important;
  
  .ant-layout-sider-children {
    background: transparent !important;
    display: flex;
    flex-direction: column;
  }

  .ant-menu {
    background: transparent !important;
    border-right: none !important;
    flex: 1;
  }

  .ant-menu-item {
    margin-top: 8px !important;
    margin-bottom: 8px !important;
    border-radius: 8px;
    width: calc(100% - 16px) !important;
    margin-left: 8px !important;
    font-size: 15px;
    height: 48px !important;
    line-height: 48px !important;
    display: flex;
    align-items: center;
    transition: all 0.25s ease;

    &:hover {
      background-color: rgba(216, 90, 48, 0.04) !important;
    }
  }

  .ant-menu-item-selected {
    background-color: rgba(165, 54, 13, 0.08) !important;
    color: #a5360d !important;
    font-weight: 600;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 20%;
      height: 60%;
      width: 4px;
      background-color: #a5360d;
      border-radius: 0 4px 4px 0;
    }
  }
`;

const SiderHeader = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${props => props.$collapsed ? 'center' : 'space-between'};
  padding: 16px;
  border-bottom: 1px solid rgba(224, 192, 182, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  background: rgba(216, 90, 48, 0.02);
  height: 56px;

  &:hover {
    background: rgba(216, 90, 48, 0.05);
  }
`;

const RoleBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #a5360d;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: rgba(165, 54, 13, 0.08);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(165, 54, 13, 0.15);
  white-space: nowrap;
`;

const CollapseIcon = styled.div`
  color: #D85A30;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const AdminLayout: React.FC = () => {
  const { t } = useTranslation('admin');
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [collapsed, setCollapsed] = React.useState(false);

  const { data: userData, isLoading: isUserLoading } = useGetMe();

  const getPortalTitle = () => {
    if (userData?.data?.role === 'ADMIN') {
      return t('header.admin_title', 'Domin Tactic Admin Portal');
    }
    return t('header.owner_title', 'Domin Tactic Owner Portal');
  };

  const menuItems: any[] = [
    {
      key: '/quan-ly/danh-sach-can-ho',
      icon: <HomeOutlined />,
      label: <Link to="/quan-ly/danh-sach-can-ho">{t('sidebar.my_apartments', 'Danh sách căn hộ')}</Link>,
    },
    {
      key: '/quan-ly/bieu-mau-can-ho/tao-moi',
      icon: <PlusCircleOutlined />,
      label: <Link to="/quan-ly/bieu-mau-can-ho/tao-moi">{t('sidebar.add_apartment', 'Thêm căn hộ mới')}</Link>,
    },
    {
      key: '/quan-ly/quan-ly-dat-phong',
      icon: <CalendarOutlined />,
      label: <Link to="/quan-ly/quan-ly-dat-phong">{t('sidebar.my_bookings', 'Quản lý đặt phòng')}</Link>,
    },
  ];

  // If user is ADMIN, prepend the Dashboard menu item
  if (userData?.data?.role === 'ADMIN') {
    menuItems.unshift(
      {
        key: '/quan-ly/tong-quan-he-thong',
        icon: <DashboardOutlined />,
        label: <Link to="/quan-ly/tong-quan-he-thong">{t('sidebar.dashboard', 'Tổng quan hệ thống')}</Link>,
      },
      {
        key: '/quan-ly/quan-ly-nguoi-dung',
        icon: <TeamOutlined />,
        label: <Link to="/quan-ly/quan-ly-nguoi-dung">{t('sidebar.users', 'Quản lý người dùng')}</Link>,
      },
      {
        key: '/quan-ly/quan-ly-tat-ca-can-ho',
        icon: <BuildOutlined />,
        label: <Link to="/quan-ly/quan-ly-tat-ca-can-ho">{t('sidebar.all_apartments', 'Quản lý tất cả căn hộ')}</Link>,
      },
      {
        key: '/quan-ly/quan-ly-tat-ca-dat-phong',
        icon: <ScheduleOutlined />,
        label: <Link to="/quan-ly/quan-ly-tat-ca-dat-phong">{t('sidebar.all_bookings', 'Quản lý tất cả đặt phòng')}</Link>,
      }
    );
  }

  // Tự động redirect khi vào /quan-ly
  useEffect(() => {
    if (!isUserLoading && currentPath === '/quan-ly' && menuItems.length > 0) {
      navigate({ to: menuItems[0].key, replace: true });
    }
  }, [currentPath, menuItems, isUserLoading, navigate]);

  // Determine active menu key based on current path
  const getActiveKey = () => {
    if (currentPath.startsWith('/quan-ly/tong-quan-he-thong')) return '/quan-ly/tong-quan-he-thong';
    if (currentPath.startsWith('/quan-ly/quan-ly-nguoi-dung')) return '/quan-ly/quan-ly-nguoi-dung';
    if (currentPath.startsWith('/quan-ly/quan-ly-tat-ca-can-ho')) return '/quan-ly/quan-ly-tat-ca-can-ho';
    if (currentPath.startsWith('/quan-ly/quan-ly-tat-ca-dat-phong')) return '/quan-ly/quan-ly-tat-ca-dat-phong';
    if (currentPath.startsWith('/quan-ly/bieu-mau-can-ho/tao-moi')) return '/quan-ly/bieu-mau-can-ho/tao-moi';
    if (currentPath.startsWith('/quan-ly/bieu-mau-can-ho/sua')) return '/quan-ly/danh-sach-can-ho';
    if (currentPath.startsWith('/quan-ly/danh-sach-can-ho')) return '/quan-ly/danh-sach-can-ho';
    if (currentPath.startsWith('/quan-ly/quan-ly-dat-phong')) return '/quan-ly/quan-ly-dat-phong';
    return '/quan-ly/danh-sach-can-ho';
  };

  const { mutate: logoutMutate } = useLogout();

  const handleLogout = () => {
    const refreshToken = tokenManager.getRefreshToken();
    if (refreshToken) {
      logoutMutate({ refreshToken });
    }
    tokenManager.removeAccessToken();
    tokenManager.removeRefreshToken();
    queryClient.clear();
    navigate({ to: '/' });
  };

  return (
    <StyledLayout>
      <StyledHeader>
        <HeaderTitle>
          <HomeOutlined />
          {getPortalTitle()}
        </HeaderTitle>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <LanguageSwitcher />
          <Button type="text" onClick={() => navigate({ to: '/' })} style={{ fontSize: '15px' }}>
            {t('header.view_site', 'View Public Site')}
          </Button>
          <Button icon={<LogoutOutlined />} onClick={handleLogout} style={{ fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {t('header.logout', 'Logout')}
          </Button>
        </div>
      </StyledHeader>
      <Layout>
        <StyledSider width={260} collapsible collapsed={collapsed} trigger={null}>
          <SiderHeader $collapsed={collapsed} onClick={() => setCollapsed(!collapsed)}>
            {!collapsed ? (
              <>
                <RoleBadge>
                  <UserOutlined />
                  {userData?.data?.role || 'OWNER'}
                </RoleBadge>
                <CollapseIcon>
                  <MenuFoldOutlined />
                </CollapseIcon>
              </>
            ) : (
              <CollapseIcon>
                <MenuUnfoldOutlined />
              </CollapseIcon>
            )}
          </SiderHeader>
          <Menu
            mode="inline"
            selectedKeys={[getActiveKey()]}
            style={{ height: '100%', borderRight: 0, padding: '16px 0' }}
            items={menuItems}
          />
        </StyledSider>
        <Layout style={{ padding: '32px', backgroundColor: '#f6f3ee' }}>
          <Content style={{ background: '#fcf9f4', padding: '32px 40px', margin: 0, minHeight: 280, borderRadius: '16px', boxShadow: '0 4px 20px rgba(88, 66, 59, 0.04)' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </StyledLayout>
  );
};

export default AdminLayout;
