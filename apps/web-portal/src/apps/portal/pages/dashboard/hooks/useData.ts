import { useApartmentListing } from '@apps/portal/services/query';
import type { IApartment } from '@apps/portal/services/types';

/**
 * Hook lấy dữ liệu cho trang Dashboard:
 * - Danh sách căn hộ listing (gọi API thực)
 * - Fallback về mock data khi API chưa sẵn sàng
 */
export const useData = () => {
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useApartmentListing({ Page: 1, PageSize: 9 });

  // Lấy mảng listings từ response phân trang
  const listings: IApartment[] = response?.data?.records ?? [];
  const totalRecords: number = response?.data?.totalRecords ?? 0;

  return {
    listings,
    totalRecords,
    isLoading,
    isError,
    error,
  };
};