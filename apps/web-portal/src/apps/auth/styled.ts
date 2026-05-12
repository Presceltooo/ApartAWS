import styled from 'styled-components';
import { Card, Button, Typography } from 'antd';
import bgImageAdmin from '@/assets/images/anhnenNaraka.jpg';


// ============================================================
// ADMIN AUTH STYLES (Dark professional theme)
// ============================================================

export const AdminLoginMain = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bgImageAdmin});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 20px;
  font-family: 'Inter', sans-serif;
`;

export const AdminLoginCard = styled.div`
  width: 100%;
  max-width: 440px;
  background: rgba(25, 25, 25, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

export const AdminLoginTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
`;

export const AdminLoginSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
  margin: 0;
`;

export const AdminFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const AdminFieldLabel = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 8px;
`;

export const AdminTextInput = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  color: #ffffff;
  font-size: 0.9375rem;
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #D85A30;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 0 1px #D85A30;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
`;

export const AdminLoginSubmitBtn = styled.button`
  width: 100%;
  background: #D85A30;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 10px;

  &:hover {
    background: #f06a3d;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const AdminCardFooter = styled.div`
  margin-top: 32px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 24px;

  p {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.4);
    margin: 0;
  }
`;

export const AdminPrimaryLink = styled.a`
  color: #D85A30;
  font-weight: 600;
  text-decoration: none;
  margin-left: 4px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    color: #f06a3d;
  }
`;

export const AuthContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-image: url(${bgImageAdmin});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(74, 27, 12, 0.4); // Ink Brown base for warm overlay
    z-index: 1;
  }
`;

export const AuthWrapper = styled.div`
  width: 100%;
  max-width: 440px;
  z-index: 2;
  padding: 20px;
`;

export const AuthCard = styled(Card)`
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(216, 90, 48, 0.1) !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 32px 0 rgba(74, 27, 12, 0.1);

  .ant-card-body {
    padding: 32px 32px 24px;
  }
`;

export const AuthTitle = styled(Typography.Title)`
  text-align: center;
  margin-bottom: 32px !important;
  color: #D85A30 !important; // Terracotta
  font-weight: 600 !important;
`;

export const AuthButton = styled(Button)`
  width: 100%;
  margin-top: 10px;
  height: 40px;
  font-weight: 500;
`;

export const FooterLinks = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 14px;

  a {
    color: #D85A30;
    transition: color 0.3s;

    &:hover {
      color: #993C1D;
    }
  }
`;

export const ActionLink = styled.a`
  color: #D85A30 !important;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    color: #993C1D !important;
    text-decoration: underline;
  }
`;

export const CenteredText = styled.div`
  text-align: center;
  margin-top: 16px;
  color: #8C7169;
  font-size: 14px;
`;

// ============================================================
// USER AUTH STYLES (Light warm luxury theme - Domin Tactic)
// ============================================================

// --- Shared tokens ---
const PRIMARY = '#D85A30';      // Terracotta
const PRIMARY_DARK = '#993C1D'; // Terracotta Dk
const SURFACE = '#F5F0EA';      // Cream
const SURFACE_HIGH = '#FAEEDA'; // Amber Lt
const SURFACE_LOW = '#FAEEDA'; 
const ON_SURFACE = '#4A1B0C';   // Ink Brown
const ON_SURFACE_VARIANT = '#8C7169';
const OUTLINE = '#993C1D';
const OUTLINE_VARIANT_ALPHA = 'rgba(153, 60, 29, 0.2)';

// --- Login page ---
export const UserLoginMain = styled.main`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  background-color: ${SURFACE};
`;

export const UserLoginBgWrapper = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
`;

export const UserLoginBgImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const UserLoginBgOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, transparent 30%, rgba(252, 249, 244, 0.5) 100%);
`;

export const UserLoginBranding = styled.div`
  display: none;
  position: absolute;
  left: 5rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  max-width: 32rem;

  @media (min-width: 1024px) {
    display: block;
  }
