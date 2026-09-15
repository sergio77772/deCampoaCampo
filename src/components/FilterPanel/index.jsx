import React from 'react';
import styled from 'styled-components';
import { useGetTypeListQuery, useGetGenerationListQuery } from '../../services/pokemonApi';
import { capitalize, genNameToId, generationNames, IGNORED_TYPES } from '../../utils/pokemonUtils';

const Panel = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-height: 120px;
  overflow-y: auto;
  padding-right: 4px;

  /* Scrollbar fino para el overflow */
  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 2px;
  }
`;

const Chip = styled.button`
  padding: 5px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: 1px solid ${({ $active, $color, theme }) =>
    $active ? ($color || theme.colors.primary) : theme.colors.border};
  background: ${({ $active, $color, theme }) =>
    $active ? ($color ? `${$color}22` : theme.colors.primaryGlow) : 'transparent'};
  color: ${({ $active, $color, theme }) =>
    $active ? ($color || theme.colors.primary) : theme.colors.text.secondary};

  &:hover {
    border-color: ${({ $color, theme }) => $color || theme.colors.primary};
    color: ${({ $color, theme }) => $color || theme.colors.primary};
    background: ${({ $color, theme }) =>
      $color ? `${$color}15` : theme.colors.primaryGlow};
  }
`;

const ClearAll = styled.button`
  padding: 5px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accent};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.accentGlow};
  transition: all ${({ theme }) => theme.transitions.fast};
  align-self: flex-end;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    color: white;
  }
`;

function FilterPanel({ selectedType, selectedGen, onTypeChange, onGenChange }) {
  const { data: typeData } = useGetTypeListQuery();
  const { data: genData } = useGetGenerationListQuery();

  const types = typeData?.results?.filter(
    (t) => !IGNORED_TYPES.includes(t.name)
  ) || [];

  const generations = genData?.results || [];

  const hasFilters = selectedType || selectedGen;

  const handleClearAll = () => {
    onTypeChange('');
    onGenChange('');
  };

  return (
    <Panel>
      <FilterGroup>
        <FilterLabel>Tipo</FilterLabel>
        <ChipRow>
          {types.map((type) => (
            <Chip
              key={type.name}
              $active={selectedType === type.name}
              $color={`var(--type-color-${type.name})`}
              onClick={() => onTypeChange(selectedType === type.name ? '' : type.name)}
              id={`filter-type-${type.name}`}
              type="button"
            >
              {capitalize(type.name)}
            </Chip>
          ))}
        </ChipRow>
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>Generación</FilterLabel>
        <ChipRow>
          {generations.map((gen) => {
            const genId = genNameToId[gen.name];
            if (!genId) return null;
            return (
              <Chip
                key={gen.name}
                $active={selectedGen === String(genId)}
                onClick={() =>
                  onGenChange(selectedGen === String(genId) ? '' : String(genId))
                }
                id={`filter-gen-${genId}`}
                type="button"
              >
                {generationNames[genId] || capitalize(gen.name)}
              </Chip>
            );
          })}
        </ChipRow>
      </FilterGroup>

      {hasFilters && (
        <ClearAll onClick={handleClearAll} id="filter-clear-all" type="button">
          ✕ Limpiar filtros
        </ClearAll>
      )}
    </Panel>
  );
}

export default FilterPanel;
