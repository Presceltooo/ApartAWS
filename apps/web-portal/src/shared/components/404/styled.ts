import notfoundbg from "@assets/images/404.png";
import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  background-image: url(${notfoundbg});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.div`
  text-align: center;
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 4.8rem;
  border-radius: 3.2rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 64rem;
  margin: 0 2rem;

  h2 {
    color: var(--text-primary);
    font-weight: 500;
    font-size: 3.2rem;
    line-height: 4.2rem;
    margin-bottom: 2.4rem;
  }
`;
