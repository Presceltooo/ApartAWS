import React, { useState } from 'react';
import { Card, Col, Row, Statistic, Typography, Spin, Alert, Select, Space, Radio, Tag } from 'antd';
import {
  DollarOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Line } from '@ant-design/plots';
import { useOwnerStats, useOwnerBookings } from '../../../services/query';
import dayjs from 'dayjs';
import TableWithPagination from '@/shared/components/tables/table-with-pagination';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const OwnerDashboard: React.FC = () => {
  const { t } = useTranslation('admin');
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number | undefined>(undefined);
  const [chartType, setChartType] = useState<'revenue' | 'bookings'>('revenue');

  // Fetch stats based on year and month filters
  const { data: stats, isLoading: isStatsLoading, isError: isStatsError } = useOwnerStats({
    year,
    month,
  });

  // Fetch recent bookings for the list
  const { data: bookingsData, isLoading: isBookingsLoading } = useOwnerBookings({
    Page: 1,
    PageSize: 5,
  });

  const handleYearChange = (val: number) => {
    setYear(val);
  };

  const handleMonthChange = (val: number | 'all') => {
    setMonth(val === 'all' ? undefined : val);
  };

  if (isStatsLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip={t('owner.dashboard.loading_stats', 'Đang tải dữ liệu báo cáo...')} />
      </div>
    );
  }

  if (isStatsError) {
    return (
      <Alert
        message={t('owner.dashboard.load_error', 'Lỗi tải dữ liệu')}
        description={t('owner.dashboard.load_error_desc', 'Không thể tải dữ liệu thống kê doanh thu cho chủ nhà. Vui lòng kiểm tra kết nối hoặc thử lại sau.')}
        type="error"
        showIcon
      />
    );
  }

  // Format currency helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val);
  };

  // Line Chart configurations
  const chartConfig = {
    data: stats?.chartData || [],
    xField: 'label',
    yField: chartType === 'revenue' ? 'revenue' : 'bookings',
    style: {
      stroke: '#a5360d',
      lineWidth: 3,
    },
    point: {
      size: 4,
      style: {
        fill: '#fff',
        stroke: '#a5360d',
        lineWidth: 2,
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: chartType === 'revenue' 
            ? t('owner.dashboard.chart_revenue', 'Doanh thu') 
            : t('owner.dashboard.chart_bookings', 'Lượt đặt'),
          value: chartType === 'revenue' 
            ? formatCurrency(datum.revenue) 
            : `${datum.bookings} ${t('owner.dashboard.chart_bookings', 'lượt')}`,
        };
      },
    },
  };

  // Table Columns for recent bookings
  const tableColumns = [
    {
      title: t('owner.dashboard.booking_id', 'Mã đặt phòng'),
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <Text copyable={{ text }}>{text.slice(0, 8)}...</Text>,
    },
    {
      title: t('owner.dashboard.apartment', 'Căn hộ'),
      dataIndex: ['apartment', 'title'],
      key: 'apartmentTitle',
      render: (text: string) => <span style={{ fontWeight: 600 }}>{text || 'Căn hộ đã bị xóa'}</span>,
    },
    {
      title: t('owner.dashboard.check_in', 'Ngày nhận'),
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: t('owner.dashboard.check_out', 'Ngày trả'),
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: t('owner.dashboard.total_price', 'Tổng tiền'),
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      align: 'right' as const,
      render: (price: number) => (
        <span style={{ color: '#a5360d', fontWeight: 'bold' }}>{formatCurrency(price)}</span>
      ),
    },
    {
      title: t('owner.dashboard.status', 'Trạng thái'),
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      render: (status: string) => {
        let color = 'default';
        let label = status;
        if (status === 'PENDING') {
          color = 'warning';
          label = t('owner.dashboard.status_pending', 'Chờ xác nhận');
        } else if (status === 'CONFIRMED') {
          color = 'processing';
          label = t('owner.dashboard.status_confirmed', 'Đã xác nhận');
        } else if (status === 'COMPLETED') {
          color = 'success';
          label = t('owner.dashboard.status_completed', 'Hoàn thành');
        } else if (status === 'CANCELLED') {
          color = 'error';
          label = t('owner.dashboard.status_cancelled', 'Đã hủy');
        }
        return <Tag color={color}>{label}</Tag>;
      },
    },
  ];

  // Year options (last 3 years)
  const yearOptions = [
    { value: currentYear, label: t('owner.dashboard.year', { year: currentYear }) },
    { value: currentYear - 1, label: t('owner.dashboard.year', { year: currentYear - 1 }) },
    { value: currentYear - 2, label: t('owner.dashboard.year', { year: currentYear - 2 }) },
  ];

  // Month options
  const monthOptions = [
    { value: 'all', label: t('owner.dashboard.all_months', 'Tất cả các tháng') },
    ...Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      label: t('owner.dashboard.month', { month: i + 1 }),
    })),
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title & Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Title level={2} style={{ margin: 0, color: '#a5360d' }}>
            {t('owner.dashboard.title', 'Tổng quan doanh thu & đặt phòng')}
          </Title>
          <Text type="secondary">
            {t('owner.dashboard.subtitle', 'Báo cáo chi tiết hiệu suất kinh doanh căn hộ của bạn')}
          </Text>
        </div>
        
        <Space size="middle">
          <Select
            options={yearOptions}
            value={year}
            onChange={handleYearChange}
            style={{ width: 140 }}
          />
          <Select
            options={monthOptions}
            value={month || 'all'}
            onChange={handleMonthChange}
            style={{ width: 160 }}
          />
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false} style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <Statistic
              title={t('owner.dashboard.total_revenue', 'Tổng doanh thu')}
              value={stats?.totalRevenue || 0}
              formatter={(value) => (
                <span style={{ color: '#a5360d', fontWeight: 'bold' }}>
                  {formatCurrency(Number(value))}
                </span>
              )}
              prefix={<DollarOutlined style={{ color: '#a5360d', marginRight: '8px' }} />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false} style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <Statistic
              title={t('owner.dashboard.total_bookings', 'Tổng lượt đặt phòng')}
              value={stats?.totalBookings || 0}
              valueStyle={{ color: '#2b2b2b', fontWeight: 'bold' }}
              prefix={<CalendarOutlined style={{ color: '#1890ff', marginRight: '8px' }} />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false} style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <Statistic
              title={t('owner.dashboard.successful_bookings', 'Đơn thành công')}
              value={(stats?.completedBookings || 0) + (stats?.confirmedBookings || 0)}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card bordered={false} style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <Statistic
              title={t('owner.dashboard.pending_bookings', 'Đang chờ duyệt')}
              value={stats?.pendingBookings || 0}
              valueStyle={{ color: '#faad14', fontWeight: 'bold' }}
              prefix={<ClockCircleOutlined style={{ color: '#faad14', marginRight: '8px' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Chart Section */}
      <Card
        bordered={false}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span>{t('owner.dashboard.trend_chart', 'Biểu đồ xu hướng')}</span>
            <Radio.Group
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              buttonStyle="solid"
              size="small"
            >
              <Radio.Button value="revenue">{t('owner.dashboard.chart_revenue', 'Doanh thu')}</Radio.Button>
              <Radio.Button value="bookings">{t('owner.dashboard.chart_bookings', 'Lượt đặt phòng')}</Radio.Button>
            </Radio.Group>
          </div>
        }
        style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(88, 66, 59, 0.03)' }}
      >
        {stats?.chartData && stats.chartData.length > 0 ? (
          <div style={{ height: 350 }}>
            <Line {...chartConfig} />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px 0', color: '#8c8c8c' }}>
            {t('owner.dashboard.no_data', 'Không có dữ liệu trong khoảng thời gian được chọn')}
          </div>
        )}
      </Card>

      {/* Recent Bookings Table */}
      <Card
        bordered={false}
        title={t('owner.dashboard.recent_bookings', 'Đơn đặt phòng gần đây')}
        style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(88, 66, 59, 0.03)' }}
      >
        <TableWithPagination
          dataSource={bookingsData?.data || []}
          columns={tableColumns}
          rowKey="id"
          pagination={false}
          loading={isBookingsLoading}
          locale={{ emptyText: t('owner.dashboard.empty_bookings', 'Chưa có đơn đặt phòng nào') }}
        />
      </Card>
    </div>
  );
};

export default OwnerDashboard;
