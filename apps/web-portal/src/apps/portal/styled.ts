import styled from 'styled-components';

// ============================================================
// PORTAL STYLES (Aura Heritage Theme)
// ============================================================

const theme = {
  colors: {
    primary: '#D85A30',        // Terracotta
    primaryHover: '#F0997B',   // Terracotta Lt
    primaryActive: '#993C1D',  // Terracotta Dk
    primaryContainer: '#F0997B', // Terracotta Lt
    onPrimary: '#ffffff',
    surface: '#F5F0EA',         // Cream
    surfaceBright: '#ffffff',
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#FAEEDA', // Amber Lt (Pending bg)
    surfaceContainerHigh: '#EAF3DE', // Sage Green (Available bg)
    surfaceContainerHighest: '#FAEEDA', 
    onSurface: '#4A1B0C',       // Ink Brown
    onSurfaceVariant: '#8C7169', 
    outline: '#993C1D',         // Terracotta Dk
    outlineVariant: 'rgba(153, 60, 29, 0.2)',
    secondaryContainer: '#EAF3DE', // Sage Green
    onSecondaryContainer: '#639922', // Green (Available text)
    error: '#712B13',           // Rust
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
  }
};

export const PortalLayoutWrapper = styled.div`
  background-color: ${theme.colors.surface};
  color: ${theme.colors.onSurface};
  font-family: ${theme.typography.fontFamily};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const PortalHeaderNav = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 50;
  background-color: rgba(252, 249, 244, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all 0.3s duration;
`;

export const PortalHeaderInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 5rem;
  width: 100%;
  max-width: 1536px;
  margin: 0 auto;
`;

export const PortalBrandLogo = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.05em;
  color: ${theme.colors.primary};
  cursor: pointer;
`;

export const PortalNavLinks = styled.nav`
  display: none;
  gap: 2rem;
  align-items: center;

  @media (min-width: 768px) {
    display: flex;
  }
`;

export const PortalNavLink = styled.a<{ $active?: boolean }>`
  color: ${props => props.$active ? theme.colors.primary : theme.colors.onSurfaceVariant};
  border-bottom: ${props => props.$active ? `2px solid ${theme.colors.primary}` : 'none'};
  padding-bottom: ${props => props.$active ? '4px' : '0'};
  font-weight: 500;
  font-size: 1rem;
  text-decoration: none;
  transition: opacity 0.3s;
  cursor: pointer;

  &:hover {
    color: ${theme.colors.primary};
    opacity: 0.8;
  }
`;

export const PortalHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const PortalIconButton = styled.button`
  background: transparent;
  border: none;
  color: ${theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${theme.colors.surfaceContainerHighest};
  }

  .material-symbols-outlined {
    font-size: 1.5rem;
  }
`;

export const PortalProfileBtn = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: ${theme.colors.onSurface};
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.3s;
  
  &:hover {
    color: ${theme.colors.primary};
    opacity: 0.8;
  }

  @media (min-width: 768px) {
    display: flex;
  }
`;

export const PortalMainContent = styled.main`
  flex-grow: 1;
  padding-top: 5rem;
  width: 100%;
`;

export const PortalFooterWrapper = styled.footer`
  background-color: ${theme.colors.surfaceContainerLow};
  width: 100%;
  padding: 4rem 3rem;
  margin-top: auto;
`;

export const PortalFooterInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  max-width: 80rem;
  margin: 0 auto;
  gap: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

export const PortalFooterBrand = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${theme.colors.primary};
`;

export const PortalFooterNav = styled.nav`
  display: flex;
  gap: 1.5rem;

  a {
    font-size: 0.875rem;
    color: ${theme.colors.onSurfaceVariant};
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: ${theme.colors.primary};
    }
  }
`;

export const PortalFooterCopyright = styled.div`
  font-size: 0.875rem;
  color: ${theme.colors.outline};
`;

// Exporting theme colors for components to reuse
export const portalTheme = theme;
