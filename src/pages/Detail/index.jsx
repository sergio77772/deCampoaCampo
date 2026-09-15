import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes, useTheme } from 'styled-components';
import toast from 'react-hot-toast';

import { useGetPokemonDetailQuery, useGetPokemonSpeciesQuery } from '../../services/pokemonApi';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addToTeam, removeFromTeam, selectIsInTeam, selectTeamFull } from '../../features/team/teamSlice';
import TypeBadge from '../../components/TypeBadge';
import StatBar from '../../components/StatBar';
import {
  capitalize,
  formatPokemonId,
  formatHeight,
  formatWeight,
  getFlavorText,
  buildTeamMember,
} from '../../utils/pokemonUtils';

// ──── Styled Components ────
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
`;

const PageWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  }
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
`;

const HeroSection = styled.div`
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const ImagePanel = styled.div`
  background: ${({ theme, $typeColor }) =>
    $typeColor
      ? `linear-gradient(135deg, ${$typeColor}18, ${$typeColor}08)`
      : theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -30%;
    right: -20%;
    width: 250px;
    height: 250px;
    border-radius: 50%;
    background: ${({ $typeColor }) => $typeColor ? `${$typeColor}12` : 'transparent'};
  }
`;

const MainSprite = styled.img`
  width: 220px;
  height: 220px;
  object-fit: contain;
  filter: drop-shadow(0 8px 24px rgba(0,0,0,0.5));
  animation: ${float} 4s ease-in-out infinite;
  position: relative;
  z-index: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 180px;
    height: 180px;
  }
`;

const SpriteTabs = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
`;

const SpriteThumb = styled.button`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primaryGlow : theme.colors.surfaceElevated};
  border: 2px solid ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
  cursor: pointer;
  padding: 4px;
  transition: all ${({ theme }) => theme.transitions.fast};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: pixelated;
  }
`;

const InfoPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const PokemonHeader = styled.div``;

const PokemonNumber = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.muted};
  letter-spacing: 0.08em;
  margin-bottom: 6px;
`;

const PokemonName = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
  text-transform: capitalize;
  letter-spacing: -0.02em;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TypesRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FlavorText = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.7;
  font-style: italic;
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  padding-left: 16px;
`;

const Section = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 0.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PhysicalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PhysicalItem = styled.div`
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 12px 16px;
  text-align: center;
`;

