import styled from 'styled-components';
import { portalTheme } from '../../../styled';
import { Link } from '@tanstack/react-router';

export const BookingsPageWrapper = styled.div`
  max-width: 140rem;
  margin: 0 auto;
  padding: 4rem 4rem 6rem;
`;

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.4rem;
  font-weight: 600;
  color: ${portalTheme.colors.onSurfaceVariant};
  background-color: ${portalTheme.colors.surfaceContainerLowest};
  border: 1px solid ${portalTheme.colors.outlineVariant};
  cursor: pointer;
  padding: 0.8rem 1.6rem;
  border-radius: 0.8rem;
  box-shadow: 0 2px 8px rgba(74, 27, 12, 0.03);
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  margin-bottom: 2rem;

  &:hover {
    border-color: ${portalTheme.colors.primary};
    color: ${portalTheme.colors.primary};
    background-color: rgba(216, 90, 48, 0.04);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(216, 90, 48, 0.08);
  }

  &:active {
    transform: translateY(0);
  }

  .anticon {
    font-size: 1.3rem;
  }
`;

export const PageHeader = styled.header`
  margin-bottom: 3.5rem;
`;

export const PageTitle = styled.h1`
  font-size: 3.2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${portalTheme.colors.onSurface};
  margin-bottom: 0.8rem;
`;

export const PageSubtitle = styled.p`
  font-size: 1.6rem;
  color: ${portalTheme.colors.onSurfaceVariant};
`;

export const TabsRow = styled.div`
  display: flex;
  gap: 2.5rem;
  border-bottom: 1px solid ${portalTheme.colors.outlineVariant}20;
  margin-bottom: 3.5rem;
`;

export const TabBtn = styled.button<{ $active?: boolean }>`
  background: transparent;
  border: none;
  padding: 1.2rem 0;
  font-size: 1.6rem;
  font-weight: 600;
  color: ${props => props.$active ? portalTheme.colors.primary : portalTheme.colors.onSurfaceVariant};
  border-bottom: 2px solid ${props => props.$active ? portalTheme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${portalTheme.colors.primary};
  }
`;

export const BookingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

export const BookingCard = styled.div`
  background-color: ${portalTheme.colors.surfaceContainerLowest};
  border-radius: 0.8rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(224, 192, 182, 0.15);
  box-shadow: 0 4px 20px rgba(74, 27, 12, 0.03);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(74, 27, 12, 0.06);
  }

  @media (min-width: 992px) {
    flex-direction: row;
    min-height: 22rem;
  }
`;

export const BookingImgWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 20rem;
  flex-shrink: 0;

  @media (min-width: 992px) {
    width: 32rem;
    height: auto;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const StatusBadge = styled.div<{ $status: 'upcoming' | 'completed' | 'cancelled' }>`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  padding: 0.5rem 1.2rem;
  border-radius: 0.4rem;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  background-color: ${props => {
    switch(props.$status) {
      case 'upcoming': return portalTheme.colors.primary;
      case 'completed': return '#4a6741';
      case 'cancelled': return '#8c7169';
      default: return portalTheme.colors.surfaceContainerHighest;
    }
  }};
  color: ${portalTheme.colors.onPrimary};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

export const BookingContent = styled.div`
  padding: 2.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
`;

export const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
`;

export const PropertyName = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: ${portalTheme.colors.onSurface};
  margin: 0 0 0.6rem 0;
  line-height: 1.2;
`;

export const LocationText = styled.p`
  margin: 0;
  color: ${portalTheme.colors.onSurfaceVariant};
  font-size: 1.5rem;
`;

export const BookingCode = styled.span`
  font-family: monospace;
  font-size: 1.3rem;
  font-weight: 600;
  color: ${portalTheme.colors.outline};
  background-color: ${portalTheme.colors.surfaceContainerLow};
  padding: 0.4rem 0.8rem;
  border-radius: 0.4rem;
  white-space: nowrap;
`;

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: auto;

  @media (min-width: 576px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const DetailItem = styled.div`
  label {
    display: block;
    font-size: 1.2rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${portalTheme.colors.onSurfaceVariant};
    margin-bottom: 0.6rem;
  }
  div {
    font-size: 1.8rem;
    font-weight: 600;
    color: ${portalTheme.colors.onSurface};
  }
`;

export const BookingActions = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

export const ActionBtn = styled.button<{ $primary?: boolean }>`
  padding: 1rem 2.2rem;
  border-radius: 0.6rem;
  font-size: 1.4rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  background-color: ${props => props.$primary ? portalTheme.colors.primary : 'transparent'};
  color: ${props => props.$primary ? portalTheme.colors.onPrimary : portalTheme.colors.onSurface};
  border: 1px solid ${props => props.$primary ? portalTheme.colors.primary : portalTheme.colors.outlineVariant};

  &:hover {
    opacity: 0.9;
    border-color: ${portalTheme.colors.primary};
    background-color: ${props => props.$primary ? '' : 'rgba(216, 90, 48, 0.04)'};
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 8rem 2rem;
  background-color: ${portalTheme.colors.surfaceContainerLowest};
  border-radius: 0.8rem;
  border: 1px dashed ${portalTheme.colors.outlineVariant};

  .material-symbols-outlined, .anticon {
    font-size: 5rem;
    color: ${portalTheme.colors.outlineVariant};
    margin-bottom: 2rem;
  }

  h3 {
    font-size: 2.2rem;
    margin-bottom: 1.2rem;
    color: ${portalTheme.colors.onSurface};
    font-weight: 700;
  }

  p {
    font-size: 1.6rem;
    color: ${portalTheme.colors.onSurfaceVariant};
    max-width: 45rem;
    margin: 0 auto 2.5rem;
    line-height: 1.5;
  }

  button {
    background-color: ${portalTheme.colors.primary};
    color: ${portalTheme.colors.onPrimary};
    padding: 1rem 3rem;
    border-radius: 0.6rem;
    border: none;
    font-size: 1.5rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      opacity: 0.9;
    }

    &:active {
      transform: scale(0.98);
    }
  }
`;
