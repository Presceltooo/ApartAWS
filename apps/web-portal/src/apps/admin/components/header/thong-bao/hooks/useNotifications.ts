import { useMemo, useCallback } from 'react';
import { message } from 'antd';
import { useGetNotifications, useGetUnreadCount } from '../services/query';
import { useMarkAsRead, useMarkAllAsRead } from '../services/mutation';
import { useSSE } from './useSSE';

export const useNotifications = (
  enabled: boolean,
  refreshKey = 0,
  activeTab: 'all' | 'unread' = 'all',
) => {
  const filterParams = useMemo(
    () => (activeTab === 'unread' ? { daXem: false } : undefined),
    [activeTab],
  );

  // Trigger an Ant Design notification message when a new notification is received via SSE
  const handleNewNotification = useCallback((data: any) => {
    if (data?.notification?.tieuDe) {
      message.info({
        content: data.notification.tieuDe,
        duration: 4,
      });
    }
  }, []);

  // Connect to SSE stream (always enabled for authenticated users to get background real-time updates)
  useSSE({
    enabled: true,
    onNewNotification: handleNewNotification,
  });

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
