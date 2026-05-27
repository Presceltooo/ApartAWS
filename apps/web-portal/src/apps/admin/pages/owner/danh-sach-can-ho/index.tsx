import React from 'react';
import { Button, Space, Tag, Popconfirm, Typography } from 'antd';
import TableWithPagination from '@/shared/components/tables/table-with-pagination';
import { useTranslation } from 'react-i18next';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { useMyApartments } from '../../../services/query';
import { useDeleteApartment } from '../../../services/mutation';
import type { IApartment } from '../../../services/types';

const { Title } = Typography;

const MyApartments: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('admin');
  const { data: response, isLoading, isError } = useMyApartments({ PageSize: 50 });
  const { mutate: deleteApartment, isPending: isDeleting } = useDeleteApartment();

  const apartments = response?.data ?? [];

  const handleDelete = (id: string) => {
    deleteApartment(id);
  };

  const columns = [
    {
      title: t('owner.table.title', 'Title'),
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: t('owner.table.location', 'Location'),
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: t('owner.table.price_per_night', 'Price / Night'),
      dataIndex: 'pricePerNight',
      key: 'pricePerNight',
      render: (price: number) => `${Number(price).toLocaleString('vi-VN')} ₫`,
    },
    {
      title: t('owner.table.status', 'Status'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? t('owner.form.status_active', 'Active') : t('owner.form.status_draft', 'Draft')}
        </Tag>
      ),
    },
    {
      title: t('owner.table.actions', 'Actions'),
      key: 'action',
      render: (_: any, record: IApartment) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate({ to: '/quan-ly/bieu-mau-can-ho/sua/$id', params: { id: record.id } })}
          >
            {t('owner.actions.edit', 'Edit')}
          </Button>
          <Popconfirm
            title={t('owner.delete_confirm.title', 'Delete this apartment?')}
            description={t('owner.delete_confirm.desc', 'Are you sure you want to delete this apartment? This action cannot be undone.')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('owner.delete_confirm.ok', 'Yes, Delete')}
            cancelText={t('owner.delete_confirm.cancel', 'Cancel')}
            okButtonProps={{ danger: true, loading: isDeleting }}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              {t('owner.actions.delete', 'Delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isError) {
    return <div>{t('owner.errors.load_apartments', 'Failed to load apartments. Please try again.')}</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>{t('owner.my_apartments_title', 'My Apartments')}</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate({ to: '/quan-ly/bieu-mau-can-ho/tao-moi' })}
          size="large"
        >
          {t('owner.add_apartment_btn', 'Add New Apartment')}
        </Button>
      </div>

      <TableWithPagination
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
