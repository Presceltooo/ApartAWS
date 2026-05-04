import React from 'react';
import { Table, Tag, Typography, Button, Space } from 'antd';
import { useOwnerBookings } from '../../services/query';
import { useConfirmBooking, useCompleteBooking, useCancelBooking } from '../../services/mutation';
import type { IBooking } from '../../services/types';
import dayjs from 'dayjs';
import useNotification from '@/shared/hooks/useNotification';

const { Title } = Typography;

const OwnerBookings: React.FC = () => {
  const { showSuccessNotify, showErrorNotify } = useNotification();
  const { data: response, isLoading, isError } = useOwnerBookings({ PageSize: 50 });
  const { mutate: confirmBooking, isPending: isConfirming } = useConfirmBooking();
  const { mutate: completeBooking, isPending: isCompleting } = useCompleteBooking();
  const { mutate: cancelBooking, isPending: isCanceling } = useCancelBooking();

  const bookings = response?.data ?? [];

  const handleConfirm = (id: string) => {
    confirmBooking(id, {
      onSuccess: () => showSuccessNotify('Booking confirmed successfully'),
      onError: (err: any) => showErrorNotify(err?.response?.data?.message || 'Failed to confirm booking')
    });
  };

  const handleComplete = (id: string) => {
    completeBooking(id, {
      onSuccess: () => showSuccessNotify('Booking completed successfully'),
      onError: (err: any) => showErrorNotify(err?.response?.data?.message || 'Failed to complete booking')
    });
  };

  const handleCancel = (id: string) => {
    cancelBooking(id, {
      onSuccess: () => showSuccessNotify('Booking cancelled successfully'),
      onError: (err: any) => showErrorNotify(err?.response?.data?.message || 'Failed to cancel booking')
    });
  };

  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <span style={{ fontFamily: 'monospace' }}>{id.slice(0, 8).toUpperCase()}</span>,
    },
    {
      title: 'Property',
      key: 'property',
      render: (_: any, record: IBooking) => (
        <strong>{record.apartment?.title || `Apt #${record.apartmentId.slice(0, 8)}`}</strong>
      ),
    },
    {
      title: 'Tenant ID',
      dataIndex: 'tenantId',
      key: 'tenantId',
      render: (tenantId: string) => <span style={{ fontFamily: 'monospace' }}>{tenantId.slice(0, 8)}</span>,
    },
    {
      title: 'Check In',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Check Out',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price: number) => `$${price.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'PENDING') color = 'gold';
        if (status === 'CONFIRMED') color = 'blue';
        if (status === 'COMPLETED') color = 'green';
        if (status === 'CANCELLED') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: IBooking) => (
        <Space size="middle">
          {record.status === 'PENDING' && (
            <>
              <Button type="primary" size="small" onClick={() => handleConfirm(record.id)} loading={isConfirming}>
                Confirm
              </Button>
              <Button danger size="small" onClick={() => handleCancel(record.id)} loading={isCanceling}>
                Reject
              </Button>
            </>
          )}
          {record.status === 'CONFIRMED' && (
            <Button type="primary" size="small" style={{ background: '#52c41a' }} onClick={() => handleComplete(record.id)} loading={isCompleting}>
              Complete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  if (isError) {
    return <div>Failed to load bookings. Please try again.</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Bookings for My Properties</Title>
      </div>

      <Table
        columns={columns}
        dataSource={bookings}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default OwnerBookings;
