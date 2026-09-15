import React from 'react';
import styled from 'styled-components';
import { capitalize } from '../../utils/pokemonUtils';

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #fff;
  background: ${({ $type, theme }) => theme.colors.types[$type] || '#888'};
  box-shadow: 0 2px 8px ${({ $type, theme }) =>
    theme.colors.types[$type] ? `${theme.colors.types[$type]}55` : 'rgba(0,0,0,0.3)'};
  white-space: nowrap;
`;

function TypeBadge({ type, ...props }) {
  return (
    <Badge $type={type} data-type={type} {...props}>
      {capitalize(type)}
    </Badge>
  );
}

export default TypeBadge;