`;

export const UserLoginBrandingLabel = styled.p`
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${ON_SURFACE_VARIANT};
  font-weight: 500;
  margin-bottom: 1rem;
`;

export const UserLoginBrandingTitle = styled.h1`
  font-size: 5rem;
  font-weight: 700;
  letter-spacing: -0.05em;
  line-height: 0.9;
  color: ${ON_SURFACE};
  margin: 0;
`;

export const UserLoginBrandingDivider = styled.div`
  margin-top: 2rem;
  height: 1px;
  width: 6rem;
  background: ${PRIMARY};
`;

export const UserLoginBrandingDesc = styled.p`
  margin-top: 2rem;
  color: ${ON_SURFACE_VARIANT};
  line-height: 1.6;
  opacity: 0.8;
  font-size: 1.125rem;
`;

export const UserLoginCardWrapper = styled.div`
  position: relative;
  z-index: 20;
  width: 100%;
  max-width: 28rem;
  margin: 1.5rem;
  margin-right: clamp(1.5rem, 8vw, 8rem);

  @media (max-width: 768px) {
    margin: 1rem;
  }
`;

export const UserLoginCard = styled.div`
  background: rgba(252, 249, 244, 0.88);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  padding: 3rem;
  border-radius: 0.75rem;
  box-shadow: 0 20px 40px rgba(74, 27, 12, 0.1);
  border: 1px solid rgba(224, 192, 182, 0.2);
`;

export const UserLoginCardHeader = styled.div`
  margin-bottom: 2.5rem;
`;

export const UserLoginCardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: ${PRIMARY};
  margin-bottom: 0.5rem;
  margin-top: 0;
`;

export const UserLoginCardSubtitle = styled.p`
  color: ${ON_SURFACE_VARIANT};
  font-size: 0.875rem;
  margin: 0;
`;

export const UserFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

export const UserFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const UserFieldLabel = styled.label`
  display: block;
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 700;
  color: ${ON_SURFACE_VARIANT};
  margin-bottom: 0.375rem;
  margin-left: 0.25rem;
`;

export const UserTextInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${SURFACE_HIGH};
  border: none;
  border-radius: 0.5rem;
  color: ${ON_SURFACE};
  outline: none;
  font-size: 0.9375rem;
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
  transition: box-shadow 0.2s, background 0.2s;

  &::placeholder {
    color: rgba(74, 27, 12, 0.4);
  }

  &:focus {
    box-shadow: 0 0 0 2px ${PRIMARY};
    background: ${SURFACE};
  }
`;

export const UserRememberRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
`;

export const UserRememberLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${ON_SURFACE_VARIANT};
  cursor: pointer;

  input[type='checkbox'] {
    width: 1rem;
    height: 1rem;
    accent-color: ${PRIMARY};
    border-radius: 0.25rem;
    cursor: pointer;
  }
`;

export const UserForgotLink = styled.a`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${PRIMARY};
  text-decoration: none;
  transition: opacity 0.2s;
  cursor: pointer;

  &:hover {
    opacity: 0.75;
  }
`;

export const UserLoginSubmitBtn = styled.button`
  width: 100%;
  background: linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%);
  color: #ffffff;
  font-weight: 600;
  padding: 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-size: 0.9375rem;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 4px 15px rgba(216, 90, 48, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: opacity 0.2s, transform 0.1s;
  margin-bottom: 1.5rem;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.985);
  }
`;

export const UserDividerRow = styled.div`
  position: relative;
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const UserDividerLine = styled.div`
  flex-grow: 1;
  height: 1px;
  background: ${OUTLINE_VARIANT_ALPHA};
`;

export const UserDividerText = styled.span`
  padding: 0 0.5rem;
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${ON_SURFACE_VARIANT};
  font-weight: 700;
  white-space: nowrap;
`;

export const UserSocialGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

