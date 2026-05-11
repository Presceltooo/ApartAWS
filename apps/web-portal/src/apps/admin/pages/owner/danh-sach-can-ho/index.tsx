import React from 'react';
import { Table, Button, Space, Tag, Popconfirm, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { useMyApartments } from '../../../services/query';
import { useDeleteApartment } from '../../../services/mutation';
import type { IApartment } from '../../../services/types';

const { Title } = Typography;

const MyApartments: React.FC = () => {
  const navigate = useNavigate();
  const { data: response, isLoading, isError } = useMyApartments({ PageSize: 50 });
  const { mutate: deleteApartment, isPending: isDeleting } = useDeleteApartment();

  const apartments = response?.data ?? [];

  const handleDelete = (id: string) => {
    deleteApartment(id);
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Price / Night',
      dataIndex: 'pricePerNight',
      key: 'pricePerNight',
      render: (price: number) => `$${price.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? 'Active' : 'Draft'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_: any, record: IApartment) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate({ to: '/quan-ly/bieu-mau-can-ho/sua/$id', params: { id: record.id } })}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this apartment?"
            description="Are you sure you want to delete this apartment? This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, loading: isDeleting }}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isError) {
    return <div>Failed to load apartments. Please try again.</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>My Apartments</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate({ to: '/quan-ly/bieu-mau-can-ho/tao-moi' })}
          size="large"
        >
          Add New Apartment
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={apartments}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default MyApartments;
