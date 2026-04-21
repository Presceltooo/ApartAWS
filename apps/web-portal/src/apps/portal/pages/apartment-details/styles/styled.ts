import styled from 'styled-components';
import { portalTheme } from '../../../styled';

export const DetailSection = styled.section`
  margin-bottom: 3rem;
`;

export const TopBarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

export const BackLink = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: ${portalTheme.colors.onSurfaceVariant};
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;

  &:hover {
    color: ${portalTheme.colors.primary};
  }

  .material-symbols-outlined {
    font-size: 1.125rem;
  }
`;

export const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 1rem;
  background-color: ${portalTheme.colors.secondaryContainer};
  color: ${portalTheme.colors.onSecondaryContainer};
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;

  .material-symbols-outlined {
    font-size: 0.875rem;
  }
`;

export const PropertyTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${portalTheme.colors.onSurface};
  margin-bottom: 1.5rem;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 3rem;
  }

  @media (min-width: 1024px) {
    font-size: 3.5rem;
  }
`;

export const HeroImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: ${portalTheme.colors.surfaceContainerLow};

  @media (min-width: 768px) {
    height: 500px;
  }
`;

export const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const LocationFloatBadge = styled.div`
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  background: rgba(252, 249, 244, 0.8);
  backdrop-filter: blur(12px);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .material-symbols-outlined {
    color: ${portalTheme.colors.primary};
  }

  span:not(.material-symbols-outlined) {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${portalTheme.colors.onSurface};
  }
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

export const RightColumn = styled.div``;

export const BentoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

export const BentoBox = styled.div<{ $colSpan?: number }>`
  background-color: ${portalTheme.colors.surfaceContainerLow};
  padding: 1.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s;
  ${props => props.$colSpan ? `grid-column: span ${props.$colSpan};` : ''}
  
  &:hover {
    background-color: ${portalTheme.colors.surfaceBright};
  }
`;

export const BentoBoxGroupFlex = styled(BentoBox)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .material-symbols-outlined {
    font-size: 1.875rem;
    color: ${portalTheme.colors.outlineVariant};
  }
`;

export const BentoLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${portalTheme.colors.onSurfaceVariant};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
`;

export const BentoValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${portalTheme.colors.onSurface};
  margin-bottom: 0.25rem;
`;

export const BentoSubValue = styled.div`
  font-size: 0.875rem;
  color: ${portalTheme.colors.onSurfaceVariant};
  opacity: 0.8;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${portalTheme.colors.onSurface};
  margin-bottom: 1.5rem;
`;

export const SectionText = styled.p`
  font-size: 1.125rem;
  color: ${portalTheme.colors.onSurfaceVariant};
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

export const AmenitiesChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

export const AmenityChip = styled.span<{ $highlight?: boolean }>`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  background-color: ${props => props.$highlight ? portalTheme.colors.secondaryContainer : portalTheme.colors.surfaceContainerHighest};
  color: ${props => props.$highlight ? portalTheme.colors.onSecondaryContainer : portalTheme.colors.onSurface};

  .material-symbols-outlined {
    font-size: 1rem;
  }
`;

export const MapWrapper = styled.div`
  width: 100%;
  height: 300px;
  background-color: ${portalTheme.colors.surfaceContainerLow};
  border-radius: 0.5rem;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.8;
    filter: grayscale(100%) sepia(30%);
    mix-blend-mode: multiply;
  }

  .pin-wrapper {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pin-circle {
    width: 3rem;
    height: 3rem;
    background-color: ${portalTheme.colors.primary};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 20px 40px rgba(88,66,59,0.2);

    .material-symbols-outlined {
      color: ${portalTheme.colors.onPrimary};
    }
  }
`;

export const MapDisclaimer = styled.p`
  margin-top: 1rem;
  font-size: 0.875rem;
  color: ${portalTheme.colors.onSurfaceVariant};
  opacity: 0.8;
`;

// Widget Styles
export const StickyWidgetContainer = styled.aside`
  position: sticky;
  top: 8rem;
  background-color: ${portalTheme.colors.surfaceContainerLowest};
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(74, 27, 12, 0.06);
  border: 1px solid rgba(224, 192, 182, 0.15);
`;

export const WidgetTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${portalTheme.colors.onSurface};
  margin-bottom: 1.5rem;
`;

export const SummaryRow = styled.div<{ $isTotal?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  color: ${props => props.$isTotal ? portalTheme.colors.onSurface : portalTheme.colors.onSurfaceVariant};
  font-weight: ${props => props.$isTotal ? '700' : '500'};
  
  ${props => props.$isTotal && `
    padding-top: 1rem;
    margin-top: 1rem;
    border-top: 1px solid ${portalTheme.colors.surfaceContainerHighest};
  `}

  .price {
    color: ${props => props.$isTotal ? portalTheme.colors.primary : 'inherit'};
    font-size: ${props => props.$isTotal ? '1.25rem' : 'inherit'};
  }
`;

export const PaymentSuccessCard = styled.div`
  background-color: ${portalTheme.colors.surfaceContainerLow};
  padding: 1rem;
  border-radius: 0.25rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;

  .material-symbols-outlined {
    color: ${portalTheme.colors.outline};
  }

  .title {
    font-weight: 500;
    color: ${portalTheme.colors.onSurface};
    margin: 0 0 0.25rem 0;
    font-size: 0.875rem;
  }
  
  .desc {
    margin: 0;
    font-size: 0.875rem;
    color: ${portalTheme.colors.onSurfaceVariant};
  }
`;

export const WidgetPrimaryBtn = styled.button`
  width: 100%;
  background: linear-gradient(135deg, ${portalTheme.colors.primary}, ${portalTheme.colors.primaryContainer});
  color: ${portalTheme.colors.onPrimary};
  padding: 1rem;
  border-radius: 0.25rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

export const WidgetSecondaryBtn = styled(WidgetPrimaryBtn)`
  background: ${portalTheme.colors.surfaceContainerHighest};
  color: ${portalTheme.colors.onSurface};
  font-weight: 500;
  
  &:hover {
    background: ${portalTheme.colors.surfaceContainerHighest};
    opacity: 1;
  }
`;
