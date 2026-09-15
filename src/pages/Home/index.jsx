import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';

import {
  useGetPokemonListQuery,
  useGetPokemonDetailQuery,
  useGetPokemonByTypeQuery,
  useGetPokemonByGenerationQuery,
} from '../../services/pokemonApi';
import PokemonCard from '../../components/PokemonCard';
import PokemonCardSkeleton from '../../components/PokemonCard/Skeleton';
import SearchBar from '../../components/SearchBar';
import FilterPanel from '../../components/FilterPanel';
import EmptyState from '../../components/EmptyState';
import useDebounce from '../../hooks/useDebounce';
import { extractIdFromUrl } from '../../utils/pokemonUtils';

const PAGE_LIMIT = 24;

// ──────────────────────────────────────────────
// Styled Components
// ──────────────────────────────────────────────
const PageWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  }
`;

const Hero = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.03em;
  margin-bottom: 12px;

  span {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primaryGlow : theme.colors.surface};
  border: 1px solid ${({ $active, theme }) =>
    $active ? theme.colors.borderHover : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.text.secondary};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FilterSection = styled.div`
  overflow: hidden;
  max-height: ${({ $open }) => $open ? '300px' : '0'};
  opacity: ${({ $open }) => $open ? 1 : 0};
  transition: max-height 0.35s ease, opacity 0.25s ease;
  margin-bottom: ${({ $open }) => $open ? '24px' : '0'};
  padding: ${({ $open }) => $open ? '16px' : '0'} 0;
`;

const ResultsMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  gap: 8px;
`;

const ResultsCount = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const LoadingObserver = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.875rem;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorCard = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const RetryButton = styled.button`
  padding: 10px 20px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-weight: 600;
  font-size: 0.875rem;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-2px);
  }
`;

// ──────────────────────────────────────────────
// Sub-componente: Búsqueda por nombre exacto
// ──────────────────────────────────────────────
function SearchResult({ searchTerm, index }) {
  const { data, isLoading, isError } = useGetPokemonDetailQuery(
    searchTerm.toLowerCase().trim(),
    { skip: !searchTerm }
  );

  if (isLoading) return <PokemonCardSkeleton />;
  if (isError || !data) return null;
  return <PokemonCard pokemon={data} index={index} />;
}

