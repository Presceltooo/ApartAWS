import React, { useEffect } from 'react';
import { Outlet, Link, useRouterState, useNavigate } from '@tanstack/react-router';
import { Layout, Menu, Button } from 'antd';
import {
  AppstoreOutlined,
  CalendarOutlined,
  PlusCircleOutlined,
  LogoutOutlined,
  HomeOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useLogout } from '@apps/auth/services/mutation';
import { useGetMe } from '@apps/auth/services/query';
import tokenManager from '@shared/utils/tokenManager';

const { Header, Sider, Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  z-index: 10;
`;

const HeaderTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledSider = styled(Sider)`
  background: #fff;
  border-right: 1px solid #f0f0f0;
`;

const AdminLayout: React.FC = () => {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();

  const menuItems: any[] = [
    {
      key: '/quan-ly/danh-sach-can-ho',
      icon: <AppstoreOutlined />,
      label: <Link to="/quan-ly/danh-sach-can-ho">Danh sách căn hộ</Link>,
    },
    {
      key: '/quan-ly/bieu-mau-can-ho/tao-moi',
      icon: <PlusCircleOutlined />,
      label: <Link to="/quan-ly/bieu-mau-can-ho/tao-moi">Thêm căn hộ mới</Link>,
    },
    {
      key: '/quan-ly/quan-ly-dat-phong',
      icon: <CalendarOutlined />,
      label: <Link to="/quan-ly/quan-ly-dat-phong">Quản lý đặt phòng</Link>,
    },
  ];

  // If user is ADMIN, prepend the Dashboard menu item
  const { data: userData, isLoading: isUserLoading } = useGetMe();
  if (userData?.data?.role === 'ADMIN') {
    menuItems.unshift(
      {
        key: '/quan-ly/tong-quan-he-thong',
        icon: <AppstoreOutlined />,
        label: <Link to="/quan-ly/tong-quan-he-thong">Tổng quan hệ thống</Link>,
      },
      {
        key: '/quan-ly/quan-ly-nguoi-dung',
        icon: <AppstoreOutlined />,
        label: <Link to="/quan-ly/quan-ly-nguoi-dung">Quản lý người dùng</Link>,
      },
      {
        key: '/quan-ly/quan-ly-tat-ca-can-ho',
        icon: <AppstoreOutlined />,
        label: <Link to="/quan-ly/quan-ly-tat-ca-can-ho">Quản lý tất cả căn hộ</Link>,
      },
      {
        key: '/quan-ly/quan-ly-tat-ca-dat-phong',
        icon: <CalendarOutlined />,
        label: <Link to="/quan-ly/quan-ly-tat-ca-dat-phong">Quản lý tất cả đặt phòng</Link>,
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
    navigate({ to: '/' });
  };

  return (
    <StyledLayout>
      <StyledHeader>
        <HeaderTitle>
          <HomeOutlined />
          ApartAWS Owner Portal
        </HeaderTitle>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Button type="text" onClick={() => navigate({ to: '/' })}>
            View Public Site
          </Button>
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </StyledHeader>
      <Layout>
        <StyledSider width={250}>
          <Menu
            mode="inline"
            selectedKeys={[getActiveKey()]}
            style={{ height: '100%', borderRight: 0, padding: '16px 0' }}
            items={menuItems}
          />
        </StyledSider>
        <Layout style={{ padding: '24px' }}>
          <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280, borderRadius: 8 }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </StyledLayout>
  );
};

export default AdminLayout;
