import { useMemo } from 'react';
import { useGetNotifications, useGetUnreadCount } from '../services/query';
import { useMarkAsRead, useMarkAllAsRead } from '../services/mutation';

export const useNotifications = (
  enabled: boolean,
  refreshKey = 0,
  activeTab: 'all' | 'unread' = 'all',
) => {
  const filterParams = useMemo(
    () => (activeTab === 'unread' ? { daXem: false } : undefined),
    [activeTab],
  );

  const query = useGetNotifications({ enabled, refreshKey }, filterParams);
  const { data: realUnreadCount } = useGetUnreadCount({ enabled });
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAll, isPending: markingAll } = useMarkAllAsRead();

  const notifications = useMemo(() => query.data?.pages.flatMap((p) => p.data) || [], [query.data]);
  const unreadCount = realUnreadCount ?? 0;

  return {
    ...query,
    notifications,
    unreadCount,
    markAsRead,
    markAll,
    markingAll,
  };
};
