import { useState, useCallback } from 'react';
import tokenManager from '@shared/utils/tokenManager';
import useNotification from '@shared/hooks/useNotification';

export const useActions = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { showErrorNotify } = useNotification();

  const openModal = useCallback(() => {
    const accessToken = tokenManager.getAccessToken();
    if (!accessToken) {
      showErrorNotify('Vui lòng đăng nhập trước khi thực hiện đặt phòng.');
      return;
    }
    setModalOpen(true);
  }, [showErrorNotify]);

  const closeModal = useCallback(() => setModalOpen(false), []);

  return {
    modalOpen,
    openModal,
    closeModal,
  };
};
