import { useMemo, useCallback } from 'react';
import { notification } from 'antd';
import tokenManager from '@utils/tokenManager';
import { useGetNotifications, useGetUnreadCount } from '../services/query';
import { useMarkAsRead, useMarkAllAsRead } from '../services/mutation';
import { useSSE } from './useSSE';

export const useNotifications = (
  enabled: boolean,
  refreshKey = 0,
  activeTab: 'all' | 'unread' = 'all',
) => {
  const isLoggedIn = !!tokenManager.getAccessToken();

  const filterParams = useMemo(
    () => (activeTab === 'unread' ? { daXem: false } : undefined),
    [activeTab],
  );

  // Trigger an Ant Design notification message when a new notification is received via SSE
  const handleNewNotification = useCallback((data: any) => {
    if (data?.notification?.tieuDe) {
      // Avoid duplicate notification for the tenant who just created the booking
      // and already gets a success toast from the BookingModal component
      if (data.notification.tieuDe === 'Đã tạo đơn đặt phòng thành công') {
        return;
      }

      notification.info({
        message: data.notification.tieuDe,
        description: data.notification.noiDung,
        placement: 'topRight',
        duration: 4.5,
      });
    }
  }, []);

  // Connect to SSE stream (always enabled for authenticated users to get background real-time updates)
  useSSE({
    enabled: isLoggedIn,
    onNewNotification: handleNewNotification,
  });

  const query = useGetNotifications({ enabled: enabled && isLoggedIn, refreshKey }, filterParams);
  const { data: realUnreadCount } = useGetUnreadCount({ enabled: isLoggedIn });
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
