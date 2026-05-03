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

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=600&q=80',
];

const toListingCard = (apt: any, idx: number): Listing => ({
  id: apt.id,
  title: apt.title,
  location: apt.location,
  price: apt.pricePerNight,
  rating: 4.8 + Math.round(Math.random() * 2) / 10, // placeholder cho đến khi BE có rating
  imageUrl: apt.images?.[0] ?? PLACEHOLDER_IMAGES[idx % PLACEHOLDER_IMAGES.length],
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
        <HeroTitle>Discover Sanctuaries.</HeroTitle>
        <SearchBar />

        <FiltersRow>
          <FilterChip
            onClick={() => toggleFilter('Price Range')}
            $active={activeFilters.includes('Price Range')}
          >
            Price Range <DownOutlined style={{ fontSize: '1.125rem' }} />
          </FilterChip>
          <FilterChip
            onClick={() => toggleFilter('Property Type')}
            $active={activeFilters.includes('Property Type')}
          >
            Property Type <DownOutlined style={{ fontSize: '1.125rem' }} />
          </FilterChip>
          <FilterChip
            onClick={() => toggleFilter('Pool Access')}
            $active={activeFilters.includes('Pool Access')}
          >
            {activeFilters.includes('Pool Access') && (
              <CheckOutlined style={{ fontSize: '1.125rem' }} />
            )}
            Pool Access
          </FilterChip>
          <FilterChip
            onClick={() => toggleFilter('More Filters')}
            $active={activeFilters.includes('More Filters')}
          >
            More Filters <ControlOutlined style={{ fontSize: '1.125rem' }} />
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
              <StatLabel>Available Properties</StatLabel>
            </StatInfo>
          </StatCard>

          <StatCard>
            <StatIconWrap $color="#4A90D9">
              <CalendarOutlined />
            </StatIconWrap>
            <StatInfo>
              <StatValue>
                <Link to="/bookings" style={{ color: 'inherit', textDecoration: 'none' }}>
                  My Bookings
                </Link>
              </StatValue>
              <StatLabel>View Your Reservations</StatLabel>
            </StatInfo>
          </StatCard>

          <StatCard>
            <StatIconWrap $color="#639922">
              <CheckCircleOutlined />
            </StatIconWrap>
            <StatInfo>
              <StatValue>Instant</StatValue>
              <StatLabel>Booking Confirmation</StatLabel>
            </StatInfo>
          </StatCard>
        </StatsRow>
      </DashboardSection>

      {/* ── Listings Grid ── */}
      <DashboardSection>
        {isError && (
          <ErrorBanner>
            Unable to load listings — please check your connection or try again.
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
              Load More Sanctuaries
              <DownOutlined style={{ fontSize: '1.25rem' }} />
            </LoadMoreBtn>
          </LoadMoreContainer>
        )}
      </DashboardSection>
    </>
  );
};

export default Dashboard;
