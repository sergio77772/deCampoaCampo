import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import TypeBadge from './index';

describe('TypeBadge Component', () => {
  it('renders correctly with given type', () => {
    renderWithProviders(<TypeBadge type="fire" />);
    
    // Debería renderizar el texto capitalizado
    const badge = screen.getByText('Fire');
    expect(badge).toBeInTheDocument();
    
    // Verificamos el atributo en lugar de computed styles por compatibilidad con happy-dom
    expect(badge).toHaveAttribute('data-type', 'fire');
  });

  it('renders gracefully with unknown type', () => {
    renderWithProviders(<TypeBadge type="unknown_type" />);
    
    const badge = screen.getByText('Unknown_type');
    expect(badge).toBeInTheDocument();
  });
});
