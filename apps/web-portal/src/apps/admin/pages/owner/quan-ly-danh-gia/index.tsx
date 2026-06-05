import React, { useState } from 'react';
import { Button } from 'antd';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import TableWithPagination from '@/shared/components/tables/table-with-pagination';
import { useMyApartments } from '../../../services/query';
import type { IApartment } from '../../../services/types';

const OwnerReviews: React.FC = () => {
  const { t } = useTranslation('admin');
  const [page, setPage] = useState(1);

  // Fetch owner's apartments list
  const { data: apartmentsData, isLoading } = useMyApartments({ Page: page, PageSize: 10 });

  const columns = [
    { title: t('reviews.col_apartment_name', 'Tên Căn hộ'), dataIndex: 'title', key: 'title' },
    { title: t('reviews.col_location', 'Vị trí'), dataIndex: 'location', key: 'location' },
    {
      title: t('reviews.col_avg_rating', 'Đánh giá TB'),
      dataIndex: 'averageRating',
      key: 'averageRating',
      render: (rating: number | null) => (rating ? `${rating} ★` : t('reviews.no_rating', 'Chưa có')),
    },
    {
      title: t('reviews.col_review_count', 'Số nhận xét'),
      dataIndex: 'reviewCount',
      key: 'reviewCount',
      render: (count: number) => count || 0,
    },
    {
      key: 'action',
      title: t('reviews.col_action', 'Thao tác'),
      render: (_: any, record: IApartment) => (
        <Link
          to="/quan-ly/quan-ly-danh-gia/danh-sach-cac-danh-gia"
          search={{ apartmentId: record.id }}
        >
          <Button type="primary">{t('reviews.btn_view_details', 'Xem chi tiết')}</Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <h2>{t('reviews.title_my_reviews', 'Quản lý Đánh giá & Nhận xét của tôi')}</h2>
      <TableWithPagination
        dataSource={apartmentsData?.data || []}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page,
          total: apartmentsData?.metaData?.total || 0,
          onChange: (p) => setPage(p),
        }}
      />
    </div>
  );
};

export default OwnerReviews;
