import React, { useState } from 'react';
import { Table, Switch, Input } from 'antd';
import { useSystemApartments } from '../../../services/query';
import { useToggleApartmentStatus } from '../../../services/mutation';
import type { IApartment } from '../../../services/types';

const SystemApartments: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSystemApartments({ Keyword: keyword, Page: page, PageSize: 10 });
  const { mutate: toggleStatus } = useToggleApartmentStatus();

  const handleToggle = (id: string, checked: boolean) => {
    toggleStatus({ id, isActive: checked });
  };

  const columns = [
    { title: 'Tên Căn hộ', dataIndex: 'title', key: 'title' },
    { title: 'Vị trí', dataIndex: 'location', key: 'location' },
    { 
      title: 'Giá/đêm', 
      dataIndex: 'pricePerNight', 
      key: 'price',
      render: (price: number) => `$${price}`
    },
    {
      title: 'Trạng thái (Duyệt)',
      key: 'status',
      render: (_: any, record: IApartment) => (
        <Switch 
          checked={record.isActive} 
          onChange={(checked) => handleToggle(record.id, checked)}
          checkedChildren="Đã duyệt"
          unCheckedChildren="Đã ẩn"
        />
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý Căn hộ (Toàn hệ thống)</h2>
      <Input.Search
        placeholder="Tìm kiếm tên căn hộ..."
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

export default SystemApartments;
