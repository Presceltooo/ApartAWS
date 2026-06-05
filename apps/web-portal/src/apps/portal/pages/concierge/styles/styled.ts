import styled from 'styled-components';
import { portalTheme } from '../../../styled';
import { Link } from '@tanstack/react-router';
import { Button } from 'antd';

export const ConciergeWrapper = styled.div`
  max-width: 140rem;
  margin: 0 auto;
  padding: 4rem 4rem 8rem;
  font-family: ${portalTheme.typography.fontFamily};

  @media (max-width: 768px) {
    padding: 2rem 2rem 5rem;
  }
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

export const HeroSection = styled.section`
  position: relative;
  border-radius: 2.4rem;
  background: linear-gradient(135deg, ${portalTheme.colors.primary} 0%, ${portalTheme.colors.primaryActive} 100%);
  padding: 8rem 6rem;
  margin-top: 2rem;
  margin-bottom: 6rem;
  color: white;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(153, 60, 29, 0.15);

  @media (max-width: 768px) {
    padding: 6rem 3rem;
    margin-top: 1.5rem;
    margin-bottom: 4rem;
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

export const IntroSection = styled.section`
  text-align: center;
  max-width: 80rem;
  margin: 0 auto 6rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

export const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  margin-bottom: 8rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

export const ServiceCard = styled.div`
  background-color: ${portalTheme.colors.surfaceContainerLowest};
  padding: 4rem;
  border-radius: 1.6rem;
  box-shadow: 0 4px 20px rgba(74, 27, 12, 0.03);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  border: 1px solid rgba(224, 192, 182, 0.15);
  cursor: pointer;

  &:hover {
    transform: translateY(-0.5rem);
    box-shadow: 0 8px 30px rgba(216, 90, 48, 0.08);
  }

  &:active {
    transform: scale(0.985);
  }

  @media (max-width: 768px) {
    padding: 3rem;
  }
`;

export const CardHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const ServiceIcon = styled.div`
  width: 6rem;
  height: 6rem;
  border-radius: 1.6rem;
  background-color: ${portalTheme.colors.surfaceContainerLow};
  color: ${portalTheme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.6rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);
`;

export const ServiceBadge = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  background-color: ${portalTheme.colors.primaryContainer};
  color: ${portalTheme.colors.primaryActive};
  border: 1px solid rgba(153, 60, 29, 0.1);
`;

export const ServiceTitle = styled.h3`
  font-size: 2.2rem;
  font-weight: 700;
  color: ${portalTheme.colors.onSurface};
  margin: 0;
  letter-spacing: -0.01em;
`;

export const ServiceDesc = styled.p`
  font-size: 1.5rem;
  line-height: 1.6;
  color: ${portalTheme.colors.onSurfaceVariant};
  margin: 0;
`;

export const ServiceMeta = styled.span`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${portalTheme.colors.primary};
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const RequestSection = styled.section`
  background-color: ${portalTheme.colors.surfaceContainerLow};
  padding: 8rem 6rem;
  border-radius: 2.4rem;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 6rem;
  align-items: center;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    padding: 5rem 3rem;
    gap: 4rem;
  }
`;

export const RequestInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const FormCard = styled.div`
  background-color: ${portalTheme.colors.surfaceContainerLowest};
  padding: 4.5rem;
  border-radius: 2rem;
  box-shadow: 0 12px 40px rgba(74, 27, 12, 0.04);
  border: 1px solid rgba(224, 192, 182, 0.15);

  /* Force all form inputs/selects/textareas to 100% width */
  .ant-form-item {
    width: 100%;
    margin-bottom: 1.8rem;
  }

  .ant-form-item-control-input,
  .ant-form-item-control-input-content {
    width: 100%;
  }

  .ant-input-affix-wrapper,
  .ant-input,
  .ant-select,
  .ant-select-selector {
    width: 100% !important;
  }

  .ant-input[type='text'],
  .ant-input[type='tel'] {
    width: 100% !important;
  }

  textarea.ant-input {
    width: 100% !important;
    min-height: 14rem !important;
    resize: vertical;
  }

  @media (max-width: 768px) {
    padding: 3rem;
  }
`;

export const FormTitle = styled.h3`
  font-size: 2.4rem;
  font-weight: 700;
  color: ${portalTheme.colors.onSurface};
  margin: 0 0 2.5rem 0;
  letter-spacing: -0.01em;
`;

export const SubmitButton = styled(Button)`
  width: 100%;
  height: 5rem !important;
  font-size: 1.6rem !important;
  font-weight: 700 !important;
  border-radius: 0.8rem !important;
  background: linear-gradient(135deg, ${portalTheme.colors.primary} 0%, ${portalTheme.colors.primaryActive} 100%) !important;
  border: none !important;
  box-shadow: 0 4px 15px rgba(216, 90, 48, 0.25) !important;
  color: white !important;
  transition: opacity 0.2s, transform 0.1s !important;

  &:hover {
    opacity: 0.9 !important;
    color: white !important;
  }

  &:active {
    transform: scale(0.985) !important;
  }
`;
