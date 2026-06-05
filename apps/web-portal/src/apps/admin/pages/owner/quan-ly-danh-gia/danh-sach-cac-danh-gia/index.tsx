import React, { useState } from 'react';
import { Button, Space, Tag, Rate, Input, Form, Select, Tooltip } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import { useSearch, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import TableWithPagination from '@/shared/components/tables/table-with-pagination';
import BaseModal from '@/shared/components/modals';
import { useOwnerReviews } from '../../../../services/query';
import { useApartmentDetail } from '../../../../../portal/services/query';
import { useReplyToReview } from '../../../../services/mutation';
import type { IReview } from '../../../../services/types';
import dayjs from 'dayjs';

const OwnerReviewsDetail: React.FC = () => {
  const { t } = useTranslation('admin');
  const search = useSearch({ strict: false }) as any;
  const apartmentId = search.apartmentId || '';

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);

  // Modal states for replying
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
  const [form] = Form.useForm();

  // Fetch apartment details (to get the title)
  const { data: apartmentResponse, isLoading: isLoadingApt } = useApartmentDetail(apartmentId);
  const apartmentTitle = apartmentResponse?.data?.title || t('owner.form.loading_detail', 'Đang tải...');

  // Fetch reviews for this apartment with pagination
  const { data: reviewsData, isLoading: isLoadingReviews, refetch: refetchReviews } = useOwnerReviews({
    ApartmentId: apartmentId,
    Page: page,
    PageSize: pageSize,
    Rating: ratingFilter,
  });

  // Mutation hooks
  const { mutate: sendReply, isPending: isReplying } = useReplyToReview();

  const handleOpenReplyModal = (review: IReview) => {
    setSelectedReview(review);
    form.setFieldsValue({ reply: review.reply || '' });
    setModalOpen(true);
  };

  const handleSaveReply = () => {
    form.validateFields().then((values) => {
      if (!selectedReview) return;
      sendReply(
        { reviewId: selectedReview.id, reply: values.reply },
        {
          onSuccess: () => {
            setModalOpen(false);
            setSelectedReview(null);
            refetchReviews();
          },
        }
      );
    });
  };

  const columns = [
    {
      title: t('reviews.index_col', 'TT'),
      key: 'index',
      width: 70,
      render: (_: any, __: any, index: number) => index + 1 + (page - 1) * pageSize,
    },
    {
      title: t('reviews.col_tenant', 'Người đánh giá'),
      dataIndex: 'tenantName',
      key: 'tenantName',
      width: 150,
      render: (name: string) => <strong style={{ color: '#a5360d' }}>{name}</strong>,
    },
    {
      title: t('reviews.col_rating', 'Đánh giá sao'),
      dataIndex: 'rating',
      key: 'rating',
      width: 130,
      render: (rating: number) => <Rate disabled value={rating} style={{ fontSize: 13 }} />,
    },
    {
      title: t('reviews.col_comment', 'Nhận xét'),
      dataIndex: 'comment',
      key: 'comment',
      render: (comment: string) => comment || <span style={{ color: '#bfbfbf', fontStyle: 'italic' }}>{t('reviews.no_content', 'Không có nội dung')}</span>,
    },
    {
      title: t('reviews.col_owner_reply', 'Phản hồi của bạn'),
      dataIndex: 'reply',
      key: 'reply',
      render: (reply: string, record: IReview) => {
        if (!reply) return <span style={{ color: '#bfbfbf', fontStyle: 'italic' }}>{t('reviews.not_replied', 'Chưa phản hồi')}</span>;
        return (
          <div style={{ backgroundColor: '#f6f3ee', padding: '6px 10px', borderRadius: 6, borderLeft: '3px solid #a5360d' }}>
            <div style={{ fontSize: 12, color: '#595959' }}>{reply}</div>
            {record.repliedAt && (
              <div style={{ fontSize: 10, color: '#8c8c8c', marginTop: 2 }}>
                {dayjs(record.repliedAt).format('DD/MM/YYYY HH:mm')}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: t('reviews.col_status', 'Trạng thái'),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        if (status === 'PENDING') return <Tag color="warning">{t('reviews.status_pending', 'Chờ duyệt')}</Tag>;
        if (status === 'APPROVED') return <Tag color="success">{t('reviews.status_approved', 'Đang hiển thị')}</Tag>;
        return <Tag color="error">{t('reviews.status_hidden', 'Đã ẩn')}</Tag>;
      },
    },
    {
      title: t('reviews.col_created_at', 'Ngày tạo'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 130,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: t('reviews.col_action', 'Thao tác'),
      key: 'action',
      width: 100,
      render: (_: any, record: IReview) => (
        <Space size="middle">
          <Tooltip title={record.reply ? t('reviews.tooltip_edit_reply', 'Sửa phản hồi') : t('reviews.tooltip_reply', 'Phản hồi')}>
            <Button
              type="text"
              icon={<CommentOutlined />}
              onClick={() => handleOpenReplyModal(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Link to="/quan-ly/quan-ly-danh-gia">
          <Button type="default">&larr; {t('reviews.back_to_apartments', 'Quay lại danh sách căn hộ')}</Button>
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>{t('reviews.detail_title_owner', 'Chi tiết đánh giá & phản hồi')}: <span style={{ color: '#a5360d' }}>{apartmentTitle}</span></h2>
        
        <Select
          placeholder={t('reviews.filter_rating', 'Lọc theo số sao')}
          allowClear
          style={{ width: 180 }}
          onChange={(val) => { setRatingFilter(val); setPage(1); }}
          options={[
            { value: 5, label: <span>5 {t('reviews.stars', 'sao')} <span style={{ color: '#fadb14' }}>★★★★★</span></span> },
            { value: 4, label: <span>4 {t('reviews.stars', 'sao')} <span style={{ color: '#fadb14' }}>★★★★☆</span></span> },
            { value: 3, label: <span>3 {t('reviews.stars', 'sao')} <span style={{ color: '#fadb14' }}>★★★☆☆</span></span> },
            { value: 2, label: <span>2 {t('reviews.stars', 'sao')} <span style={{ color: '#fadb14' }}>★★☆☆☆</span></span> },
            { value: 1, label: <span>1 {t('reviews.stars', 'sao')} <span style={{ color: '#fadb14' }}>★☆☆☆☆</span></span> },
          ]}
        />
      </div>

      <TableWithPagination
        dataSource={reviewsData?.data || []}
        columns={columns}
        rowKey="id"
        loading={isLoadingReviews || isLoadingApt}
        pagination={{
          current: page,
          total: reviewsData?.metaData?.total || 0,
          onChange: (p) => setPage(p),
        }}
      />

      <BaseModal
        open={modalOpen}
        title={selectedReview?.reply ? t('reviews.modal_title_edit_owner', 'Sửa phản hồi nhận xét') : t('reviews.modal_title_add_owner', 'Phản hồi nhận xét')}
        onCancel={() => {
          setModalOpen(false);
          setSelectedReview(null);
        }}
        onOk={handleSaveReply}
        loading={isReplying}
        okText={t('reviews.modal_form_submit', 'Gửi phản hồi')}
      >
        <div style={{ padding: '20px 24px' }}>
          <div style={{ marginBottom: 16, border: '1px solid #f0f0f0', padding: 12, borderRadius: 8, backgroundColor: '#fafafa' }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{selectedReview?.tenantName}</div>
            <Rate disabled value={selectedReview?.rating || 0} style={{ fontSize: 14, marginBottom: 8 }} />
            <div style={{ color: '#595959' }}>{selectedReview?.comment || t('reviews.modal_no_comment', 'Không có bình luận chi tiết.')}</div>
          </div>
          <Form form={form} layout="vertical">
            <Form.Item
              name="reply"
              label={t('reviews.modal_form_reply_label', 'Câu trả lời phản hồi')}
              rules={[{ required: true, message: t('reviews.modal_form_reply_required', 'Vui lòng nhập phản hồi của bạn') }]}
            >
              <Input.TextArea rows={4} placeholder={t('reviews.modal_form_reply_placeholder', 'Nhập câu trả lời cho đánh giá này...')} />
            </Form.Item>
          </Form>
        </div>
      </BaseModal>
    </div>
  );
};

export default OwnerReviewsDetail;
