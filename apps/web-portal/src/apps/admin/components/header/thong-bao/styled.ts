import styled, { keyframes, createGlobalStyle } from 'styled-components';

const PRIMARY = '#a5360d';
const PRIMARY_SUB = '#D85A30';
const UNREAD_BG = '#fdf6f2';
const UNREAD_DOT = '#a5360d';
const HOVER_BG = 'rgba(216, 90, 48, 0.04)';
const BORDER = 'rgba(224, 192, 182, 0.2)';
const TEXT_MAIN = '#3c2822';
const TEXT_MUTED = '#8e7670';
const TIME_UNREAD = '#a5360d';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(8px); }
  to   { opacity: 1; transform: translateX(0); }
`;

export const PopoverGlobalStyle = createGlobalStyle`
  html body div.ant-popover.admin-thong-bao-popover .ant-popover-inner-content {
    overflow: hidden !important;
    overflow-y: hidden !important;
    max-height: none !important;
    padding: 0 !important;
  }
`;

export const PopoverWrapper = styled.div<{ $expanded: boolean }>`
  width: 450px;
  max-height: 80vh;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.2s ease;
  box-shadow: 0 10px 40px rgba(88,66,59,.12), 0 4px 12px rgba(88,66,59,.08);
  border: 1px solid ${BORDER};
`;

// ─── Header ──────────────────────────────────────────────────────────────────
export const NotificationHeader = styled.div`
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  border-bottom: 1px solid ${BORDER};
  background: linear-gradient(135deg, #fdf6f2 0%, #fff 100%);

  .title {
    font-size: 16px;
    font-weight: 700;
    color: ${TEXT_MAIN};
    letter-spacing: -0.2px;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px;
    border-radius: 50%;
    font-size: 16px;
    color: ${PRIMARY};
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    border: 1px solid transparent;

    &:hover {
      background: ${HOVER_BG};
      color: ${PRIMARY_SUB};
    }
  }
`;

// ─── Tabs ─────────────────────────────────────────────────────────────────────
export const FilterTabsWrapper = styled.div`
  display: flex;
  padding: 10px 12px 6px;
  gap: 6px;
  flex-shrink: 0;
  background-color: #faf9f6;
  border-bottom: 1px solid rgba(224, 192, 182, 0.1);
`;

export const FilterTab = styled.button<{ $active: boolean }>`
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  outline: none;
  transition: all 0.2s;
  background: ${({ $active }) => ($active ? PRIMARY : 'transparent')};
  color: ${({ $active }) => ($active ? '#fff' : TEXT_MUTED)};
  box-shadow: ${({ $active }) => ($active ? '0 2px 6px rgba(165,54,13,.25)' : 'none')};

  &:hover {
    background: ${({ $active }) => ($active ? PRIMARY_SUB : HOVER_BG)};
    color: ${({ $active }) => ($active ? '#fff' : PRIMARY)};
  }
`;

// ─── Section row ──────────────────────────────────────────────────────────────
export const SectionHeaderWrapper = styled.div`
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  background-color: #fff;

  .section-title {
    font-size: 11px;
    font-weight: 700;
    color: ${TEXT_MUTED};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .view-all-link {
    font-size: 13px;
    font-weight: 700;
    color: ${PRIMARY};
    cursor: pointer;
    padding: 2px 8px;
    border-radius: 10px;
    transition: background 0.2s;

    &:hover {
      background: ${HOVER_BG};
    }
  }
`;

// ─── Scroll list ──────────────────────────────────────────────────────────────
export const NotificationListWrapper = styled.div<{ $isExpanded: boolean }>`
  flex: 1;
  min-height: 0;
  max-height: 380px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 4px 8px;
  background-color: #fff;

  /* Ẩn thanh kéo Scrollbar đi nhưng vẫn cuộn được */
  scrollbar-width: none !important; /* Dành cho Firefox */
  -ms-overflow-style: none !important; /* Dành cho IE và Edge */
  
  &::-webkit-scrollbar { 
    display: none !important; /* Dành cho Chrome, Safari, Opera */
    width: 0px !important;
    background: transparent !important;
  }
`;

// ─── Notification item ────────────────────────────────────────────────────────
export const NotificationItemStyled = styled.div<{ $unread: boolean }>`
  padding: 12px 14px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  gap: 12px;
  transition: background 0.18s, transform 0.18s;
  position: relative;
  align-items: flex-start;
  margin-bottom: 6px;
  background: ${({ $unread }) => ($unread ? UNREAD_BG : 'transparent')};
  animation: ${slideIn} 0.2s ease;
  border: 1px solid ${({ $unread }) => ($unread ? 'rgba(165, 54, 13, 0.08)' : 'transparent')};

  &:hover {
    background: ${({ $unread }) => ($unread ? 'rgba(165, 54, 13, 0.06)' : HOVER_BG)};
    transform: translateX(2px);
  }

  .nghiep-vu-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 2px 6px;
    border-radius: 6px;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    text-align: center;
    word-break: break-word;
    width: fit-content;
    line-height: 1.1;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    flex-shrink: 0;
  }

  /* ── Content ── */
  .content-container {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-top: 1px;

    .item-title {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }

    .title-text {
      flex: 1;
      font-size: 14px;
      font-weight: 700;
      color: ${({ $unread }) => ($unread ? PRIMARY : TEXT_MAIN)};
      line-height: 1.3;
      word-break: break-word;
    }

    .item-text {
      font-size: 12.5px;
      line-height: 1.4;
      color: ${TEXT_MUTED};
      word-break: break-word;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      line-clamp: 3;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-time {
      margin-top: 4px;
      font-size: 11px;
      color: ${({ $unread }) => ($unread ? TIME_UNREAD : TEXT_MUTED)};
      font-weight: ${({ $unread }) => ($unread ? '600' : '400')};
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }

  /* ── Unread dot ── */
  .unread-dot {
    flex-shrink: 0;
    margin-top: 6px;
    margin-left: 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${UNREAD_DOT};
    box-shadow: 0 0 0 2px rgba(165,54,13,.2);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 2px rgba(165,54,13,.2); }
    50%      { box-shadow: 0 0 0 4px rgba(165,54,13,.08); }
  }
`;

// ─── Bell button ──────────────────────────────────────────────────────────────
export const BellButton = styled.div`
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  flex-shrink: 0;

  &:hover {
    background: rgba(165, 54, 13, 0.08);
    box-shadow: 0 4px 10px rgba(165, 54, 13, 0.05);
  }

  .anticon {
    font-size: 20px;
    color: ${PRIMARY};
    line-height: 1;
  }
`;
