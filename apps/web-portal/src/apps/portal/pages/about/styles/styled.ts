import styled from 'styled-components';
import { portalTheme } from '../../../styled';
import { Link } from '@tanstack/react-router';

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

export const AboutWrapper = styled.div`
  max-width: 140rem;
  margin: 0 auto;
  padding: 4rem 4rem 8rem;
  font-family: ${portalTheme.typography.fontFamily};

  @media (max-width: 768px) {
    padding: 2rem 2rem 5rem;
  }
`;

export const HeroSection = styled.section`
  position: relative;
  border-radius: 2.4rem;
  background: linear-gradient(135deg, ${portalTheme.colors.primary} 0%, ${portalTheme.colors.primaryActive} 100%);
  padding: 8rem 6rem;
  margin-top: 2rem;
  margin-bottom: 8rem;
  color: white;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(153, 60, 29, 0.15);

  @media (max-width: 768px) {
    padding: 6rem 3rem;
    margin-top: 1.5rem;
    margin-bottom: 5rem;
    border-radius: 1.6rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 80rem;
    height: 80rem;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
    pointer-events: none;
  }
`;

export const HeroTitle = styled.h1`
  font-size: 5.2rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin: 0 0 2.5rem 0;
  max-width: 80rem;

  span {
    color: ${portalTheme.colors.surfaceContainerLow};
    background: linear-gradient(to right, #ffffff, ${portalTheme.colors.primaryHover});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 768px) {
    font-size: 3.6rem;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: 2rem;
  line-height: 1.6;
  font-weight: 400;
  max-width: 65rem;
  margin: 0;
  opacity: 0.9;
  color: #fffaf8;

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

export const EditorialSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 8rem;
  align-items: center;
  margin-bottom: 10rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 4rem;
    margin-bottom: 6rem;
  }
`;

export const ImageContainer = styled.div`
  position: relative;
  border-radius: 2rem;
  overflow: hidden;
  background-color: ${portalTheme.colors.surfaceContainerLow};
  box-shadow: 0 8px 30px rgba(74, 27, 12, 0.06);

  img {
    width: 100%;
    height: 48rem;
    object-fit: cover;
    display: block;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      transform: scale(1.03);
    }

    @media (max-width: 768px) {
      height: 32rem;
    }
  }
`;

export const EditorialContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

export const SectionLabel = styled.span`
  font-size: 1.3rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${portalTheme.colors.primary};
`;

export const SectionHeading = styled.h2`
  font-size: 3.6rem;
  font-weight: 700;
  line-height: 1.25;
  color: ${portalTheme.colors.onSurface};
  margin: 0;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`;

export const Paragraph = styled.p`
  font-size: 1.6rem;
  line-height: 1.7;
  color: ${portalTheme.colors.onSurfaceVariant};
  margin: 0;
`;

export const ValuesSection = styled.section`
  margin-bottom: 10rem;
  background-color: ${portalTheme.colors.surfaceContainerLow};
  padding: 8rem 6rem;
  border-radius: 2.4rem;

  @media (max-width: 768px) {
    padding: 5rem 3rem;
    margin-bottom: 6rem;
    border-radius: 1.6rem;
  }
`;

export const ValuesHeader = styled.div`
  text-align: center;
  max-width: 70rem;
  margin: 0 auto 6rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

export const ValueCard = styled.div`
  background-color: ${portalTheme.colors.surfaceContainerLowest};
  padding: 4rem;
  border-radius: 1.6rem;
  box-shadow: 0 4px 20px rgba(74, 27, 12, 0.03);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &:hover {
    transform: translateY(-0.4rem);
    box-shadow: 0 8px 30px rgba(216, 90, 48, 0.08);
  }

  @media (max-width: 768px) {
    padding: 3rem;
  }
`;

export const ValueIcon = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 1.2rem;
  background-color: ${portalTheme.colors.surfaceContainerLow};
  color: ${portalTheme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
`;

export const ValueTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: ${portalTheme.colors.onSurface};
  margin: 0;
  letter-spacing: -0.01em;
`;

export const ValueDesc = styled.p`
  font-size: 1.5rem;
  line-height: 1.6;
  color: ${portalTheme.colors.onSurfaceVariant};
  margin: 0;
`;

export const StatsSection = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4rem;
  text-align: center;
  margin-bottom: 10rem;
  padding: 0 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 3.5rem;
    margin-bottom: 6rem;
    padding: 0;
  }
`;

export const StatBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const StatNumber = styled.div`
  font-size: 6.4rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  color: ${portalTheme.colors.primary};
  background: linear-gradient(135deg, ${portalTheme.colors.primary} 0%, #993C1D 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 4.8rem;
  }
`;

export const StatLabel = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: ${portalTheme.colors.onSurface};
`;

export const PhilosophySection = styled.section`
  background: linear-gradient(135deg, ${portalTheme.colors.surfaceContainerLow} 0%, rgba(245, 240, 234, 0.4) 100%);
  border-radius: 2.4rem;
  padding: 6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6rem;

  @media (max-width: 992px) {
    flex-direction: column;
    padding: 5rem 3rem;
    gap: 3rem;
    text-align: center;
  }
`;

export const PhilosophyContent = styled.div`
  flex: 1.2;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const PhilosophyBadge = styled.div`
  align-self: flex-start;
  background-color: ${portalTheme.colors.surfaceContainerLowest};
  color: ${portalTheme.colors.primaryActive};
  padding: 0.6rem 1.6rem;
  border-radius: 9999px;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 15px rgba(74, 27, 12, 0.03);

  @media (max-width: 992px) {
    align-self: center;
  }
`;

export const PhilosophyVisual = styled.div`
  flex: 0.8;
  height: 25rem;
  width: 100%;
  border-radius: 1.6rem;
  background-color: ${portalTheme.colors.surfaceContainerLowest};
  box-shadow: 0 8px 32px rgba(153, 60, 29, 0.04);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  /* Artistic architectural outline layers representing the Clean White ethos without border lines */
  &::before {
    content: '';
    position: absolute;
    width: 75%;
    height: 75%;
    background-color: ${portalTheme.colors.surfaceContainerLow};
    border-radius: 1.2rem;
    transform: rotate(5deg);
  }

  &::after {
    content: '';
    position: absolute;
    width: 55%;
    height: 55%;
    background-color: ${portalTheme.colors.surfaceContainerLowest};
    border-radius: 0.8rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    transform: rotate(-5deg);
  }
`;
