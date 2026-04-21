import styled from 'styled-components';
import { portalTheme } from '../../../styled';

export const BookingSectionHeader = styled.div`
  padding: 2rem;
  background-color: ${portalTheme.colors.surfaceContainerLow};
  border-bottom: 1px solid ${portalTheme.colors.outlineVariant};

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: ${portalTheme.colors.onSurface};
    margin: 0 0 0.25rem 0;
  }

  p {
    font-size: 1rem;
    color: ${portalTheme.colors.onSurfaceVariant};
    margin: 0;
  }
`;

export const FormSectionHeader = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${portalTheme.colors.primary};
  margin-bottom: 1rem;
  border-bottom: 1px solid ${portalTheme.colors.outlineVariant};
  padding-bottom: 0.5rem;
`;

export const FieldLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${portalTheme.colors.onSurface};
  margin-bottom: 0.25rem;
  display: inline-block;
`;

export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${portalTheme.colors.outline};
`;

export const GhostInputBox = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: ${portalTheme.colors.surfaceContainerHigh};
  border: 1px solid rgba(153, 60, 29, 0.15);
  border-radius: 0.5rem;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: ${portalTheme.colors.primary};
  }

  .material-symbols-outlined {
    margin-right: 0.75rem;
    color: ${portalTheme.colors.onSurfaceVariant};
    font-size: 1.25rem;
  }

  input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-size: 1rem;
    color: ${portalTheme.colors.onSurface};
    font-family: inherit;
    cursor: pointer;
  }
`;

export const GuestCounterWrapper = styled(GhostInputBox)`
  justify-content: space-between;
  cursor: default;
`;

export const CounterControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  span {
    font-size: 1.125rem;
    font-weight: 600;
    color: ${portalTheme.colors.onSurface};
    min-width: 1.5rem;
    text-align: center;
  }
`;

export const CounterBtn = styled.button`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background-color: ${portalTheme.colors.surfaceContainerLowest};
  border: 1px solid ${portalTheme.colors.outlineVariant};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: ${portalTheme.colors.onSurfaceVariant};
  padding: 0;
  line-height: 1;

  .anticon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
  }

  &:hover {
    background-color: ${portalTheme.colors.surfaceContainerHigh};
    border-color: ${portalTheme.colors.primary};
    color: ${portalTheme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PriceSummaryCard = styled.div`
  background-color: ${portalTheme.colors.surfaceContainerLow};
  padding: 1.5rem;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const SummaryRow = styled.div<{ $isTotal?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${props => props.$isTotal ? portalTheme.colors.onSurface : portalTheme.colors.onSurfaceVariant};
  font-weight: ${props => props.$isTotal ? '700' : '500'};
  font-size: ${props => props.$isTotal ? '1.125rem' : '1rem'};

  .label-link {
    text-decoration: underline;
    text-decoration-color: ${portalTheme.colors.outlineVariant};
    text-underline-offset: 4px;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: ${portalTheme.colors.onSurface};
    }
  }

  .value {
    color: ${props => props.$isTotal ? portalTheme.colors.primary : portalTheme.colors.onSurface};
  }
`;

export const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${portalTheme.colors.outlineVariant};
  opacity: 0.3;
  margin: 0.5rem 0;
`;

export const ConfirmBtn = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, ${portalTheme.colors.primary} 0%, ${portalTheme.colors.primaryActive} 100%);
  color: white;
  border-radius: 0.5rem;
  border: none;
  font-size: 1.125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: opacity 0.2s;
  box-shadow: 0 4px 15px rgba(216, 90, 48, 0.2);

  &:hover {
    opacity: 0.9;
  }

  .material-symbols-outlined {
    font-size: 1.25rem;
  }
`;

export const FooterNote = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: ${portalTheme.colors.onSurfaceVariant};
  margin-top: 1rem;
`;
