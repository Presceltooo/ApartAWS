import React from 'react';
import { Input, Pagination, Empty, Skeleton, InputNumber, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {
  PageWrapper,
  PageHeader,
  PageTitle,
  PageSubtitle,
  SearchRow,
  Grid,
  PaginationWrapper,
  ResultsCount,
} from './styles/styled';
import ApartmentCard from './components/ApartmentCard';
import { useData } from './hooks/useData';
import { useActions } from './hooks/useActions';

const PAGE_SIZE = 9;

const ApartmentList: React.FC = () => {
  const {
    keyword,
    searchInput,
    setSearchInput,
    page,
    location,
    setLocation,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    appliedLocation,
    appliedMinPrice,
    appliedMaxPrice,
    handleSearch,
    handleView,
    handlePageChange,
  } = useActions();

  const { apartments, total, isLoading, isError } = useData({
    keyword,
    location: appliedLocation,
    minPrice: appliedMinPrice,
    maxPrice: appliedMaxPrice,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>All Sanctuaries</PageTitle>
        <PageSubtitle>Browse our curated collection of premium properties.</PageSubtitle>
      </PageHeader>

      <SearchRow style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <Input
          id="apartment-search-input"
          size="large"
          placeholder="Keyword..."
          prefix={<SearchOutlined />}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 240 }}
          allowClear
        />
        <Input
          size="large"
          placeholder="Location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 200 }}
          allowClear
        />
        <InputNumber
          size="large"
          placeholder="Min Price ($)"
          value={minPrice}
          onChange={(val) => setMinPrice(val as number)}
          onPressEnter={handleSearch}
          style={{ width: 140 }}
        />
        <InputNumber
          size="large"
          placeholder="Max Price ($)"
          value={maxPrice}
          onChange={(val) => setMaxPrice(val as number)}
          onPressEnter={handleSearch}
          style={{ width: 140 }}
        />
        <Button type="primary" size="large" onClick={handleSearch} icon={<SearchOutlined />}>
          Search
        </Button>
      </SearchRow>

      {!isLoading && !isError && (
        <ResultsCount>
          {total > 0
            ? `Showing ${apartments.length} of ${total} properties`
            : 'No properties found'}
        </ResultsCount>
      )}

      {isLoading ? (
        <Grid>
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <Skeleton key={i} active paragraph={{ rows: 4 }} />
          ))}
        </Grid>
      ) : isError ? (
        <Empty
          description="Unable to load properties. Please try again."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : apartments.length === 0 ? (
        <Empty description="No properties match your search." image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <Grid>
          {apartments.map((apt) => (
            <ApartmentCard key={apt.id} apartment={apt} onView={handleView} />
          ))}
        </Grid>
      )}

      {total > PAGE_SIZE && (
        <PaginationWrapper>
          <Pagination
            current={page}
            total={total}
            pageSize={PAGE_SIZE}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </PaginationWrapper>
      )}
    </PageWrapper>
  );
};

export default ApartmentList;
