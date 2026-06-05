import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { createApartment, updateApartment, deleteApartment, toggleAutoApproveStatus, confirmBooking, completeBooking, cancelBooking, toggleUserStatus, toggleApartmentStatus, updateSystemBookingStatus, updateSystemAutoApprove, updateReviewStatus, replyToReview, toggleApartmentReviewAutoApprove, adminReplyToReview, deleteReview } from './api';
import type { ICreateApartmentPayload, IUpdateApartmentPayload } from './types';
import { notification } from 'antd';

export const useCreateApartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateApartmentPayload) => createApartment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'apartments'] });
      notification.success({ message: 'Apartment created successfully' });
    },
    onError: (error: any) => {
      notification.error({
        message: 'Failed to create apartment',
        description: error.response?.data?.message || error.message,
      });
    },
  });
};

export const useUpdateApartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: IUpdateApartmentPayload }) =>
      updateApartment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'apartments'] });
      notification.success({ message: 'Apartment updated successfully' });
    },
    onError: (error: any) => {
      notification.error({
        message: 'Failed to update apartment',
        description: error.response?.data?.message || error.message,
      });
    },
  });
};

export const useDeleteApartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteApartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'apartments'] });
      notification.success({ message: 'Apartment deleted successfully' });
    },
    onError: (error: any) => {
      notification.error({
        message: 'Failed to delete apartment',
        description: error.response?.data?.message || error.message,
      });
    },
  });
};

export const useConfirmBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => confirmBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      notification.success({ message: 'Booking confirmed successfully' });
    },
    onError: (error: any) => {
      notification.error({
        message: 'Failed to confirm booking',
        description: error.response?.data?.message || error.message,
      });
    },
  });
};

export const useCompleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => completeBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      notification.success({ message: 'Booking completed successfully' });
    },
    onError: (error: any) => {
      notification.error({
        message: 'Failed to complete booking',
        description: error.response?.data?.message || error.message,
      });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      notification.success({ message: 'Booking cancelled successfully' });
    },
    onError: (error: any) => {
      notification.error({
        message: 'Failed to cancel booking',
        description: error.response?.data?.message || error.message,
      });
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => toggleUserStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'system-users'] });
      notification.success({ message: 'User status updated successfully' });
    },
    onError: (error: any) => {
      notification.error({
        message: 'Failed to update user status',
        description: error.response?.data?.message || error.message,
      });
    },
  });
};

export const useToggleApartmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => toggleApartmentStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'system-apartments'] });
      notification.success({ message: 'Apartment status updated successfully' });
    },
    onError: (error: any) => {
      notification.error({
        message: 'Failed to update apartment status',
        description: error.response?.data?.message || error.message,
      });
    },
  });
};

export const useUpdateSystemBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateSystemBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'system-bookings'] });
      notification.success({ message: 'Booking status updated successfully' });
    },
    onError: (error: any) => {
      notification.error({
        message: 'Failed to update booking status',
        description: error.response?.data?.message || error.message,
      });
    },
  });
};

export const useToggleAutoApproveStatus = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('admin');
  return useMutation({
    mutationFn: ({ id, isAutoApprove }: { id: string; isAutoApprove: boolean }) =>
      toggleAutoApproveStatus(id, isAutoApprove),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'apartments'] });
      notification.success({
        message: t('owner.toast.toggle_auto_approve_success', 'Cập nhật cấu hình tự động duyệt thành công'),
      });
    },
    onError: (error: any) => {
      notification.error({
        message: t('owner.toast.toggle_auto_approve_error', 'Lỗi cập nhật cấu hình tự động duyệt'),
        description: error.response?.data?.message || error.message,
      });
    },
  });
};

export const useUpdateSystemAutoApprove = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (isAutoApprove: boolean) => updateSystemAutoApprove(isAutoApprove),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'system-auto-approve'] });
      notification.success({ message: 'Cập nhật cấu hình tự động duyệt hệ thống thành công' });
    },
    onError: (error: any) => {
      notification.error({
        message: 'Lỗi cập nhật cấu hình tự động duyệt hệ thống',
        description: error.response?.data?.message || error.message,
      });
    },
  });
};

export const useUpdateReviewStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, status }: { reviewId: string; status: string }) =>
      updateReviewStatus(reviewId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'system-reviews'] });
      notification.success({ message: 'Cập nhật trạng thái đánh giá thành công' });
    },
    onError: (error: any) => {
      notification.error({
        message: 'Lỗi cập nhật trạng thái đánh giá',
        description: error.response?.data?.message || error.message,
      });
    },
  });
};

export const useReplyToReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, reply }: { reviewId: string; reply: string }) =>
      replyToReview(reviewId, reply),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'owner-reviews'] });
      notification.success({ message: 'Phản hồi đánh giá thành công' });
    },
    onError: (error: any) => {
      notification.error({
        message: 'Lỗi gửi phản hồi đánh giá',
        description: error.response?.data?.message || error.message,
      });
    },
  });
};

export const useToggleApartmentReviewAutoApprove = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isAutoApproveReview }: { id: string; isAutoApproveReview: boolean }) =>
      toggleApartmentReviewAutoApprove(id, isAutoApproveReview),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'system-apartments'] });
      notification.success({ message: 'Cập nhật cấu hình tự động duyệt đánh giá căn hộ thành công' });
    },
    onError: (error: any) => {
      notification.error({
        message: 'Lỗi cập nhật cấu hình tự động duyệt',
        description: error.response?.data?.message || error.message,
      });
    },
  });
};

export const useAdminReplyToReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, reply }: { reviewId: string; reply: string }) =>
      adminReplyToReview(reviewId, reply),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'system-reviews'] });
      notification.success({ message: 'Phản hồi đánh giá thành công' });
    },
    onError: (error: any) => {
      notification.error({
        message: 'Lỗi gửi phản hồi đánh giá',
        description: error.response?.data?.message || error.message,
      });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) => deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'system-reviews'] });
      notification.success({ message: 'Xóa đánh giá thành công' });
    },
    onError: (error: any) => {
      notification.error({
        message: 'Lỗi xóa đánh giá',
        description: error.response?.data?.message || error.message,
      });
    },
  });
};


