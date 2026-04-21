import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { getMe } from './api';

/**
 * Hook lấy thông tin người dùng đang đăng nhập (từ token Bearer)
 */
export const useGetMe = (options?: object): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['getMe'],
    queryFn: () => getMe(),
    ...options
  });
};
