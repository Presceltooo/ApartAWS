import styled from 'styled-components';
import { portalTheme } from '../../../styled';
import { Button } from 'antd';

export const ProfileWrapper = styled.div`
  max-width: 110rem;
  margin: 0 auto;
  padding: 3rem 2rem 5rem;
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2.5rem;
  margin-bottom: 3.5rem;
  background: ${portalTheme.colors.surfaceContainerLow};
  padding: 3rem;
  border-radius: 1.6rem;
  border: 1px solid rgba(224, 192, 182, 0.2);

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
    padding: 2.5rem;
    gap: 1.5rem;
  }
`;

export const AvatarCircle = styled.div`
  width: 9rem;
  height: 9rem;
  border-radius: 50%;
  background: linear-gradient(135deg, ${portalTheme.colors.primary} 0%, #993C1D 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.6rem;
  font-weight: 700;
  box-shadow: 0 6px 20px rgba(216, 90, 48, 0.25);
  border: 3px solid ${portalTheme.colors.surfaceContainerLowest};
  letter-spacing: -0.02em;
  text-transform: uppercase;
`;

export const ProfileInfo = styled.div`
  flex-grow: 1;
`;

export const ProfileName = styled.h1`
  font-size: 2.8rem;
  font-weight: 700;
  color: ${portalTheme.colors.onSurface};
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
`;

export const ProfileEmail = styled.p`
  font-size: 1.5rem;
  color: ${portalTheme.colors.onSurfaceVariant};
  margin: 0 0 0.8rem 0;
`;

export const RoleBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 1.2rem;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 9999px;
  background: ${portalTheme.colors.surfaceContainerHighest};
  color: ${portalTheme.colors.primary};
  border: 1px solid ${portalTheme.colors.outlineVariant}30;
`;

export const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 3rem;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

export const ProfileCard = styled.div`
  background: ${portalTheme.colors.surfaceContainerLowest};
  border-radius: 1.2rem;
  padding: 3rem;
  border: 1px solid rgba(224, 192, 182, 0.25);
  box-shadow: 0 4px 20px rgba(74, 27, 12, 0.04);
`;

export const CardTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: ${portalTheme.colors.primary};
  margin: 0 0 1rem 0;
  letter-spacing: -0.01em;
`;

export const CardSubtitle = styled.p`
  font-size: 1.4rem;
  color: ${portalTheme.colors.onSurfaceVariant};
  margin: 0 0 2.5rem 0;
`;

export const FormSectionTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  color: ${portalTheme.colors.onSurface};
  border-bottom: 1px solid ${portalTheme.colors.outlineVariant}20;
  padding-bottom: 0.8rem;
  margin-top: 1rem;
  margin-bottom: 2rem;
`;

export const SaveButton = styled(Button)`
  width: 100%;
  height: 4.8rem !important;
  font-size: 1.5rem !important;
  font-weight: 700 !important;
  border-radius: 0.6rem !important;
  background: linear-gradient(135deg, ${portalTheme.colors.primary} 0%, #993C1D 100%) !important;
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