// ──────────────────────────────────────────────
// Componente principal Home
// ──────────────────────────────────────────────
function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Leer estado inicial desde URL
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [selectedGen, setSelectedGen] = useState(searchParams.get('gen') || '');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const [allPokemon, setAllPokemon] = useState([]); // Lista acumulada para infinite scroll

  const debouncedSearch = useDebounce(searchInput, 300);

  // Detectar modo: búsqueda, filtro o lista normal
  const isSearchMode = debouncedSearch.length > 0;
  const isFilterMode = selectedType || selectedGen;
  const isNormalMode = !isSearchMode && !isFilterMode;

  // ── Queries ──

  // Lista normal paginada
  const {
    data: listData,
    isFetching: listFetching,
    isError: listError,
    refetch: refetchList,
  } = useGetPokemonListQuery(
    { limit: PAGE_LIMIT, offset },
    { skip: !isNormalMode }
  );

  // Pokémon por tipo
  const { data: typeData, isFetching: typeFetching } = useGetPokemonByTypeQuery(
    selectedType,
    { skip: !selectedType }
  );

  // Pokémon por generación
  const { data: genData, isFetching: genFetching } = useGetPokemonByGenerationQuery(
    selectedGen,
    { skip: !selectedGen }
  );

  // ── Infinite Scroll ──
  const { ref: loadMoreRef, inView } = useInView({ threshold: 0 });
  const hasNextPage = listData?.next != null;

  // Resetear lista acumulada cuando cambia el modo
  useEffect(() => {
    setOffset(0);
    setAllPokemon([]);
  }, [selectedType, selectedGen, debouncedSearch]);

  // Acumular resultados de la lista paginada
  useEffect(() => {
    if (isNormalMode && listData?.results) {
      setAllPokemon((prev) => {
        const existingIds = new Set(prev.map((p) => p.name));
        const newOnes = listData.results.filter((p) => !existingIds.has(p.name));
        return [...prev, ...newOnes];
      });
    }
  }, [listData, isNormalMode]);

  // Trigger de carga de más cuando se ve el sentinel
  useEffect(() => {
    if (inView && isNormalMode && !listFetching && hasNextPage) {
      setOffset((prev) => prev + PAGE_LIMIT);
    }
  }, [inView, isNormalMode, listFetching, hasNextPage]);

  // ── Sincronizar URL params ──
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedType) params.type = selectedType;
    if (selectedGen) params.gen = selectedGen;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, selectedType, selectedGen, setSearchParams]);

  // ── Calcular pokémon filtrados ──
  const getFilteredPokemon = () => {
    let result = null;

    if (selectedType && selectedGen) {
      // Intersección
      const typeNames = new Set(
        (typeData?.pokemon || []).map((p) => p.pokemon.name)
      );
      const genSpecies = (genData?.pokemon_species || []).map((s) => s.name);
      result = genSpecies
        .filter((name) => typeNames.has(name))
        .map((name) => ({ name }));
    } else if (selectedType) {
      result = (typeData?.pokemon || []).map((p) => ({
        name: p.pokemon.name,
        url: p.pokemon.url,
      }));
    } else if (selectedGen) {
      result = (genData?.pokemon_species || []).map((s) => ({
        name: s.name,
        url: s.url,
      }));
    }

    return result;
  };

  const filteredPokemon = isFilterMode ? getFilteredPokemon() : null;
  const isFilterLoading = typeFetching || genFetching;
  const hasFilterResults = filteredPokemon && filteredPokemon.length > 0;
  const hasFiltersActive = selectedType || selectedGen;
  const filterCount = (selectedType ? 1 : 0) + (selectedGen ? 1 : 0);

  return (
    <PageWrapper>
      <Hero>
        <HeroTitle>
          Explora la <span>Pokédex</span>
        </HeroTitle>
        <HeroSubtitle>
          {(1025).toLocaleString('es')}+ pokémon a tu alcance
        </HeroSubtitle>
      </Hero>

      {/* Controles: búsqueda + toggle filtros */}
      <ControlsRow>
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          id="home-search"
        />
        <FilterToggle
          $active={hasFiltersActive}
          onClick={() => setFiltersOpen((o) => !o)}
          id="filter-toggle-btn"
          type="button"
        >
          <span>⚙️</span>
          Filtros {filterCount > 0 && `(${filterCount})`}
          <span>{filtersOpen ? '▲' : '▼'}</span>
        </FilterToggle>
      </ControlsRow>

      {/* Panel de filtros colapsable */}
      <FilterSection $open={filtersOpen}>
        <FilterPanel
          selectedType={selectedType}
          selectedGen={selectedGen}
          onTypeChange={setSelectedType}
          onGenChange={setSelectedGen}
        />
      </FilterSection>

      {/* ── Modo búsqueda ── */}
      {isSearchMode && (
        <>
          <ResultsMeta>
            <ResultsCount>Buscando: "{debouncedSearch}"</ResultsCount>
          </ResultsMeta>
          <Grid>
            <SearchResult searchTerm={debouncedSearch} index={0} />
          </Grid>
        </>
      )}

      {/* ── Modo filtro ── */}
      {isFilterMode && !isSearchMode && (
        <>
          {isFilterLoading ? (
            <Grid>
              {Array.from({ length: 12 }).map((_, i) => (
                <PokemonCardSkeleton key={i} />
              ))}
            </Grid>
          ) : hasFilterResults ? (
            <>
              <ResultsMeta>
                <ResultsCount>{filteredPokemon.length} pokémon encontrados</ResultsCount>
              </ResultsMeta>
              <FilteredGrid pokemon={filteredPokemon} />
            </>
          ) : (
            <EmptyState
              emoji="🔍"
              title="Sin resultados"
              description="No hay pokémon que coincidan con los filtros seleccionados. Probá con otra combinación."
              actionLabel="Limpiar filtros"
              onAction={() => { setSelectedType(''); setSelectedGen(''); }}
            />
          )}
        </>
      )}

      {/* ── Modo normal (infinite scroll) ── */}
      {isNormalMode && (
        <>
          {allPokemon.length === 0 && listFetching ? (
            <Grid>
              {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
                <PokemonCardSkeleton key={i} />
              ))}
            </Grid>
          ) : listError ? (
            <ErrorCard>
              <span style={{ fontSize: '2rem' }}>⚠️</span>
              <p style={{ color: '#94a3b8' }}>Error al cargar los pokémon</p>
              <RetryButton onClick={refetchList} id="retry-list-btn">
                🔄 Reintentar
              </RetryButton>
            </ErrorCard>
          ) : (
            <NormalGrid pokemon={allPokemon} />
          )}

          {/* Sentinel para infinite scroll */}
          <LoadingObserver ref={loadMoreRef}>
            {listFetching && allPokemon.length > 0 && <Spinner />}
          </LoadingObserver>
        </>
      )}
    </PageWrapper>
  );
}

// ──────────────────────────────────────────────
// Grid para lista normal (necesita fetchear detalle)
// ──────────────────────────────────────────────
function NormalGrid({ pokemon }) {
  return (
    <Grid>
      {pokemon.map((p, i) => {
        const id = extractIdFromUrl(p.url);
        return <NormalCard key={p.name} name={p.name} id={id} index={i} />;
      })}
    </Grid>
  );
}

function NormalCard({ name, id, index }) {
  const { data, isLoading } = useGetPokemonDetailQuery(name);

  if (isLoading) return <PokemonCardSkeleton />;
  if (!data) return null;
  return <PokemonCard pokemon={data} index={index} />;
}

// ──────────────────────────────────────────────
// Grid para lista filtrada
// ──────────────────────────────────────────────
function FilteredGrid({ pokemon }) {
  // Mostramos máx 100 resultados para no sobrecargar
  const visible = pokemon.slice(0, 100);

  return (
    <Grid>
      {visible.map((p, i) => (
        <FilteredCard key={p.name} name={p.name} index={i} />
      ))}
    </Grid>
  );
}

function FilteredCard({ name, index }) {
  const { data, isLoading } = useGetPokemonDetailQuery(name);

  if (isLoading) return <PokemonCardSkeleton />;
  if (!data) return null;
  return <PokemonCard pokemon={data} index={index} />;
}

export default Home;
