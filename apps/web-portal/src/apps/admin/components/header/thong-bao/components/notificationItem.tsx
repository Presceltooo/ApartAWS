import React, { memo } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { CalendarOutlined } from '@ant-design/icons';
import { NotificationItemStyled } from '../styled';
import type { Notification } from '../services/type';

dayjs.extend(relativeTime);
dayjs.locale('vi');

interface Props {
  item: Notification;
  onMarkRead: (id: number) => void;
  onNavigate: (item: Notification) => void;
}

const NotificationItem: React.FC<Props> = ({ item, onMarkRead, onNavigate }) => {
  const handleClick = () => {
    // If text is selected by user, don't trigger click action
    if (typeof window !== 'undefined') {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed && selection.toString().trim()) {
        return;
      }
    }

    if (!item.daXem) {
      onMarkRead(item.id);
    }

    onNavigate(item);
  };

  // Badge background/text color based on business type
  const getBadgeColors = () => {
    switch (item.nghiepVu || item.loai) {
      case 'BOOKING':
        return { bg: '#e0f2fe', text: '#0369a1' };
      case 'PAYMENT':
        return { bg: '#fef08a', text: '#a16207' };
      default:
        return { bg: '#f3f4f6', text: '#4b5563' };
    }
  };

  const { bg: bgColor, text: textColor } = getBadgeColors();

  return (
    <NotificationItemStyled
      $unread={!item.daXem}
      onClick={handleClick}
      style={{ cursor: item.urlDieuHuong ? 'pointer' : 'default' }}
    >
      <div className="content-container">
        <div className="item-title">
          <span className="title-text">{item.tieuDe}</span>
          <span
            className="nghiep-vu-badge"
            style={{ background: bgColor, color: textColor }}
          >
            {item.nghiepVu || item.loai || 'HỆ THỐNG'}
          </span>
        </div>
        <div className="item-text">{item.noiDung}</div>
        <div className="item-time">
          <CalendarOutlined />
          {dayjs(item.ngayTao).format('DD/MM/YYYY HH:mm')}
        </div>
      </div>
      {!item.daXem && <div className="unread-dot" />}
    </NotificationItemStyled>
  );
};

export default memo(NotificationItem);
