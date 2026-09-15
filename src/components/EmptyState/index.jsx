import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
  text-align: center;
  gap: ${({ theme }) => theme.spacing.lg};
  min-height: ${({ $minHeight }) => $minHeight || '300px'};
  animation: fadeIn 0.4s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Emoji = styled.div`
  font-size: 4rem;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
`;

const Title = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 360px;
  line-height: 1.6;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.875rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }

  &:active {
    transform: translateY(0);
  }
`;

function EmptyState({ emoji, title, description, actionLabel, onAction, minHeight }) {
  return (
    <Wrapper $minHeight={minHeight}>
      {emoji && <Emoji role="img" aria-label={title}>{emoji}</Emoji>}
      {title && <Title>{title}</Title>}
      {description && <Description>{description}</Description>}
      {actionLabel && onAction && (
        <ActionButton onClick={onAction} id="empty-state-action">
          {actionLabel}
        </ActionButton>
      )}
    </Wrapper>
  );
}

export default EmptyState;
