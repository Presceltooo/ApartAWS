import dayjs from 'dayjs';

/**
 * Hook tính toán đặt phòng:
 * - Số đêm từ startDate → endDate
 * - Tổng tiền = số đêm × pricePerNight
 * - Format VND
 */
export const useBookingCalculation = (
  startDate: string | null,
  endDate: string | null,
  pricePerNight: number,
) => {
  const nights =
    startDate && endDate
      ? Math.max(0, dayjs(endDate).diff(dayjs(startDate), 'day'))
      : 0;

  const subtotal = nights * pricePerNight;

  const formatVND = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const formatUSD = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return {
    nights,
    subtotal,
    formatVND,
    formatUSD,
  };
};
