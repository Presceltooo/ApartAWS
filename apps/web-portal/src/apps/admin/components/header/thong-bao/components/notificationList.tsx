import React, { useCallback, useEffect, useRef } from 'react';
import { Spin, Empty } from 'antd';
import NotificationItem from './notificationItem';
import { NotificationListWrapper } from '../styled';
import type { Notification } from '../services/type';

interface Props {
  isExpanded: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  notifications: Notification[];
  onMarkRead: (id: number) => void;
  onNavigate: (item: Notification) => void;
}

const NotificationList: React.FC<Props> = ({
  isExpanded,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  notifications,
  onMarkRead,
  onNavigate,
}) => {
  const listRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!isExpanded || !hasNextPage || isFetchingNextPage) return;
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop <= clientHeight + 100) {
        fetchNextPage();
      }
    },
    [isExpanded, hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    const container = listRef.current;
    if (!container || !isExpanded || !hasNextPage || isLoading || isFetchingNextPage) {
      return;
    }

    // Load more if content height is less than container height
    if (container.scrollHeight <= container.clientHeight + 1) {
      fetchNextPage();
    }
  }, [
    isExpanded,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    notifications.length,
    fetchNextPage,
  ]);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <Spin size="default" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <Empty
        description="Không có thông báo"
        style={{ padding: '32px 0' }}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <NotificationListWrapper
      ref={listRef}
      $isExpanded={isExpanded}
      onScroll={handleScroll}
    >
      {notifications.map((item) => (
        <NotificationItem
          key={item.id}
          item={item}
          onMarkRead={onMarkRead}
          onNavigate={onNavigate}
        />
      ))}
      {isFetchingNextPage && (
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <Spin size="small" />
        </div>
      )}
    </NotificationListWrapper>
  );
};

export default NotificationList;
