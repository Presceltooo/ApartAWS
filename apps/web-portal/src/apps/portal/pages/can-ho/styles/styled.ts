import styled from 'styled-components';
import { portalTheme } from '../../../styled';

export const PageWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
`;

export const PageHeader = styled.div`
  margin-bottom: 2.5rem;
`;

export const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 300;
  letter-spacing: -0.02em;
  color: ${portalTheme.colors.onSurface};
  margin-bottom: 0.5rem;
`;

export const PageSubtitle = styled.p`
  color: ${portalTheme.colors.onSurfaceVariant};
  font-size: 1rem;
`;

export const SearchRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const Card = styled.article`
  background: ${portalTheme.colors.surfaceContainerLowest};
  border: 1px solid rgba(224, 192, 182, 0.2);
  border-radius: 0.75rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: box-shadow 0.25s, transform 0.25s;
  box-shadow: 0 2px 12px rgba(74, 27, 12, 0.04);

  &:hover {
    box-shadow: 0 12px 32px rgba(74, 27, 12, 0.12);
    transform: translateY(-2px);

    .card-img {
      transform: scale(1.05);
    }
  }
`;

export const CardImgWrapper = styled.div`
  position: relative;
  height: 14rem;
  overflow: hidden;
  background: #e5e2dd;
`;

export const CardImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease-out;
`;

export const CardImgFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${portalTheme.colors.onSurfaceVariant};
  font-size: 3rem;
`;

export const WishlistBtn = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(252, 249, 244, 0.85);
  backdrop-filter: blur(8px);
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${portalTheme.colors.primary};
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s;

  &:hover {
    background: white;
  }
`;

export const PriceBadge = styled.div`
  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  background: rgba(74, 27, 12, 0.75);
  backdrop-filter: blur(8px);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
`;

export const CardBody = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const CardTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: ${portalTheme.colors.onSurface};
  margin: 0 0 0.375rem;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardLocation = styled.p`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${portalTheme.colors.onSurfaceVariant};
  font-size: 0.8125rem;
  margin: 0 0 0.75rem;
`;

export const AmenitiesRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 1rem;
`;

export const CardFooter = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid ${portalTheme.colors.outlineVariant};
`;

export const RatingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${portalTheme.colors.onSurface};

  .ant-star {
    color: ${portalTheme.colors.primary};
  }
`;

export const ViewBtn = styled.button`
  background: ${portalTheme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.375rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.88;
  }
`;

export const PaginationWrapper = styled.div`
  margin-top: 3rem;
  display: flex;
  justify-content: center;
`;

export const ResultsCount = styled.div`
  font-size: 0.875rem;
  color: ${portalTheme.colors.onSurfaceVariant};
  margin-bottom: 1.5rem;
`;
