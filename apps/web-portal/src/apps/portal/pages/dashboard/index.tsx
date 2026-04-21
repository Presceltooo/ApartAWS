import React from 'react';
import { 
  DownOutlined, 
  CheckOutlined, 
  ControlOutlined 
} from '@ant-design/icons';
import {
  DashboardSection,
  HeroTitle,
  FiltersRow,
  FilterChip,
  ListingsGrid,
  LoadMoreContainer,
  LoadMoreBtn,
} from './styles/styled';
import SearchBar from './components/SearchBar';
import ListingCard from './components/ListingCard';
import { useData } from './hooks/useData';
import { useActions } from './hooks/useActions';

const Dashboard: React.FC = () => {
  const { listings, isLoading } = useData();
  const { activeFilters, toggleFilter, handleLoadMore } = useActions();

  if (isLoading) {
    return <div>Loading sanctuaries...</div>;
  }

  return (
    <>
      <DashboardSection>
        <HeroTitle>Discover Sanctuaries.</HeroTitle>
        
        <SearchBar />

        <FiltersRow>
          <FilterChip onClick={() => toggleFilter('Price Range')} $active={activeFilters.includes('Price Range')}>
            Price Range <DownOutlined style={{ fontSize: '1.125rem' }} />
          </FilterChip>
          <FilterChip onClick={() => toggleFilter('Property Type')} $active={activeFilters.includes('Property Type')}>
            Property Type <DownOutlined style={{ fontSize: '1.125rem' }} />
          </FilterChip>
          <FilterChip onClick={() => toggleFilter('Pool Access')} $active={activeFilters.includes('Pool Access')}>
            {activeFilters.includes('Pool Access') && <CheckOutlined style={{ fontSize: '1.125rem' }} />}
            Pool Access
          </FilterChip>
          <FilterChip onClick={() => toggleFilter('More Filters')} $active={activeFilters.includes('More Filters')}>
            More Filters <ControlOutlined style={{ fontSize: '1.125rem' }} />
          </FilterChip>
        </FiltersRow>
      </DashboardSection>

      <DashboardSection>
        <ListingsGrid>
          {listings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </ListingsGrid>

        <LoadMoreContainer>
          <LoadMoreBtn onClick={handleLoadMore}>
            Load More Sanctuaries
            <DownOutlined style={{ fontSize: '1.25rem' }} />
          </LoadMoreBtn>
        </LoadMoreContainer>
      </DashboardSection>
    </>
  );
};

export default Dashboard;
