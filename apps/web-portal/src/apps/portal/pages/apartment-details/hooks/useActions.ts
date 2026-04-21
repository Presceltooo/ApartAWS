import { useState, useCallback } from 'react';

export const useActions = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return {
    modalOpen,
    openModal,
    closeModal,
  };
};
