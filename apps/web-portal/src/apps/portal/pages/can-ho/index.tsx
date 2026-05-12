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
        <PageTitle>Danh sách căn hộ</PageTitle>
        <PageSubtitle>Khám phá bộ sưu tập các căn hộ cao cấp của chúng tôi.</PageSubtitle>
      </PageHeader>

      <SearchRow style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <Input
          id="apartment-search-input"
          size="large"
          placeholder="Từ khóa..."
          prefix={<SearchOutlined />}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 240 }}
          allowClear
        />
        <Input
          size="large"
          placeholder="Địa điểm..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 200 }}
          allowClear
        />
        <InputNumber
          size="large"
          placeholder="Giá tối thiểu"
          value={minPrice}
          onChange={(val) => setMinPrice(val as number)}
          onPressEnter={handleSearch}
          style={{ width: 140 }}
        />
        <InputNumber
          size="large"
          placeholder="Giá tối đa"
          value={maxPrice}
          onChange={(val) => setMaxPrice(val as number)}
          onPressEnter={handleSearch}
          style={{ width: 140 }}
        />
        <Button type="primary" size="large" onClick={handleSearch} icon={<SearchOutlined />}>
          Tìm kiếm
        </Button>
      </SearchRow>

      {!isLoading && !isError && (
        <ResultsCount>
          {total > 0
            ? `Hiển thị ${apartments.length} trên tổng số ${total} căn hộ`
            : 'Không tìm thấy căn hộ nào'}
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
          description="Không thể tải dữ liệu. Vui lòng thử lại."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : apartments.length === 0 ? (
        <Empty description="Không có căn hộ nào phù hợp với tìm kiếm của bạn." image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
