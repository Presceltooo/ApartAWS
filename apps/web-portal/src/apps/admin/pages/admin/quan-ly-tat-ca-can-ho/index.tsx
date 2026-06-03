import React, { useState } from 'react';
import { Switch, Input } from 'antd';
import TableWithPagination from '@/shared/components/tables/table-with-pagination';
import { useSystemApartments, useSystemAutoApprove } from '../../../services/query';
import { useToggleApartmentStatus, useUpdateSystemAutoApprove } from '../../../services/mutation';
import type { IApartment } from '../../../services/types';

const SystemApartments: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSystemApartments({ Keyword: keyword, Page: page, PageSize: 10 });
  const { mutate: toggleStatus } = useToggleApartmentStatus();

  // Auto-approve settings hooks
  const { data: autoApproveData, isLoading: isLoadingAutoApprove } = useSystemAutoApprove();
  const { mutate: updateAutoApprove, isPending: isUpdatingAutoApprove } = useUpdateSystemAutoApprove();

  const handleToggle = (id: string, checked: boolean) => {
    toggleStatus({ id, isActive: checked });
  };

  const handleAutoApproveChange = (checked: boolean) => {
    updateAutoApprove(checked);
  };

  const columns = [
    { title: 'Tên Căn hộ', dataIndex: 'title', key: 'title' },
    { title: 'Vị trí', dataIndex: 'location', key: 'location' },
    { 
      title: 'Giá/đêm', 
      dataIndex: 'pricePerNight', 
      key: 'price',
      render: (price: number) => `${Number(price).toLocaleString('vi-VN')} ₫`
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 20, 
        gap: 16,
        flexWrap: 'wrap'
      }}>
        <Input.Search
          placeholder="Tìm kiếm tên căn hộ..."
          onSearch={(val) => { setKeyword(val); setPage(1); }}
          style={{ width: 300 }}
        />
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12,
          padding: '6px 16px',
          borderRadius: '8px',
          backgroundColor: '#fff',
          border: '1px solid #d9d9d9',
          boxShadow: '0 2px 0 rgba(0, 0, 0, 0.02)',
          transition: 'all 0.3s'
        }}>
          <span style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.85)', fontWeight: 500 }}>
            Tự động duyệt căn hộ mới
          </span>
          <Switch 
            checked={autoApproveData?.data?.isAutoApprove || false}
            loading={isLoadingAutoApprove || isUpdatingAutoApprove}
            onChange={handleAutoApproveChange}
            checkedChildren="Bật"
            unCheckedChildren="Tắt"
          />
        </div>
      </div>
      <TableWithPagination
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