const PhysicalLabel = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
`;

const PhysicalValue = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const AbilityGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const AbilityChip = styled.div`
  padding: 6px 14px;
  background: ${({ $hidden, theme }) =>
    $hidden ? theme.colors.accentGlow : theme.colors.surfaceElevated};
  border: 1px solid ${({ $hidden, theme }) =>
    $hidden ? theme.colors.accent : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.8rem;
  font-weight: 500;
  color: ${({ $hidden, theme }) =>
    $hidden ? theme.colors.accent : theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TeamButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  border: 2px solid ${({ $inTeam, theme }) =>
    $inTeam ? theme.colors.accent : theme.colors.primary};
  background: ${({ $inTeam, theme }) =>
    $inTeam ? theme.colors.accentGlow : theme.colors.primaryGlow};
  color: ${({ $inTeam, theme }) =>
    $inTeam ? theme.colors.accent : theme.colors.primary};

  &:hover:not(:disabled) {
    background: ${({ $inTeam, theme }) =>
      $inTeam ? theme.colors.accent : theme.colors.primary};
    color: white;
    transform: translateY(-2px);
    box-shadow: ${({ $inTeam, theme }) =>
      $inTeam ? theme.shadows.accentGlow : theme.shadows.glow};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SkeletonBlock = styled.div`
  height: ${({ $h }) => $h || '24px'};
  width: ${({ $w }) => $w || '100%'};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: linear-gradient(90deg,
    ${({ theme }) => theme.colors.surfaceElevated} 25%,
    ${({ theme }) => theme.colors.surface} 50%,
    ${({ theme }) => theme.colors.surfaceElevated} 75%
  );
  background-size: 200% auto;
  animation: shimmer 1.6s linear infinite;

  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
`;

const ErrorWrapper = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

// ──────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────
function Detail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [activeSprite, setActiveSprite] = useState('official');

  const { data: pokemon, isLoading, isError, refetch } = useGetPokemonDetailQuery(name);
  const { data: species } = useGetPokemonSpeciesQuery(name);

  const isInTeam = useAppSelector(selectIsInTeam(pokemon?.id));
  const teamFull = useAppSelector(selectTeamFull);

  if (isLoading) return <DetailSkeleton />;
  if (isError) {
    return (
      <PageWrapper>
        <BackButton onClick={() => navigate(-1)} id="detail-back-error">← Volver</BackButton>
        <ErrorWrapper>
          <span style={{ fontSize: '3rem' }}>😵</span>
          <p style={{ color: '#94a3b8' }}>No se pudo cargar este pokémon</p>
          <TeamButton as="button" onClick={refetch} $inTeam={false} id="detail-retry">
            🔄 Reintentar
          </TeamButton>
        </ErrorWrapper>
      </PageWrapper>
    );
  }

  const primaryType = pokemon.types?.[0]?.type?.name;

  // Mapeo de sprites disponibles
  const sprites = {
    official: pokemon.sprites?.other?.['official-artwork']?.front_default,
    shiny: pokemon.sprites?.other?.['official-artwork']?.front_shiny,
    front: pokemon.sprites?.front_default,
    back: pokemon.sprites?.back_default,
    frontShiny: pokemon.sprites?.front_shiny,
    backShiny: pokemon.sprites?.back_shiny,
  };

  const spriteOptions = Object.entries(sprites)
    .filter(([, url]) => !!url)
    .map(([key, url]) => ({ key, url, label: spriteLabel(key) }));

  const flavorText = getFlavorText(species?.flavor_text_entries || []);

  const handleTeamToggle = () => {
    if (isInTeam) {
      dispatch(removeFromTeam(pokemon.id));
      toast(`${capitalize(pokemon.name)} removido del equipo`, { icon: '💔' });
    } else {
      if (teamFull) {
        toast.error('¡El equipo ya tiene 6 pokémon!', { icon: '⚠️' });
        return;
      }
      dispatch(addToTeam(buildTeamMember(pokemon)));
      toast.success(`${capitalize(pokemon.name)} agregado al equipo`, { icon: '⚔️' });
    }
  };

  return (
    <PageWrapper>
      <BackButton onClick={() => navigate(-1)} id="detail-back">
        ← Volver
      </BackButton>

      <HeroSection>
        {/* Panel de imagen */}
        <ImagePanel $typeColor={primaryType && theme.colors.types[primaryType]}>
          <MainSprite
            src={sprites[activeSprite] || sprites.official}
            alt={`${pokemon.name} sprite`}
          />
          <SpriteTabs>
            {spriteOptions.map(({ key, url }) => (
              <SpriteThumb
                key={key}
                $active={activeSprite === key}
                onClick={() => setActiveSprite(key)}
                id={`sprite-tab-${key}`}
                title={spriteLabel(key)}
              >
                <img src={url} alt={`${pokemon.name} ${spriteLabel(key)}`} />
              </SpriteThumb>
            ))}
          </SpriteTabs>
        </ImagePanel>

        {/* Panel de info */}
        <InfoPanel>
          <PokemonHeader>
            <PokemonNumber>{formatPokemonId(pokemon.id)}</PokemonNumber>
            <PokemonName>{capitalize(pokemon.name)}</PokemonName>
            <TypesRow>
              {pokemon.types?.map((t) => (
                <TypeBadge key={t.type.name} type={t.type.name} />
              ))}
            </TypesRow>
            {flavorText && <FlavorText>"{flavorText}"</FlavorText>}
          </PokemonHeader>

          {/* Físico */}
          <Section>
            <SectionTitle>Datos físicos</SectionTitle>
            <PhysicalGrid>
              <PhysicalItem>
                <PhysicalLabel>Altura</PhysicalLabel>
                <PhysicalValue>{formatHeight(pokemon.height)}</PhysicalValue>
              </PhysicalItem>
              <PhysicalItem>
                <PhysicalLabel>Peso</PhysicalLabel>
                <PhysicalValue>{formatWeight(pokemon.weight)}</PhysicalValue>
              </PhysicalItem>
              <PhysicalItem>
                <PhysicalLabel>Experiencia base</PhysicalLabel>
                <PhysicalValue>{pokemon.base_experience ?? '—'}</PhysicalValue>
              </PhysicalItem>
              <PhysicalItem>
                <PhysicalLabel>N.º pokédex</PhysicalLabel>
                <PhysicalValue>{pokemon.id}</PhysicalValue>
              </PhysicalItem>
            </PhysicalGrid>
          </Section>

          {/* Habilidades */}
          <Section>
            <SectionTitle>Habilidades</SectionTitle>
            <AbilityGrid>
              {pokemon.abilities?.map((a) => (
                <AbilityChip key={a.ability.name} $hidden={a.is_hidden}>
                  {a.is_hidden && <span title="Habilidad oculta">🔮</span>}
                  {capitalize(a.ability.name)}
                  {a.is_hidden && (
                    <small style={{ opacity: 0.6, fontSize: '0.65rem' }}>(oculta)</small>
                  )}
                </AbilityChip>
              ))}
            </AbilityGrid>
          </Section>

          {/* Botón equipo */}
          <TeamButton
            $inTeam={isInTeam}
            onClick={handleTeamToggle}
            id={`detail-team-btn-${pokemon.id}`}
          >
            {isInTeam ? '💔 Remover del equipo' : '⚔️ Agregar al equipo'}
          </TeamButton>
        </InfoPanel>
      </HeroSection>

      {/* Stats */}
      <Section>
        <SectionTitle>Estadísticas base</SectionTitle>
        {pokemon.stats?.map((s, i) => (
          <StatBar
            key={s.stat.name}
            statName={s.stat.name}
            value={s.base_stat}
            delay={i * 80}
          />
        ))}
      </Section>
    </PageWrapper>
  );
}

function spriteLabel(key) {
  const labels = {
    official: 'Oficial',
    shiny: 'Shiny',
    front: 'Frente',
    back: 'Dorso',
    frontShiny: 'Shiny F.',
    backShiny: 'Shiny D.',
  };
  return labels[key] || key;
}

function DetailSkeleton() {
  return (
    <PageWrapper>
      <div style={{ marginBottom: 24 }}>
        <SkeletonBlock $h="36px" $w="100px" />
      </div>
      <HeroSection>
        <div style={{ background: '#13131a', borderRadius: 24, padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SkeletonBlock $h="220px" $w="220px" style={{ borderRadius: '50%' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SkeletonBlock $h="16px" $w="80px" />
          <SkeletonBlock $h="48px" $w="60%" />
          <SkeletonBlock $h="28px" $w="40%" />
          <SkeletonBlock $h="60px" />
          <SkeletonBlock $h="120px" />
          <SkeletonBlock $h="44px" $w="200px" />
        </div>
      </HeroSection>
      <SkeletonBlock $h="260px" />
    </PageWrapper>
  );
}

export default Detail;
