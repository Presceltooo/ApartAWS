import React from 'react';
import { 
  EnvironmentOutlined, 
  CalendarOutlined, 
  TeamOutlined, 
  DownOutlined, 
  SearchOutlined 
} from '@ant-design/icons';
import {
  SearchBarContainer,
  SearchFieldBox,
  SearchLabel,
  SearchInputWrapper,
  SearchInput,
  SearchSelect,
  SearchSubmitBtn,
} from '../styles/styled';

const SearchBar: React.FC = () => {
  return (
    <SearchBarContainer>
      <SearchFieldBox>
        <SearchLabel>Địa điểm</SearchLabel>
        <SearchInputWrapper>
          <EnvironmentOutlined />
          <SearchInput type="text" placeholder="Bạn muốn đi đâu?" />
        </SearchInputWrapper>
      </SearchFieldBox>

      <SearchFieldBox>
        <SearchLabel>Ngày</SearchLabel>
        <SearchInputWrapper>
          <CalendarOutlined />
          <SearchInput type="text" placeholder="Thêm ngày" />
        </SearchInputWrapper>
      </SearchFieldBox>

      <SearchFieldBox>
        <SearchLabel>Khách</SearchLabel>
        <SearchInputWrapper className="select-wrapper">
          <TeamOutlined />
          <SearchSelect>
            <option>1 Khách</option>
            <option>2 Khách</option>
            <option>3+ Khách</option>
          </SearchSelect>
          <DownOutlined className="right-icon" />
        </SearchInputWrapper>
      </SearchFieldBox>

      <SearchSubmitBtn>
        <SearchOutlined />
        Tìm kiếm
      </SearchSubmitBtn>
    </SearchBarContainer>
  );
};

export default SearchBar;