export const UserSocialBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #ffffff;
  border: 1px solid rgba(224, 192, 182, 0.25);
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${ON_SURFACE};
  font-family: 'Inter', sans-serif;
  transition: background 0.2s;

  &:hover {
    background: ${SURFACE};
  }
`;

export const UserCardFooter = styled.div`
  margin-top: 2rem;
  text-align: center;

  p {
    font-size: 0.875rem;
    color: ${ON_SURFACE_VARIANT};
    margin: 0;
  }
`;

export const UserPrimaryLink = styled.a`
  color: ${PRIMARY};
  font-weight: 700;
  text-decoration: none;
  transition: opacity 0.2s;
  cursor: pointer;

  &:hover {
    opacity: 0.75;
  }
`;

export const UserLoginQuote = styled.div`
  margin-top: 2rem;
  padding: 0 1rem;
  opacity: 0.35;
  font-style: italic;
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${ON_SURFACE};
  text-align: right;
`;

export const UserSupportBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${ON_SURFACE_VARIANT};
  background: rgba(252, 249, 244, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid rgba(224, 192, 182, 0.2);
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  font-family: 'Inter', sans-serif;
  transition: color 0.2s;

  &:hover {
    color: ${PRIMARY};
  }
`;

export const UserFixedSupportWrapper = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 50;
`;

// --- Register page ---
export const RegisterMain = styled.main`
  display: flex;
  min-height: 100vh;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
`;

export const RegisterImageSection = styled.section`
  display: none;
  flex: 0 0 50%;
  position: relative;
  overflow: hidden;
  background: #f0ede8;

  @media (min-width: 1024px) {
    display: flex;
  }
`;

export const RegisterImageAbsolute = styled.div`
  position: absolute;
  inset: 0;
`;

export const RegisterImageCover = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const RegisterImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(28, 28, 25, 0.6), transparent);
`;

export const RegisterImageContent = styled.div`
  position: relative;
  z-index: 10;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
`;

export const RegisterGlassCard = styled.div`
  background: rgba(252, 249, 244, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 2.5rem;
  border-radius: 0.75rem;
  max-width: 32rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
`;

export const RegisterGlassBrand = styled.span`
  display: block;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-weight: 700;
  color: ${PRIMARY};
  margin-bottom: 1rem;
`;

export const RegisterGlassTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: ${ON_SURFACE};
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-bottom: 1.5rem;
  margin-top: 0;
`;

export const RegisterGlassDesc = styled.p`
  font-size: 1.125rem;
  color: ${ON_SURFACE_VARIANT};
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
`;

export const RegisterFormSection = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(2rem, 6vw, 6rem);
  background: ${SURFACE};
  overflow-y: auto;
`;

export const RegisterHeader = styled.div`
  width: 100%;
  max-width: 28rem;
  margin-bottom: 3rem;
  text-align: left;
`;

export const RegisterLogoRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

export const RegisterLogoText = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${PRIMARY};
  letter-spacing: -0.03em;
`;

export const RegisterPageTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: ${ON_SURFACE};
  margin-bottom: 0.5rem;
  margin-top: 0;
`;

export const RegisterPageSubtitle = styled.p`
  color: ${ON_SURFACE_VARIANT};
  margin: 0;
`;

export const RegisterSocialGrid = styled.div`
  width: 100%;
  max-width: 28rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2.5rem;
`;

export const RegisterSocialBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: ${SURFACE_HIGH};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  color: ${ON_SURFACE};
  font-family: 'Inter', sans-serif;
  transition: background 0.2s;

  &:hover {
    background: #e5e2dd;
  }
`;

export const RegisterDividerRow = styled.div`
  width: 100%;
  max-width: 28rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
`;

export const RegisterDividerLine = styled.div`
  height: 1px;
  flex-grow: 1;
  background: rgba(224, 192, 182, 0.4);
