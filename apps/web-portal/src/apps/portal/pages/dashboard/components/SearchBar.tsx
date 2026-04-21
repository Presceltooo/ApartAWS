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
        <SearchLabel>Location</SearchLabel>
        <SearchInputWrapper>
          <EnvironmentOutlined />
          <SearchInput type="text" placeholder="Where to?" />
        </SearchInputWrapper>
      </SearchFieldBox>

      <SearchFieldBox>
        <SearchLabel>Dates</SearchLabel>
        <SearchInputWrapper>
          <CalendarOutlined />
          <SearchInput type="text" placeholder="Add dates" />
        </SearchInputWrapper>
      </SearchFieldBox>

      <SearchFieldBox>
        <SearchLabel>Guests</SearchLabel>
        <SearchInputWrapper className="select-wrapper">
          <TeamOutlined />
          <SearchSelect>
            <option>1 Guest</option>
            <option>2 Guests</option>
            <option>3+ Guests</option>
          </SearchSelect>
          <DownOutlined className="right-icon" />
        </SearchInputWrapper>
      </SearchFieldBox>

      <SearchSubmitBtn>
        <SearchOutlined />
        Search
      </SearchSubmitBtn>
    </SearchBarContainer>
  );
};

export default SearchBar;
