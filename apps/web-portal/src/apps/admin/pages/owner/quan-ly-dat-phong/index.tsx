import React from 'react';
import { Tag, Typography, Button, Space } from 'antd';
import TableWithPagination from '@/shared/components/tables/table-with-pagination';
import { useTranslation } from 'react-i18next';
import { useOwnerBookings } from '../../../services/query';
import { useConfirmBooking, useCompleteBooking, useCancelBooking } from '../../../services/mutation';
import type { IBooking } from '../../../services/types';
import dayjs from 'dayjs';
import useNotification from '@/shared/hooks/useNotification';

const { Title } = Typography;

const OwnerBookings: React.FC = () => {
  const { t } = useTranslation('admin');
  const { showSuccessNotify, showErrorNotify } = useNotification();
  const { data: response, isLoading, isError } = useOwnerBookings({ PageSize: 50 });
  const { mutate: confirmBooking, isPending: isConfirming } = useConfirmBooking();
  const { mutate: completeBooking, isPending: isCompleting } = useCompleteBooking();
  const { mutate: cancelBooking, isPending: isCanceling } = useCancelBooking();

  const bookings = response?.data ?? [];

  const handleConfirm = (id: string) => {
    confirmBooking(id, {
      onSuccess: () => showSuccessNotify(t('owner.booking_messages.confirm_success', 'Booking confirmed successfully')),
      onError: (err: any) => showErrorNotify(err?.response?.data?.message || t('owner.booking_messages.confirm_error', 'Failed to confirm booking'))
    });
  };

  const handleComplete = (id: string) => {
    completeBooking(id, {
      onSuccess: () => showSuccessNotify(t('owner.booking_messages.complete_success', 'Booking completed successfully')),
      onError: (err: any) => showErrorNotify(err?.response?.data?.message || t('owner.booking_messages.complete_error', 'Failed to complete booking'))
    });
  };

  const handleCancel = (id: string) => {
    cancelBooking(id, {
      onSuccess: () => showSuccessNotify(t('owner.booking_messages.cancel_success', 'Booking cancelled successfully')),
      onError: (err: any) => showErrorNotify(err?.response?.data?.message || t('owner.booking_messages.cancel_error', 'Failed to cancel booking'))
    });
  };

  const columns = [
    {
      title: t('owner.bookings_table.booking_id', 'Booking ID'),
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <span style={{ fontFamily: 'monospace' }}>{id.slice(0, 8).toUpperCase()}</span>,
    },
    {
      title: t('owner.bookings_table.property', 'Property'),
      key: 'property',
      render: (_: any, record: IBooking) => (
        <strong>{record.apartment?.title || `Apt #${record.apartmentId.slice(0, 8)}`}</strong>
      ),
    },
    {
      title: t('owner.bookings_table.tenant_id', 'Tenant ID'),
      dataIndex: 'tenantId',
      key: 'tenantId',
      render: (tenantId: string) => <span style={{ fontFamily: 'monospace' }}>{tenantId.slice(0, 8)}</span>,
    },
    {
      title: t('owner.bookings_table.check_in', 'Check In'),
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: t('owner.bookings_table.check_out', 'Check Out'),
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: t('owner.bookings_table.guests', 'Guests'),
      dataIndex: 'guests',
      key: 'guests',
      render: (guests: number) => guests || 1,
    },
    {
      title: t('owner.bookings_table.total_price', 'Total Price'),
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price: number) => `${Number(price).toLocaleString('vi-VN')} ₫`,
    },
    {
      title: t('owner.bookings_table.status', 'Status'),
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
      title: t('owner.bookings_table.action', 'Action'),
      key: 'action',
      render: (_: any, record: IBooking) => (
        <Space size="middle">
          {record.status === 'PENDING' && (
            <>
              <Button type="primary" size="small" onClick={() => handleConfirm(record.id)} loading={isConfirming}>
                {t('owner.booking_actions.confirm', 'Confirm')}
              </Button>
              <Button danger size="small" onClick={() => handleCancel(record.id)} loading={isCanceling}>
                {t('owner.booking_actions.reject', 'Reject')}
              </Button>
            </>
          )}
          {record.status === 'CONFIRMED' && (
            <Button type="primary" size="small" style={{ background: '#52c41a' }} onClick={() => handleComplete(record.id)} loading={isCompleting}>
              {t('owner.booking_actions.complete', 'Complete')}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  if (isError) {
    return <div>{t('owner.errors.load_bookings', 'Failed to load bookings. Please try again.')}</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>{t('owner.bookings_title', 'Bookings for My Properties')}</Title>
      </div>

      <TableWithPagination
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