`;

export const RegisterDividerText = styled.span`
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${OUTLINE};
  font-weight: 700;
  white-space: nowrap;
`;

export const RegisterForm = styled.form`
  width: 100%;
  max-width: 28rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const RegisterFieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const RegisterPasswordRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

export const RegisterFieldLabel = styled.label`
  display: block;
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 700;
  color: ${ON_SURFACE_VARIANT};
  padding-left: 0.25rem;
`;

export const RegisterInputWrapper = styled.div`
  position: relative;
`;

export const RegisterTextInput = styled.input`
  width: 100%;
  background: ${SURFACE_LOW};
  border: 1px solid rgba(224, 192, 182, 0.2);
  padding: 0.875rem 3rem 0.875rem 1rem;
  border-radius: 0.5rem;
  color: ${ON_SURFACE};
  outline: none;
  font-size: 0.9375rem;
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
  transition: box-shadow 0.2s, background 0.2s;

  &::placeholder {
    color: rgba(224, 192, 182, 0.7);
  }

  &:focus {
    box-shadow: 0 0 0 1px ${PRIMARY};
    background: ${SURFACE};
  }
`;

export const RegisterInputIcon = styled.span`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${OUTLINE};
  font-size: 1.1rem;
  pointer-events: none;
`;

export const RegisterTermsRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem 0;
`;

export const RegisterTermsCheckbox = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  accent-color: ${PRIMARY};
  border-radius: 0.25rem;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 0.1rem;
`;

export const RegisterTermsLabel = styled.label`
  font-size: 0.875rem;
  color: ${ON_SURFACE_VARIANT};
  line-height: 1.5;
  cursor: pointer;

  a {
    color: ${PRIMARY};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const RegisterSubmitBtn = styled.button`
  width: 100%;
  background: linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%);
  color: #ffffff;
  font-weight: 600;
  padding: 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-size: 0.9375rem;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 4px 15px rgba(216, 90, 48, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: opacity 0.2s, transform 0.1s;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.985);
  }
`;

export const RegisterFooter = styled.div`
  margin-top: 3rem;
  text-align: center;

  p {
    font-size: 0.875rem;
    color: ${ON_SURFACE_VARIANT};
    margin: 0;
  }
`;

export const RegisterHelpBtn = styled.button`
  width: 3.5rem;
  height: 3.5rem;
  background: ${SURFACE_HIGH};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid rgba(216, 90, 48, 0.1);
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  font-size: 1.25rem;
  transition: background 0.2s;
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 50;

  &:hover {
    background: ${SURFACE};
  }
`;

// --- Forgot Password page ---
export const ForgotPageWrapper = styled.div`
  background: ${SURFACE};
  color: ${ON_SURFACE};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
`;

export const ForgotHeader = styled.header`
  background: ${SURFACE};
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid rgba(224, 192, 182, 0.15);
`;

export const ForgotNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
`;

export const ForgotBrand = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: ${PRIMARY};
`;

export const ForgotNavLink = styled.a`
  color: ${ON_SURFACE_VARIANT};
  font-size: 0.875rem;
  letter-spacing: 0.03em;
  text-decoration: none;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.7;
  }
`;

export const ForgotMain = styled.main`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 4vw, 3rem);
`;

export const ForgotContentGrid = styled.div`
  max-width: 72rem;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(74, 27, 12, 0.06);
  background: #ffffff;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const ForgotImagePanel = styled.div`
  display: none;
  position: relative;
  min-height: 600px;

  @media (min-width: 1024px) {
    display: block;
  }
`;

export const ForgotImageCover = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ForgotImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(216, 90, 48, 0.4), transparent);
`;

export const ForgotImageText = styled.div`
  position: absolute;
  bottom: 3rem;
  left: 3rem;
  right: 3rem;
`;

export const ForgotImageHeading = styled.h2`
  color: #ffffff;
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 1rem;
  margin-top: 0;
  line-height: 1.2;
`;

