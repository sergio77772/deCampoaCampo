import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const shimmerBg = `
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.03) 0%,
    rgba(255,255,255,0.08) 50%,
    rgba(255,255,255,0.03) 100%
  );
  background-size: 200% auto;
  animation: shimmer 1.6s linear infinite;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  padding-bottom: 100%;
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    ${shimmerBg}
    background-color: ${({ theme }) => theme.colors.surfaceElevated};
  }
`;

const TextLine = styled.div`
  height: ${({ $height }) => $height || '16px'};
  width: ${({ $width }) => $width || '100%'};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  ${shimmerBg}
  background-color: ${({ theme }) => theme.colors.surfaceElevated};
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 8px;
`;

const BadgePlaceholder = styled.div`
  height: 22px;
  width: ${({ $width }) => $width || '60px'};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  ${shimmerBg}
  background-color: ${({ theme }) => theme.colors.surfaceElevated};
`;

function PokemonCardSkeleton() {
  return (
    <Card>
      <ImagePlaceholder />
      <TextLine $height="12px" $width="40%" />
      <TextLine $height="18px" $width="70%" />
      <BadgeRow>
        <BadgePlaceholder $width="60px" />
        <BadgePlaceholder $width="55px" />
      </BadgeRow>
    </Card>
  );
}

export default PokemonCardSkeleton;
