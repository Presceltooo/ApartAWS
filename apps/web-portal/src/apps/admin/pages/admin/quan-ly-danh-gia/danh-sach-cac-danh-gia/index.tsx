import React, { useState } from 'react';
import { Button, Space, Tag, Rate, Popconfirm, Input, Form, Select, Tooltip } from 'antd';
import { CommentOutlined, CheckOutlined, EyeInvisibleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSearch, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import TableWithPagination from '@/shared/components/tables/table-with-pagination';
import BaseModal from '@/shared/components/modals';
import { useSystemReviews } from '../../../../services/query';
import { useApartmentDetail } from '../../../../../portal/services/query';
import { useUpdateReviewStatus, useAdminReplyToReview, useDeleteReview } from '../../../../services/mutation';
import type { IReview } from '../../../../services/types';
import dayjs from 'dayjs';

const SystemReviewsDetail: React.FC = () => {
  const { t } = useTranslation('admin');
  const search = useSearch({ strict: false }) as any;
  const apartmentId = search.apartmentId || '';

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);

  // Modal states for replying
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
  const [form] = Form.useForm();

  // Fetch apartment details (to get the title)
  const { data: apartmentResponse, isLoading: isLoadingApt } = useApartmentDetail(apartmentId);
  const apartmentTitle = apartmentResponse?.data?.title || t('owner.form.loading_detail', 'Đang tải...');

  // Fetch reviews for this apartment with pagination & filters
  const { data: reviewsData, isLoading: isLoadingReviews, refetch: refetchReviews } = useSystemReviews({
    ApartmentId: apartmentId,
    Page: page,
    PageSize: pageSize,
    Status: statusFilter,
    Rating: ratingFilter,
  });

  // Mutation hooks
  const { mutate: changeReviewStatus } = useUpdateReviewStatus();
  const { mutate: sendReply, isPending: isReplying } = useAdminReplyToReview();
  const { mutate: removeReview } = useDeleteReview();

  const handleUpdateStatus = (reviewId: string, status: string) => {
    changeReviewStatus(
      { reviewId, status },
      {
        onSuccess: () => {
          refetchReviews();
        },
      }
    );
  };

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

  const handleDeleteReview = (reviewId: string) => {
    removeReview(reviewId, {
      onSuccess: () => {
        refetchReviews();
      },
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
      title: t('reviews.col_reply', 'Phản hồi (Chủ nhà/Admin)'),
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
      width: 180,
      render: (_: any, record: IReview) => (
        <Space size="middle">
          <Tooltip title={record.reply ? t('reviews.tooltip_edit_reply', 'Sửa phản hồi') : t('reviews.tooltip_reply', 'Phản hồi')}>
            <Button
              type="text"
              icon={<CommentOutlined />}
              onClick={() => handleOpenReplyModal(record)}
            />
          </Tooltip>

          {record.status === 'PENDING' && (
            <>
              <Tooltip title={t('reviews.tooltip_approve', 'Phê duyệt')}>
                <Button
                  type="text"
                  style={{ color: '#52c41a' }}
                  icon={<CheckOutlined />}
                  onClick={() => handleUpdateStatus(record.id, 'APPROVED')}
                />
              </Tooltip>
              <Tooltip title={t('reviews.tooltip_hide', 'Ẩn nhận xét')}>
                <Button
                  type="text"
                  danger
                  icon={<EyeInvisibleOutlined />}
                  onClick={() => handleUpdateStatus(record.id, 'HIDDEN')}
                />
              </Tooltip>
            </>
          )}

          {record.status === 'APPROVED' && (
            <Tooltip title={t('reviews.tooltip_hide', 'Ẩn nhận xét')}>
              <Button
                type="text"
                danger
                icon={<EyeInvisibleOutlined />}
                onClick={() => handleUpdateStatus(record.id, 'HIDDEN')}
              />
            </Tooltip>
          )}

          {record.status === 'HIDDEN' && (
            <Tooltip title={t('reviews.tooltip_show_again', 'Hiển thị lại')}>
              <Button
                type="text"
                style={{ color: '#52c41a' }}
                icon={<CheckOutlined />}
                onClick={() => handleUpdateStatus(record.id, 'APPROVED')}
              />
            </Tooltip>
          )}

          <Popconfirm
            title={t('reviews.delete_confirm_title', 'Bạn có chắc chắn muốn xóa nhận xét này không?')}
            description={t('reviews.delete_confirm_desc', 'Thao tác này không thể hoàn tác.')}
            onConfirm={() => handleDeleteReview(record.id)}
            okText={t('reviews.delete_btn', 'Xóa')}
            cancelText={t('reviews.cancel_btn', 'Hủy')}
            okButtonProps={{ danger: true }}
          >
            <Tooltip title={t('reviews.tooltip_delete', 'Xóa')}>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Link to="/quan-ly/quan-ly-tat-ca-danh-gia">
          <Button type="default">&larr; {t('reviews.back_to_apartments', 'Quay lại danh sách căn hộ')}</Button>
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>{t('reviews.detail_title_admin', 'Chi tiết đánh giá của căn hộ')}: <span style={{ color: '#a5360d' }}>{apartmentTitle}</span></h2>
        
        <Space size="middle">
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
          <Select
            placeholder={t('reviews.filter_status', 'Lọc theo trạng thái')}
            allowClear
            style={{ width: 200 }}
            onChange={(val) => { setStatusFilter(val); setPage(1); }}
            options={[
              { value: 'PENDING', label: t('reviews.status_pending', 'Chờ duyệt') },
              { value: 'APPROVED', label: t('reviews.status_approved', 'Đang hiển thị') },
              { value: 'HIDDEN', label: t('reviews.status_hidden', 'Đã ẩn') },
            ]}
          />
        </Space>
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
        title={selectedReview?.reply ? t('reviews.modal_title_edit', 'Sửa phản hồi nhận xét (Admin)') : t('reviews.modal_title_add', 'Phản hồi nhận xét (Admin)')}
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

export default SystemReviewsDetail;