export const ForgotImageDesc = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.125rem;
  font-weight: 300;
  line-height: 1.6;
  margin: 0;
`;

export const ForgotFormPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(2rem, 5vw, 5rem);
  background: #ffffff;
`;

export const ForgotFormInner = styled.div`
  max-width: 28rem;
  margin: 0 auto;
  width: 100%;
`;

export const ForgotIconBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  background: #d2e5ce;
  border-radius: 9999px;
  color: #3a4b3a;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const ForgotHeading = styled.div`
  margin-bottom: 2.5rem;
`;

export const ForgotTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: ${ON_SURFACE};
  margin-bottom: 1rem;
  margin-top: 0;
`;

export const ForgotDesc = styled.p`
  color: ${ON_SURFACE_VARIANT};
  line-height: 1.6;
  margin: 0;
`;

export const ForgotForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ForgotFieldLabel = styled.label`
  display: block;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${ON_SURFACE_VARIANT};
  margin-bottom: 0.5rem;
  margin-left: 0.25rem;
`;

export const ForgotInputWrapper = styled.div`
  position: relative;
`;

export const ForgotInputIcon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${OUTLINE};
  font-size: 1.125rem;
  pointer-events: none;
`;

export const ForgotEmailInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: ${SURFACE_HIGH};
  border: none;
  border-radius: 0.5rem;
  color: ${ON_SURFACE};
  outline: none;
  font-size: 0.9375rem;
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
  transition: box-shadow 0.2s;

  &::placeholder {
    color: rgba(74, 27, 12, 0.4);
  }

  &:focus {
    box-shadow: 0 0 0 1px ${PRIMARY};
  }
`;

export const ForgotSubmitBtn = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%);
  color: #ffffff;
  font-weight: 700;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-size: 0.9375rem;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 4px 15px rgba(216, 90, 48, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: opacity 0.2s, transform 0.1s;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.985);
  }
`;

export const ForgotFooterArea = styled.div`
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;

  p {
    font-size: 0.875rem;
    color: ${ON_SURFACE_VARIANT};
    margin: 0;
  }

  a {
    color: ${PRIMARY};
    font-weight: 600;
    text-decoration: underline;
    text-decoration-color: rgba(216, 90, 48, 0.3);
    text-underline-offset: 4px;
  }
`;

export const ForgotBackLinkWrapper = styled.div`
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px solid rgba(224, 192, 182, 0.2);
  width: 100%;
`;

export const ForgotBackLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${ON_SURFACE_VARIANT};
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
  cursor: pointer;

  &:hover {
    color: ${PRIMARY};
  }
`;

export const ForgotSuccessWrapper = styled.div`
  text-align: center;
`;

export const ForgotSuccessIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  background: linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%);
  border-radius: 9999px;
  font-size: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(216, 90, 48, 0.3);
`;

export const ForgotSuccessTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${ON_SURFACE};
  margin-bottom: 1rem;
  margin-top: 0;
  letter-spacing: -0.03em;
`;

export const ForgotSuccessDesc = styled.p`
  color: ${ON_SURFACE_VARIANT};
  line-height: 1.6;
  margin-bottom: 2rem;
`;

export const ForgotSuccessHighlight = styled.span`
  font-weight: 600;
  color: ${PRIMARY};
`;

export const ForgotPageFooter = styled.footer`
  margin-top: auto;
  padding: 2rem 1.5rem;
  text-align: center;
  border-top: 1px solid rgba(224, 192, 182, 0.15);
`;

export const ForgotPageFooterInner = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

export const ForgotFooterCopy = styled.p`
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: ${OUTLINE};
  text-transform: uppercase;
  margin: 0;
`;

export const ForgotFooterLinks = styled.div`
  display: flex;
  gap: 2rem;

  a {
    font-size: 0.625rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: ${OUTLINE};
    text-transform: uppercase;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: ${PRIMARY};
    }
  }
`;
