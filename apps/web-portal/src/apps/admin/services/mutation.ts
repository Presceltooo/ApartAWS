import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createApartment, updateApartment, deleteApartment } from './api';
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
