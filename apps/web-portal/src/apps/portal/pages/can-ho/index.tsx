import React from 'react';
import { Input, Pagination, Empty, Skeleton, InputNumber, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('portal');
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
        <PageTitle>{t('list.title', 'Danh sách căn hộ')}</PageTitle>
        <PageSubtitle>{t('list.subtitle', 'Khám phá bộ sưu tập các căn hộ cao cấp của chúng tôi.')}</PageSubtitle>
      </PageHeader>

      <SearchRow style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        <Input
          id="apartment-search-input"
          size="large"
          placeholder={t('list.filters.keyword', 'Từ khóa...')}
          prefix={<SearchOutlined />}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onPressEnter={handleSearch}
          style={{ flex: '1 1 240px' }}
          allowClear
        />
        <Input
          size="large"
          placeholder={t('list.filters.location', 'Địa điểm...')}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onPressEnter={handleSearch}
          style={{ flex: '1 1 200px' }}
          allowClear
        />
        <InputNumber
          size="large"
          placeholder={t('list.filters.min_price', 'Giá tối thiểu')}
          value={minPrice}
          onChange={(val) => setMinPrice(val as number)}
          onPressEnter={handleSearch}
          style={{ flex: '1 1 140px' }}
        />
        <InputNumber
          size="large"
          placeholder={t('list.filters.max_price', 'Giá tối đa')}
          value={maxPrice}
          onChange={(val) => setMaxPrice(val as number)}
          onPressEnter={handleSearch}
          style={{ flex: '1 1 140px' }}
        />
        <Button type="primary" size="large" onClick={handleSearch} icon={<SearchOutlined />} style={{ flex: '0 0 auto' }}>
          {t('list.filters.search_btn', 'Tìm kiếm')}
        </Button>
      </SearchRow>

      {!isLoading && !isError && (
        <ResultsCount>
          {total > 0
            ? t('list.results.showing', { count: apartments.length, total, defaultValue: `Hiển thị ${apartments.length} trên tổng số ${total} căn hộ` })
            : t('list.results.empty', 'Không tìm thấy căn hộ nào')}
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
          description={t('list.results.error', 'Không thể tải dữ liệu. Vui lòng thử lại.')}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : apartments.length === 0 ? (
        <Empty description={t('list.results.no_match', 'Không có căn hộ nào phù hợp với tìm kiếm của bạn.')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
