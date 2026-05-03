import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking, cancelBooking } from './api';

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
