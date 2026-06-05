import React, { useState } from 'react';
import { Switch, Button, Input } from 'antd';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import TableWithPagination from '@/shared/components/tables/table-with-pagination';
import { useSystemApartments } from '../../../services/query';
import { useToggleApartmentReviewAutoApprove } from '../../../services/mutation';
import type { IApartment } from '../../../services/types';

const SystemReviews: React.FC = () => {
  const { t } = useTranslation('admin');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Fetch apartments list
  const { data, isLoading } = useSystemApartments({ Keyword: keyword, Page: page, PageSize: 10 });

  // Toggle review auto approve status mutation
  const { mutate: toggleAptReviewAutoApprove } = useToggleApartmentReviewAutoApprove();

  const handleToggleAptReviewAutoApprove = (id: string, checked: boolean) => {
    setTogglingId(id);
    toggleAptReviewAutoApprove(
      { id, isAutoApproveReview: checked },
      {
        onSettled: () => setTogglingId(null),
      }
    );
  };

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
      title: t('reviews.col_auto_approve', 'Tự động duyệt'),
      key: 'isAutoApproveReview',
      render: (_: any, record: IApartment) => (
        <Switch
          checked={record.isAutoApproveReview || false}
          loading={togglingId === record.id}
          onChange={(checked) => handleToggleAptReviewAutoApprove(record.id, checked)}
          checkedChildren={t('reviews.status_switch_on', 'Bật')}
          unCheckedChildren={t('reviews.status_switch_off', 'Tắt')}
        />
      ),
    },
    {
      title: t('reviews.col_action', 'Thao tác'),
      key: 'action',
      render: (_: any, record: IApartment) => (
        <Link
          to="/quan-ly/quan-ly-tat-ca-danh-gia/danh-sach-cac-danh-gia"
          search={{ apartmentId: record.id }}
        >
          <Button type="primary">{t('reviews.btn_view_details', 'Xem chi tiết')}</Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <h2>{t('reviews.title_all_reviews', 'Quản lý Đánh giá (Toàn hệ thống)')}</h2>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        gap: 16,
        flexWrap: 'wrap'
      }}>
        <Input.Search
          placeholder={t('reviews.search_placeholder', 'Tìm kiếm tên căn hộ...')}
          onSearch={(val) => { setKeyword(val); setPage(1); }}
          style={{ width: 300 }}
        />
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

export default SystemReviews;
