import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createApartment, updateApartment, deleteApartment, confirmBooking, completeBooking, cancelBooking, toggleUserStatus, toggleApartmentStatus, updateSystemBookingStatus } from './api';
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
