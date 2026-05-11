import React, { useState } from 'react';
import { Table, Select, Input } from 'antd';
import { useSystemBookings } from '../../../services/query';
import { useUpdateSystemBookingStatus } from '../../../services/mutation';
import dayjs from 'dayjs';

const SystemBookings: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSystemBookings({ Keyword: keyword, Page: page, PageSize: 10 });
  const { mutate: updateStatus } = useUpdateSystemBookingStatus();

  const handleStatusChange = (id: string, status: string) => {
    updateStatus({ id, status });
  };

  const columns = [
    { 
      title: 'Căn hộ', 
      key: 'apartment',
      render: (_: any, record: any) => record.apartment?.title || record.apartmentId
    },
    { 
      title: 'Ngày nhận', 
      dataIndex: 'startDate', 
      key: 'start',
      render: (d: string) => dayjs(d).format('DD/MM/YYYY')
    },
    { 
      title: 'Ngày trả', 
      dataIndex: 'endDate', 
      key: 'end',
      render: (d: string) => dayjs(d).format('DD/MM/YYYY')
    },
    { 
      title: 'Tổng tiền', 
      dataIndex: 'totalPrice', 
      key: 'total',
      render: (p: number) => `$${p}`
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: any) => (
        <Select
          value={record.status}
          onChange={(val) => handleStatusChange(record.id, val)}
          style={{ width: 120 }}
          options={[
            { value: 'PENDING', label: 'Chờ duyệt' },
            { value: 'CONFIRMED', label: 'Đã xác nhận' },
            { value: 'CANCELLED', label: 'Đã hủy' },
            { value: 'COMPLETED', label: 'Hoàn thành' },
          ]}
        />
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý Đặt phòng (Toàn hệ thống)</h2>
      <Input.Search
        placeholder="Tìm kiếm..."
        onSearch={(val) => { setKeyword(val); setPage(1); }}
        style={{ width: 300, marginBottom: 20 }}
      />
      <Table
        dataSource={data?.data || []}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page,
          total: data?.metaData?.total || 0,
          onChange: (p) => setPage(p),
        }}
      />
    </div>
  );
};

export default SystemBookings;
