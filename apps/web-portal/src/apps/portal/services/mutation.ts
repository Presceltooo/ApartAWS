import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking, cancelBooking, confirmBooking, completeBooking } from './api';

// ─── Booking Mutations ─────────────────────────────────────────────────────────

/**
 * Hook tạo đặt phòng mới
 * Tự động invalidate cache my-bookings sau khi tạo thành công
 */
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'my'] });
    },
  });
};

/**
 * Hook huỷ booking
 * Tự động invalidate cache my-bookings và chi tiết booking
 */
export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', id] });
    },
  });
};

/**
 * Hook xác nhận booking (Owner)
 */
export const useConfirmBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => confirmBooking(id),
    onSuccess: () => {
      // Invalidate queries that fetch owner bookings (adjust queryKey based on your app's queries)
      // Assuming 'owner' or 'my' bookings are used
      queryClient.invalidateQueries({ queryKey: ['bookings'] }); 
    },
  });
};

/**
 * Hook hoàn thành booking (Owner)
 */
export const useCompleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => completeBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};
