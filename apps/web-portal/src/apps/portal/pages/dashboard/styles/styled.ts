import styled from 'styled-components';
import { portalTheme } from '../../../styled';

export const DashboardSection = styled.section`
  margin-top: 2rem;
  margin-bottom: 3rem;
`;

export const HeroTitle = styled.h1`
  font-size: 3.5rem;
  line-height: 1;
  letter-spacing: -0.02em;
  font-weight: 300;
  margin-bottom: 2rem;
  color: ${portalTheme.colors.onSurface};
`;

export const SearchBarContainer = styled.div`
  background-color: ${portalTheme.colors.surfaceContainerLowest};
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 20px 40px rgba(74, 27, 12, 0.06);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

export const SearchFieldBox = styled.div`
  flex: 1;
  width: 100%;
`;

export const SearchLabel = styled.label`
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${portalTheme.colors.onSurfaceVariant};
  margin-bottom: 0.5rem;
`;

export const SearchInputWrapper = styled.div`
  position: relative;

  .material-symbols-outlined {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${portalTheme.colors.onSurfaceVariant};
    pointer-events: none;
  }

  &.select-wrapper .material-symbols-outlined.right-icon {
    left: auto;
    right: 0.75rem;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  background-color: ${portalTheme.colors.surfaceContainerHigh};
  border: 1px solid rgba(224, 192, 182, 0.15);
  color: ${portalTheme.colors.onSurface};
  font-size: 1rem;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: ${portalTheme.colors.primary};
    box-shadow: 0 0 0 1px ${portalTheme.colors.primary};
  }
`;

export const SearchSelect = styled.select`
  width: 100%;
  background-color: ${portalTheme.colors.surfaceContainerHigh};
  border: 1px solid rgba(224, 192, 182, 0.15);
  color: ${portalTheme.colors.onSurface};
  font-size: 1rem;
  border-radius: 0.5rem;
  padding: 0.75rem 2.5rem 0.75rem 2.5rem;
  appearance: none;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: ${portalTheme.colors.primary};
    box-shadow: 0 0 0 1px ${portalTheme.colors.primary};
  }
`;

export const SearchSubmitBtn = styled.button`
  width: 100%;
  background: linear-gradient(to bottom right, ${portalTheme.colors.primary}, ${portalTheme.colors.primaryContainer});
  color: ${portalTheme.colors.onPrimary};
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  @media (min-width: 768px) {
    width: auto;
  }
`;

export const FiltersRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

export const FilterChip = styled.button<{ $active?: boolean }>`
  background-color: ${props => props.$active ? portalTheme.colors.secondaryContainer : portalTheme.colors.surfaceContainerHighest};
  color: ${props => props.$active ? portalTheme.colors.onSecondaryContainer : portalTheme.colors.onSurface};
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  border: ${props => props.$active ? 'none' : '1px solid rgba(224, 192, 182, 0.15)'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: ${props => props.$active ? 0.8 : 1};
    background-color: ${props => props.$active ? portalTheme.colors.secondaryContainer : '#e5e2dd'};
  }
`;

export const ListingsGrid = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const ListingCard = styled.article`
  background-color: ${portalTheme.colors.surfaceContainerLowest};
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(224, 192, 182, 0.15);
  box-shadow: 0 4px 20px rgba(74, 27, 12, 0.02);
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${portalTheme.colors.surfaceBright};

    .listing-img {
      transform: scale(1.05);
    }
  }
`;

export const ListingImgWrapper = styled.div`
  position: relative;
  height: 16rem;
  overflow: hidden;
`;

export const ListingImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease-out;
`;

export const FavoriteBtn = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: rgba(252, 249, 244, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 50%;
  padding: 0.5rem;
  color: ${portalTheme.colors.primary};
  border: none;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const ExclusiveBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: rgba(216, 90, 48, 0.9);
  color: ${portalTheme.colors.onPrimary};
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.25rem 0.75rem;
  border-radius: 0.125rem;
`;

export const ListingContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const ListingHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

export const ListingTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 500;
  color: ${portalTheme.colors.onSurface};
  margin: 0;
  line-height: 1.3;
`;

export const ListingLocation = styled.p`
  color: ${portalTheme.colors.onSurfaceVariant};
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
`;

export const ListingRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${portalTheme.colors.onSurface};
  font-size: 0.875rem;
  font-weight: 500;

  .star {
    font-size: 1rem;
    color: ${portalTheme.colors.onSurface};
  }
`;

export const ListingFooter = styled.div`
  margin-top: auto;
`;

export const PriceLabel = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${portalTheme.colors.onSurfaceVariant};
  margin-bottom: 0.25rem;
`;

export const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

export const PriceAmount = styled.div`
  font-size: 1.25rem;
  font-weight: 500;
  color: ${portalTheme.colors.onSurface};

  span {
    font-size: 0.875rem;
    color: ${portalTheme.colors.onSurfaceVariant};
    font-weight: 400;
  }
`;

export const ViewDetailsBtn = styled.button`
  color: ${portalTheme.colors.primary};
  font-weight: 500;
  font-size: 0.875rem;
  border: none;
  background: transparent;
  padding: 0 0 0.125rem 0;
  border-bottom: 1px solid transparent;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${portalTheme.colors.primary};
  }
`;

export const LoadMoreContainer = styled.div`
  margin-top: 4rem;
  text-align: center;
`;

export const LoadMoreBtn = styled.button`
  background-color: ${portalTheme.colors.surfaceContainerLowest};
  color: ${portalTheme.colors.primary};
  border: 1px solid rgba(224, 192, 182, 0.3);
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 10px 20px rgba(74, 27, 12, 0.03);
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${portalTheme.colors.surfaceBright};
  }
`;
