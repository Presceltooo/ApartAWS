import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { demSoLuongThongBaoChuaXem, layTatCaThongBao } from './api';
import type { NotificationResponse } from './type';

interface GetNotificationsOptions {
  enabled?: boolean;
  refreshKey?: number;
}

export const useGetNotifications = (
  options?: GetNotificationsOptions,
  filterParams?: any,
) => {
  const { refreshKey = 0, ...queryOptions } = options || {};

  return useInfiniteQuery<NotificationResponse>({
    queryKey: ['notifications', filterParams, refreshKey],
    queryFn: ({ pageParam }) =>
      layTatCaThongBao({ page: pageParam as number, pageSize: 20, ...filterParams }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPage } = lastPage.metaData;
      return page < totalPage ? page + 1 : undefined;
    },
    ...queryOptions,
  });
};

export const useGetUnreadCount = (options?: { enabled?: boolean }) => {
  return useQuery<number>({
    queryKey: ['unreadCount'],
    queryFn: demSoLuongThongBaoChuaXem,
    staleTime: 3 * 60 * 1000, // 3 minutes
    ...options,
  });
};
