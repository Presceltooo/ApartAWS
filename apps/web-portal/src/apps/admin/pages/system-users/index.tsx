import React, { useState } from 'react';
import { Table, Switch, Input, Tag } from 'antd';
import { useSystemUsers } from '../../services/query';
import { useToggleUserStatus } from '../../services/mutation';

const SystemUsers: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSystemUsers({ Keyword: keyword, Page: page, PageSize: 10 });
  const { mutate: toggleStatus } = useToggleUserStatus();

  const handleToggle = (id: string, checked: boolean) => {
    toggleStatus({ id, isActive: checked });
  };

  const columns = [
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
    { 
      title: 'Vai trò', 
      dataIndex: 'role', 
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'ADMIN' ? 'red' : role === 'OWNER' ? 'green' : 'blue'}>{role}</Tag>
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: any) => (
        <Switch 
          checked={record.isActive} 
          onChange={(checked) => handleToggle(record.id, checked)}
          disabled={record.role === 'ADMIN'}
        />
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý Người dùng</h2>
      <Input.Search
        placeholder="Tìm kiếm email, họ tên..."
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

export default SystemUsers;
