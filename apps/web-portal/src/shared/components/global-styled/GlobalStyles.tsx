import { createGlobalStyle } from 'styled-components';
import { colors } from '@configs/antDesign';

export const GlobalStyles = createGlobalStyle`
  :root {
    /* Main Theme Variables */
    --primary: ${colors.primary};
    --primary-hover: ${colors.primaryHover};
    --primary-active: ${colors.primaryActive};
    
    --bg-page: ${colors.pageBg};
    --bg-card: ${colors.cardBg};
    
    --text-primary: ${colors.textPrimary};
    --text-secondary: ${colors.textSecondary};
    --white: ${colors.white};

    /* Design primary legacy variables sync */
    --design-primary: ${colors.primary};
    --design-primary-text: ${colors.textPrimary};
    --design-primary-title: ${colors.sidebarActive};
    --design-primary-subtitle: ${colors.primaryHover};
    --design-primary-border: ${colors.borderSubtle};
    --design-primary-bg-sub: rgba(216, 90, 48, 0.1);
    --design-primary-bg-hover: rgba(216, 90, 48, 0.1);
    
    /* Layout */
    --sidebar-width: 26rem;
    --header-admin-height: 5rem;
    --device-height: 100vh;
  }

  body {
    background-color: var(--bg-page);
    color: var(--text-primary);
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
  }
`;
