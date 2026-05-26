import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'antd';
import styled from 'styled-components';

const SwitchBtn = styled.button`
  background: transparent;
  border: 1px solid rgba(224, 192, 182, 0.3);
  color: inherit;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(216, 90, 48, 0.05);
    border-color: #D85A30;
  }
`;

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation('common');
  
  const langItems = [
    { key: 'vi', label: '🇻🇳 Tiếng Việt' },
    { key: 'en', label: '🇺🇸 English' },
    { key: 'ja', label: '🇯🇵 日本語' },
  ];

  const currentLangLabel = langItems.find(item => item.key === i18n.language)?.label || '🇻🇳 Tiếng Việt';
  const flag = currentLangLabel.split(' ')[0];
  const labelText = currentLangLabel.split(' ').slice(1).join(' ');

  return (
    <Dropdown
      menu={{
        items: langItems,
        onClick: ({ key }) => {
          i18n.changeLanguage(key);
          localStorage.setItem('language', key);
        },
        selectedKeys: [i18n.language],
      }}
      trigger={['click']}
      placement="bottomRight"
    >
      <SwitchBtn>
        <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{flag}</span>
        <span>{labelText}</span>
      </SwitchBtn>
    </Dropdown>
  );
};

export default LanguageSwitcher;
