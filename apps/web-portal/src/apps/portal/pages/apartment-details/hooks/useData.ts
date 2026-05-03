import { useApartmentDetail } from '@apps/portal/services/query';
import { useParams } from '@tanstack/react-router';

/**
 * Hook lấy dữ liệu chi tiết căn hộ từ route param $id
 * Phase 2: gọi API thực thay vì mock data
 */
export const useData = () => {
  const { id } = useParams({ strict: false }) as { id: string };

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useApartmentDetail(id ?? '');

  const apartment = response?.data ?? null;

  return {
    apartment,
    isLoading,
    isError,
    error,
  };
};
