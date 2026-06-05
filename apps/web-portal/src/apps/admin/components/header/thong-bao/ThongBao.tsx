import React, { useState, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { Badge, Popover, Spin, Tooltip } from 'antd';
import { useGetMe } from '@apps/auth/services/query';
import { useTranslation } from 'react-i18next';

import { useNotifications } from './hooks/useNotifications';
import NotificationList from './components/notificationList';
import type { Notification } from './services/type';
import {
  NotificationHeader,
  PopoverWrapper,
  FilterTabsWrapper,
  FilterTab,
  SectionHeaderWrapper,
  BellButton,
  PopoverGlobalStyle,
} from './styled';

const ThongBao: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const { data: userData } = useGetMe();

  const {
    notifications,
    unreadCount,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    markAsRead,
    markAll,
    markingAll,
  } = useNotifications(open, refreshKey, activeTab);

  const handleNavigate = useCallback(
    (item: Notification) => {
      if (!item.urlDieuHuong) return;
      setOpen(false);
      navigate({ to: item.urlDieuHuong });
    },
    [navigate],
  );

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (nextOpen) {
      setRefreshKey((prev) => prev + 1);
    }
    setOpen(nextOpen);
  }, []);

  const handleViewAll = () => {
    setOpen(false);
    const role = userData?.data?.role;
    if (role === 'ADMIN') {
      navigate({ to: '/quan-ly/quan-ly-tat-ca-dat-phong' });
    } else {
      navigate({ to: '/quan-ly/quan-ly-dat-phong' });
    }
  };

  const renderContent = () => (
    <PopoverWrapper $expanded={true}>
      <NotificationHeader>
        <div className="title">{t('notification.title')}</div>
        <div className="actions">
          <Tooltip title={t('notification.mark_all_read')}>
            <div className="action-btn" onClick={() => markAll()}>
              {markingAll ? <Spin size="small" /> : <CheckOutlined />}
            </div>
          </Tooltip>
        </div>
      </NotificationHeader>

      <FilterTabsWrapper>
        <FilterTab
          $active={activeTab === 'all'}
          onClick={() => setActiveTab('all')}
        >
          {t('notification.filter_all')}
        </FilterTab>
        <FilterTab
          $active={activeTab === 'unread'}
          onClick={() => setActiveTab('unread')}
        >
          {t('notification.filter_unread')} {unreadCount > 0 ? `(${unreadCount})` : ''}
        </FilterTab>
      </FilterTabsWrapper>

      <SectionHeaderWrapper>
        <div className="section-title">{t('notification.previous')}</div>
        <div className="view-all-link" onClick={handleViewAll}>
          {t('notification.view_all')}
        </div>
      </SectionHeaderWrapper>

      <NotificationList
        isExpanded={open}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={!!hasNextPage}
        fetchNextPage={fetchNextPage}
        notifications={notifications}
        onMarkRead={markAsRead}
        onNavigate={handleNavigate}
      />
    </PopoverWrapper>
  );

  return (
    <>
      <PopoverGlobalStyle />
      <Popover
        rootClassName="admin-thong-bao-popover"
        overlayClassName="admin-thong-bao-popover"
        content={renderContent()}
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
        placement="bottomRight"
        align={{ offset: [0, 0] }}
        overlayInnerStyle={{ padding: 0, overflow: 'hidden', borderRadius: 12 }}
      >
        <Badge count={unreadCount} size="small" overflowCount={99}>
          <BellButton>
            <BellOutlined />
          </BellButton>
        </Badge>
      </Popover>
    </>
  );
};

export default ThongBao;
