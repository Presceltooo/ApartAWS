import React from 'react';
import { Card, Col, Row, Statistic, Typography, Spin, Alert } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  CalendarOutlined,
  DollarOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useSystemStats } from '../../services/query';

const { Title } = Typography;

const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading, isError } = useSystemStats();

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        message="Lỗi"
        description="Không thể tải dữ liệu thống kê. Bạn có thể không có quyền truy cập."
        type="error"
        showIcon
      />
    );
  }

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>System Admin Dashboard</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false} style={{ height: '100%' }}>
            <Statistic
              title="Tổng số người dùng"
              value={stats?.auth?.totalUsers || 0}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false} style={{ height: '100%' }}>
            <Statistic
              title="Tổng số Chủ nhà (Owners)"
              value={stats?.auth?.totalOwners || 0}
              prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false} style={{ height: '100%' }}>
            <Statistic
              title="Tổng số Khách (Tenants)"
              value={stats?.auth?.totalTenants || 0}
              prefix={<TeamOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Title level={4} style={{ marginTop: 32, marginBottom: 16 }}>Thống kê Căn hộ</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false} style={{ height: '100%' }}>
            <Statistic
              title="Tổng số Căn hộ"
              value={stats?.apartment?.totalApartments || 0}
              prefix={<HomeOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false} style={{ height: '100%' }}>
            <Statistic
              title="Căn hộ đang hoạt động (Active)"
              value={stats?.apartment?.activeApartments || 0}
              prefix={<HomeOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Title level={4} style={{ marginTop: 32, marginBottom: 16 }}>Thống kê Đặt phòng & Doanh thu</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false} style={{ height: '100%' }}>
            <Statistic
              title="Tổng số Đặt phòng"
              value={stats?.booking?.totalBookings || 0}
              prefix={<CalendarOutlined style={{ color: '#eb2f96' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false} style={{ height: '100%' }}>
            <Statistic
              title="Booking đang chờ xử lý"
              value={stats?.booking?.pendingBookings || 0}
              prefix={<CalendarOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false} style={{ height: '100%' }}>
            <Statistic
              title="Tổng Doanh thu ($)"
              value={stats?.booking?.totalRevenue || 0}
              precision={2}
              prefix={<DollarOutlined style={{ color: '#f5222d' }} />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
