import React from 'react';
import styled, { keyframes } from 'styled-components';
import { statLabels, statLabelsFull, getStatPercent } from '../../utils/pokemonUtils';

const fillBar = keyframes`
  from { width: 0%; }
  to { width: var(--target-width); }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ $compact, theme }) => $compact ? '8px' : '12px'};
`;

const Label = styled.span`
  width: ${({ $compact }) => $compact ? '40px' : '70px'};
  font-size: ${({ $compact }) => $compact ? '0.65rem' : '0.75rem'};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;
`;

const Value = styled.span`
  width: ${({ $compact }) => $compact ? '28px' : '32px'};
  font-size: ${({ $compact }) => $compact ? '0.75rem' : '0.875rem'};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: right;
  flex-shrink: 0;
`;

const Track = styled.div`
  flex: 1;
  height: ${({ $compact }) => $compact ? '6px' : '8px'};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
`;

const Fill = styled.div`
  height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ $color }) => $color || '#6c63ff'};
  width: var(--target-width);
  animation: ${fillBar} 1s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay || '0ms'};
  --target-width: ${({ $percent }) => $percent}%;
  width: 0%;

  /* Shimmer effect cuando está al 100% */
  ${({ $percent }) => $percent >= 90 && `
    background: linear-gradient(90deg, currentColor, #fff8, currentColor);
    background-size: 200% 100%;
  `}
`;

function StatBar({ statName, value, compact = false, delay = 0 }) {
  const percent = getStatPercent(statName, value);
  const label = compact ? statLabels[statName] : statLabelsFull[statName];

  // Color dinámico según el valor
  const getColor = () => {
    if (percent >= 80) return '#4ade80';
    if (percent >= 50) return '#fbbf24';
    if (percent >= 30) return '#fb923c';
    return '#ff6b6b';
  };

  return (
    <Container $compact={compact}>
      <Label $compact={compact}>{label || statName}</Label>
      <Value $compact={compact}>{value}</Value>
      <Track $compact={compact}>
        <Fill
          $percent={percent}
          $color={getColor()}
          $delay={`${delay}ms`}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={255}
        />
      </Track>
    </Container>
  );
}

export default StatBar;
