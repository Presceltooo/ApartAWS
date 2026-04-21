import styled from 'styled-components';

export const ModalHeader = styled.div<{ height?: string | number }>`
  padding: 1rem 1.6rem;
  height: ${(props) => props.height || 'var(--modal-header-height, 4.8rem)'};
  display: flex;
  background-color: var(--primary);
  align-items: center;
  justify-content: space-between;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.12);
  
  z-index: 20;
  position: relative;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  flex-shrink: 0;
`;

export const ModalTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
`;

export const ModalTitle = styled.h6`
  font-weight: 500;
  font-size: 1.8rem;
  line-height: 3rem;
  color: var(--white);
  width: 100%;
`;

export const ModalHeaderButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export const PrintButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4rem;
  border: 1px solid var(--primary);
  border-radius: 4px;
  padding: 4px 1rem 4px 1rem;
  background-color: var(--white);
`;

export const ModalBody = styled.div`
  padding: 1.6rem;
  /* padding-bottom: 0; */
  max-height: calc(var(--modal-max-height, 80vh) - var(--modal-header-height, 4.8rem));
  overflow-y: auto;
  overflow-x: hidden;

  /* &::-webkit-scrollbar {
    display: none;
  } */

  .ant-tabs-nav-wrap {
    border-bottom: 1px solid var(--border-primary);
  }

  .ant-tabs > .ant-tabs-nav {
    height: var(--modal-tabs-height);
    position: sticky;
    top: -1.6rem;
    left: 0;
    right: 0;
    background-color: var(--bg-primary);
    z-index: 10;
    margin-top: -1.6rem;
    margin-bottom: 0;

    .ant-tabs-tab {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
`;

