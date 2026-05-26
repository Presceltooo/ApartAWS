import styled from 'styled-components';
import { portalTheme } from '../styled';

export const HomeWrapper = styled.div`
  background-color: ${portalTheme.colors.surface};
  color: ${portalTheme.colors.onSurface};
  min-height: 100vh;
`;

export const HeroSection = styled.section`
  position: relative;
  padding: 6rem 4rem 8rem;
  overflow: hidden;
  text-align: center;
  max-width: 140rem;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding: 8rem 4rem 10rem;
  }
`;

export const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: 0.01em;
  margin-bottom: 2.5rem;
  max-width: 80rem;
  margin-left: auto;
  margin-right: auto;

  @media (min-width: 768px) {
    font-size: 5.5rem;
  }

  span {
    color: ${portalTheme.colors.primary};
  }
`;

export const HeroSearchBar = styled.div`
  width: 100%;
  max-width: 96rem;
  margin: 2rem auto 0;
  background-color: ${portalTheme.colors.surfaceContainerLowest};
  padding: 0.5rem;
  border-radius: 9999px;
  box-shadow: 0 4px 20px rgba(74, 27, 12, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

export const SearchItem = styled.div<{ $border?: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  ${props => props.$border ? `border-right: 1px solid rgba(133, 115, 110, 0.2);` : ''}
  width: 100%;
  text-align: left;

  @media (max-width: 767px) {
    border-right: none;
    border-bottom: ${props => props.$border ? '1px solid rgba(133, 115, 110, 0.1)' : 'none'};
  }

  .material-symbols-outlined, .anticon {
    font-size: 2rem;
    color: ${portalTheme.colors.primary};
    margin-right: 1rem;
  }
`;

export const SearchLabel = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LabelText = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${portalTheme.colors.outline};
  white-space: nowrap;
`;

export const ValueInput = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  padding: 0;
  color: ${portalTheme.colors.onSurface};
  font-weight: 500;
  font-size: 1.6rem;
  outline: none;

  &::placeholder {
    color: rgba(133, 115, 110, 0.5);
  }
`;

export const SearchBtn = styled.button`
  background: linear-gradient(135deg, #D85A30 0%, #993C1D 100%);
  color: white;
  padding: 1.2rem 2.8rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 767px) {
    width: 100%;
  }
`;

export const GridSection = styled.section`
  padding: 0 4rem 6rem;
  max-width: 140rem;
  margin: 0 auto;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
`;

export const SectionTitleWrapper = styled.div`
  h2 {
    font-size: 2.8rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    letter-spacing: -0.01em;
  }
  p {
    color: ${portalTheme.colors.onSurfaceVariant};
    font-size: 1.6rem;
    max-width: 48rem;
  }
`;

export const ResidencesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
`;

export const ResidenceCard = styled.div`
  background-color: ${portalTheme.colors.surfaceContainerLow};
  border-radius: 0.75rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 10px 30px rgba(216, 90, 48, 0.08);

    img {
      transform: scale(1.05);
    }
  }
`;

export const CardImgWrapper = styled.div`
  position: relative;
  height: 22rem;
  overflow: hidden;
`;

export const CardImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
`;

export const RatingBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 1.4rem;
  font-weight: 700;

  .star {
    color: ${portalTheme.colors.primary};
    font-size: 1.4rem;
  }
`;

export const CardContent = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const CardTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;

  h3 {
    font-size: 1.8rem;
    font-weight: 700;
    line-height: 1.2;
    max-width: 70%;
  }

  span {
    font-weight: 600;
    font-size: 1.6rem;
    color: ${portalTheme.colors.onSurfaceVariant};
  }
`;

export const CardDesc = styled.p`
  font-size: 1.4rem;
  color: ${portalTheme.colors.outline};
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const CardFooter = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StatusTag = styled.span<{ $type: 'available' | 'rare' | 'verified' | 'new' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${props => {
    switch(props.$type) {
      case 'available': return `background-color: ${portalTheme.colors.surfaceContainerHigh}; color: ${portalTheme.colors.onSecondaryContainer};`;
      case 'rare': return `background-color: ${portalTheme.colors.error}; color: white;`;
      case 'verified': return `background-color: ${portalTheme.colors.surfaceContainerLow}; color: ${portalTheme.colors.onSurfaceVariant};`;
      case 'new': return `background-color: ${portalTheme.colors.primaryContainer}; color: white;`;
    }
  }}
`;

export const ViewDetailsBtn = styled.button`
  color: ${portalTheme.colors.primary};
  font-weight: 700;
  font-size: 1.5rem;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
`;

export const PromoSection = styled.section`
  padding: 0 4rem 6rem;
  max-width: 140rem;
  margin: 0 auto;
`;

export const PromoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr;
  }
`;

export const RewardsCard = styled.div`
  background-color: #FFDBCF;
  border-radius: 1rem;
  padding: 3rem;
  color: #370E01;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h3 {
    font-size: 3rem;
    font-weight: 900;
    margin-bottom: 1.2rem;
    position: relative;
    z-index: 10;
  }

  p {
    font-size: 1.6rem;
    opacity: 0.8;
    margin-bottom: 2.5rem;
    max-width: 36rem;
    position: relative;
    z-index: 10;
  }

  button {
    background-color: white;
    color: ${portalTheme.colors.primary};
    padding: 1rem 2.5rem;
    border-radius: 9999px;
    font-weight: 700;
    font-size: 1.5rem;
    width: fit-content;
    position: relative;
    z-index: 10;
    border: none;
    cursor: pointer;
    transition: box-shadow 0.2s;

    &:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
  }

  .blob {
    position: absolute;
    right: -5rem;
    bottom: -5rem;
    width: 20rem;
    height: 20rem;
    background-color: rgba(216, 90, 48, 0.2);
    border-radius: 50%;
    filter: blur(60px);
  }
`;

export const VerifiedCard = styled.div`
  background-color: #F3E2A8;
  border-radius: 1rem;
  padding: 3rem;
  color: #211B00;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .material-symbols-outlined {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 1.2rem;
  }

  p {
    font-size: 1.4rem;
    opacity: 0.8;
  }

  .trust-label {
    margin-top: 2rem;
    font-size: 2.4rem;
    font-weight: 900;
  }
`;
