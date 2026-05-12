import React from 'react';
import { Link } from '@tanstack/react-router';
import {
  DownOutlined,
  CheckOutlined,
  ControlOutlined,
  HomeOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import image404 from '@assets/images/404.png';
import { Skeleton } from 'antd';
import styled from 'styled-components';
import {
  DashboardSection,
  HeroTitle,
  FiltersRow,
  FilterChip,
  ListingsGrid,
  LoadMoreContainer,
  LoadMoreBtn,
} from './styles/styled';
import { portalTheme } from '../../styled';
import SearchBar from './components/SearchBar';
import ListingCard from './components/ListingCard';
import type { Listing } from './components/ListingCard';
import { useData } from './hooks/useData';
import { useActions } from './hooks/useActions';

// ─── Stats Cards Styled ────────────────────────────────────────────────────────

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StatCard = styled.div`
  background: ${portalTheme.colors.surfaceContainerLowest};
  border: 1px solid rgba(224, 192, 182, 0.2);
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 16px rgba(74, 27, 12, 0.04);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 8px 24px rgba(74, 27, 12, 0.08);
  }
`;

const StatIconWrap = styled.div<{ $color: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background: ${(p) => p.$color}22;
  color: ${(p) => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${portalTheme.colors.onSurface};
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 0.8125rem;
  color: ${portalTheme.colors.onSurfaceVariant};
  margin-top: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

// ─── Error State ───────────────────────────────────────────────────────────────

const ErrorBanner = styled.div`
  background: #fff0ed;
  border: 1px solid #f5c1b2;
  border-radius: 0.5rem;
  padding: 1rem 1.5rem;
  color: ${portalTheme.colors.error};
  font-size: 0.9rem;
  margin-bottom: 2rem;
`;

// ─── Adapter: IApartment → Listing (card interface) ───────────────────────────

const toListingCard = (apt: any): Listing => ({
  id: apt.id,
  title: apt.title,
  location: apt.location,
  price: apt.pricePerNight,
  rating: 4.8 + Math.round(Math.random() * 2) / 10, // placeholder cho đến khi BE có rating
  imageUrl: apt.images?.[0] ?? image404,
  isExclusive: apt.pricePerNight > 500,
});

// ─── Dashboard Component ───────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
  const { listings, totalRecords, isLoading, isError } = useData();
  const { activeFilters, toggleFilter, handleLoadMore } = useActions();

  const cardListings: Listing[] = listings.map(toListingCard);

  return (
    <>
      {/* ── Hero + Search ── */}
      <DashboardSection>
        <HeroTitle>Khám phá các căn hộ tuyệt vời.</HeroTitle>
        <SearchBar />

        <FiltersRow>
          <FilterChip
            onClick={() => toggleFilter('Price Range')}
            $active={activeFilters.includes('Price Range')}
          >
            Mức giá <DownOutlined style={{ fontSize: '1.125rem' }} />
          </FilterChip>
          <FilterChip
            onClick={() => toggleFilter('Property Type')}
            $active={activeFilters.includes('Property Type')}
          >
            Loại căn hộ <DownOutlined style={{ fontSize: '1.125rem' }} />
          </FilterChip>
          <FilterChip
            onClick={() => toggleFilter('Pool Access')}
            $active={activeFilters.includes('Pool Access')}
          >
            {activeFilters.includes('Pool Access') && (
              <CheckOutlined style={{ fontSize: '1.125rem' }} />
            )}
            Có hồ bơi
          </FilterChip>
          <FilterChip
            onClick={() => toggleFilter('More Filters')}
            $active={activeFilters.includes('More Filters')}
          >
            Thêm bộ lọc <ControlOutlined style={{ fontSize: '1.125rem' }} />
          </FilterChip>
        </FiltersRow>
      </DashboardSection>

      {/* ── Quick Stats ── */}
      <DashboardSection>
        <StatsRow>
          <StatCard>
            <StatIconWrap $color={portalTheme.colors.primary}>
              <HomeOutlined />
            </StatIconWrap>
            <StatInfo>
              <StatValue>
                {isLoading ? <Skeleton.Input size="small" active /> : totalRecords}
              </StatValue>
              <StatLabel>Căn hộ hiện có</StatLabel>
            </StatInfo>
          </StatCard>

          <StatCard>
            <StatIconWrap $color="#4A90D9">
              <CalendarOutlined />
            </StatIconWrap>
            <StatInfo>
              <StatValue>
                <Link to="/bookings" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Đơn đặt của tôi
                </Link>
              </StatValue>
              <StatLabel>Xem danh sách đặt phòng</StatLabel>
            </StatInfo>
          </StatCard>

          <StatCard>
            <StatIconWrap $color="#639922">
              <CheckCircleOutlined />
            </StatIconWrap>
            <StatInfo>
              <StatValue>Tức thì</StatValue>
              <StatLabel>Xác nhận đặt phòng</StatLabel>
            </StatInfo>
          </StatCard>
        </StatsRow>
      </DashboardSection>

      {/* ── Listings Grid ── */}
      <DashboardSection>
        {isError && (
          <ErrorBanner>
            Không thể tải dữ liệu — vui lòng kiểm tra kết nối và thử lại.
          </ErrorBanner>
        )}

        {isLoading ? (
          <ListingsGrid>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                active
                paragraph={{ rows: 3 }}
                style={{ padding: '1rem' }}
              />
            ))}
          </ListingsGrid>
        ) : (
          <ListingsGrid>
            {cardListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </ListingsGrid>
        )}

        {!isLoading && cardListings.length > 0 && (
          <LoadMoreContainer>
            <LoadMoreBtn onClick={handleLoadMore}>
              Xem thêm căn hộ
              <DownOutlined style={{ fontSize: '1.25rem' }} />
            </LoadMoreBtn>
          </LoadMoreContainer>
        )}
      </DashboardSection>
    </>
  );
};

export default Dashboard;
