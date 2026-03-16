import styled, { createGlobalStyle, keyframes } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");

  :root {
    --bg-0: #0d0e11;
    --surface: #1b1e24;
    --surface-2: #23262e;
    --text: #f3f4f8;
    --muted: #8a8fa3;
    --primary: #4db96a;
    --danger: #ff5c5c;
    --border: #23262e;
    --shadow: 0 4px 24px rgba(0,0,0,0.12);
  }

  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    min-height: 100%;
  }

  body {
    margin: 0;
    font-family: "Inter", "Segoe UI", Arial, sans-serif;
    color: var(--text);
    background: var(--bg-0);
  }
`;

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% { opacity: 0.35; }
  50% { opacity: 1; }
  100% { opacity: 0.35; }
`;

export const Page = styled.main`
  position: relative;
  min-height: 100vh;
  padding: 42px 18px;
`;

export const AmbientGlow = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

export const Container = styled.section`
  position: relative;
  z-index: 1;
  max-width: 840px;
  margin: 0 auto;
  padding: 32px 28px;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--surface);
  box-shadow: var(--shadow);
  animation: ${fadeUp} 520ms ease-out;

  @media (max-width: 700px) {
    padding: 22px 8px;
  }
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 18px;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.78rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--primary);
  background: #23262e;
  border: 1px solid var(--primary);
  font-weight: 600;
`;
export const SmallNote = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: var(--muted);
`;

export const Title = styled.h1`
  margin: 0;
  font-family: "Inter", "Segoe UI", Arial, sans-serif;
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  line-height: 1.08;
  color: var(--text);
  letter-spacing: -0.02em;
  font-weight: 700;
`;

export const SubTitle = styled.p`
  max-width: 62ch;
  margin: 14px 0 28px;
  color: var(--muted);
  font-size: 1.08rem;
`;

export const SearchRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 12px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const Input = styled.input`
  padding: 13px 14px;
  border: 1px solid #b8d3ba;
  border-radius: 12px;
  font-size: 1rem;
  color: #174523;
  background: var(--surface-2);

  &:focus {
    outline: 2px solid rgba(21, 126, 44, 0.25);
    border-color: #5ba06b;
  }
`;

export const PrimaryButton = styled.button`
  padding: 13px 18px;
  border-radius: 12px;
  border: none;
  color: #fff;
  background: #0d4e13;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(16, 98, 35, 0.25);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  padding: 13px 18px;
  border-radius: 12px;
  border: 1px solid #96b89c;
  background: #edf6ed;
  color: #1b5a2b;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 180ms ease,
    background 180ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: #e4f1e4;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Message = styled.p`
  margin-top: 20px;
  color: var(--muted);
`;

export const LoadingCard = styled.div`
  margin-top: 18px;
  padding: 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(111, 153, 119, 0.28);
`;

export const PulseLine = styled.div`
  height: 14px;
  border-radius: 999px;
  margin: 10px 0;
  background: linear-gradient(90deg, #d7e8d8, #c4dcc8);
  animation: ${pulse} 1.2s ease-in-out infinite;
`;

export const ErrorMessage = styled.p`
  margin-top: 20px;
  color: var(--danger);
  font-weight: 600;
`;

export const ResultCard = styled.section`
  margin-top: 24px;
  padding: 24px 20px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface-2);
  box-shadow: 0 2px 12px rgba(0,0,0,0.10);
  animation: ${fadeUp} 420ms ease;
`;

export const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
`;

export const ResultTitle = styled.h2`
  margin: 0;
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
  color: #1b5e2b;
`;

export const ResultDate = styled.span`
  color: #3f6650;
  font-size: 0.95rem;
`;

export const BallsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(48px, 1fr));
  gap: 10px;

  @media (max-width: 540px) {
    grid-template-columns: repeat(3, minmax(48px, 1fr));
  }
`;

export const Ball = styled.div`
  width: 80px;
  height: 80px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--primary);
  color: #fff;
  font-family: "Inter", "Segoe UI", Arial, sans-serif;
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 8px rgba(77, 185, 106, 0.18);
  border: 2px solid var(--surface);
`;
