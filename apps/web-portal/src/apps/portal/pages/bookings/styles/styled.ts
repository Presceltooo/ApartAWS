import styled from 'styled-components';
import { portalTheme } from '../../../styled';

export const BookingsPageWrapper = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem;
`;

export const PageHeader = styled.header`
  margin-bottom: 3rem;
`;

export const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 300;
  letter-spacing: -0.02em;
  color: ${portalTheme.colors.onSurface};
  margin-bottom: 0.5rem;
`;

export const PageSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${portalTheme.colors.onSurfaceVariant};
`;

export const TabsRow = styled.div`
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid ${portalTheme.colors.surfaceContainerHighest};
  margin-bottom: 3rem;
`;

export const TabBtn = styled.button<{ $active?: boolean }>`
  background: transparent;
  border: none;
  padding: 1rem 0;
  font-size: 1rem;
  font-weight: 500;
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
  gap: 2rem;
`;

export const BookingCard = styled.div`
  background-color: ${portalTheme.colors.surfaceContainerLowest};
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(224, 192, 182, 0.15);
  box-shadow: 0 4px 20px rgba(74, 27, 12, 0.02);

  @media (min-width: 768px) {
    flex-direction: row;
    height: 18rem;
  }
`;

export const BookingImgWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 12rem;

  @media (min-width: 768px) {
    width: 24rem;
    height: 100%;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const StatusBadge = styled.div<{ $status: 'upcoming' | 'completed' | 'cancelled' }>`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 0.125rem;
  font-size: 0.75rem;
  font-weight: 600;
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
`;

export const BookingContent = styled.div`
  padding: 2rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

export const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
`;

export const PropertyName = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${portalTheme.colors.onSurface};
  margin: 0 0 0.25rem 0;
`;

export const LocationText = styled.p`
  margin: 0;
  color: ${portalTheme.colors.onSurfaceVariant};
  font-size: 0.875rem;
`;

export const BookingCode = styled.span`
  font-family: monospace;
  font-size: 0.875rem;
  color: ${portalTheme.colors.outline};
  background-color: ${portalTheme.colors.surfaceContainerLow};
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
`;

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: auto;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const DetailItem = styled.div`
  label {
    display: block;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${portalTheme.colors.onSurfaceVariant};
    margin-bottom: 0.25rem;
  }
  div {
    font-weight: 500;
    color: ${portalTheme.colors.onSurface};
  }
`;

export const BookingActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
`;

export const ActionBtn = styled.button<{ $primary?: boolean }>`
  padding: 0.625rem 1.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  background-color: ${props => props.$primary ? portalTheme.colors.primary : 'transparent'};
  color: ${props => props.$primary ? portalTheme.colors.onPrimary : portalTheme.colors.onSurface};
  border: 1px solid ${props => props.$primary ? portalTheme.colors.primary : portalTheme.colors.outlineVariant};

  &:hover {
    opacity: 0.9;
    border-color: ${portalTheme.colors.primary};
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 5rem 2rem;
  background-color: ${portalTheme.colors.surfaceContainerLowest};
  border-radius: 0.5rem;
  border: 1px dashed ${portalTheme.colors.outlineVariant};

  .material-symbols-outlined {
    font-size: 4rem;
    color: ${portalTheme.colors.outlineVariant};
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: ${portalTheme.colors.onSurface};
  }

  p {
    color: ${portalTheme.colors.onSurfaceVariant};
    max-width: 30rem;
    margin: 0 auto 2rem;
  }

  button {
    background-color: ${portalTheme.colors.primary};
    color: ${portalTheme.colors.onPrimary};
    padding: 0.75rem 2rem;
    border-radius: 0.25rem;
    border: none;
    font-weight: 600;
    cursor: pointer;
  }
`;
