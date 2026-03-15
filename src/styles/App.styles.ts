import styled, { createGlobalStyle, keyframes } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Space+Grotesk:wght@500;700&display=swap");

  :root {
    --bg-0: #f3f9ec;
    --bg-1: #d7edd2;
    --surface: #fdfef9;
    --surface-2: #ffffff;
    --text: #17341b;
    --muted: #4d6551;
    --primary: #1a8e3a;
    --primary-2: #0f6f2a;
    --danger: #b42318;
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
    font-family: "Sora", "Segoe UI", sans-serif;
    color: var(--text);
    background: radial-gradient(circle at 15% 10%, #ffffff 0%, var(--bg-0) 42%, var(--bg-1) 100%);
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
  background:
    radial-gradient(
      circle at 12% 22%,
      rgba(255, 255, 255, 0.8) 0 16%,
      transparent 42%
    ),
    radial-gradient(
      circle at 88% 80%,
      rgba(52, 168, 83, 0.14) 0 14%,
      transparent 44%
    );
  pointer-events: none;
`;

export const Container = styled.section`
  position: relative;
  z-index: 1;
  max-width: 840px;
  margin: 0 auto;
  padding: 28px;
  border: 1px solid rgba(20, 88, 34, 0.14);
  border-radius: 24px;
  background: linear-gradient(
    145deg,
    rgba(253, 254, 249, 0.97),
    rgba(248, 252, 245, 0.92)
  );
  box-shadow: 0 24px 50px rgba(18, 75, 31, 0.15);
  animation: ${fadeUp} 520ms ease-out;

  @media (max-width: 700px) {
    padding: 22px;
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
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f6a2b;
  background: rgba(48, 170, 78, 0.12);
  border: 1px solid rgba(26, 142, 58, 0.28);
`;

export const SmallNote = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: var(--muted);
`;

export const Title = styled.h1`
  margin: 0;
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
  font-size: clamp(2.1rem, 4vw, 3rem);
  line-height: 1.05;
  color: #155d26;
  letter-spacing: -0.03em;
`;

export const SubTitle = styled.p`
  max-width: 62ch;
  margin: 12px 0 24px;
  color: var(--muted);
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
  background: linear-gradient(180deg, var(--primary), var(--primary-2));
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
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #cbe0cd;
  border-radius: 16px;
  background: var(--surface);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.8);
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
  min-height: 48px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 20%, #4db96a, #228841);
  color: #f8fffa;
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.02em;
  box-shadow: 0 8px 16px rgba(27, 111, 51, 0.35);
`;
