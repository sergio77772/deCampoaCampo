import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, useTheme } from 'styled-components';
import toast from 'react-hot-toast';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addToTeam, removeFromTeam, selectIsInTeam, selectTeamFull } from '../../features/team/teamSlice';
import { buildTeamMember, formatPokemonId, capitalize, getSpriteUrl } from '../../utils/pokemonUtils';
import TypeBadge from '../TypeBadge';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Card = styled.article`
  position: relative;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.normal},
              box-shadow ${({ theme }) => theme.transitions.normal},
              border-color ${({ theme }) => theme.transitions.normal};
  animation: ${fadeIn} 0.35s ease both;
  animation-delay: ${({ $index }) => Math.min($index * 40, 400)}ms;
  overflow: hidden;

  /* Fondo sutil del tipo principal */
  &::before {
    content: '';
    position: absolute;
    top: -20%;
    right: -10%;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: ${({ $typeColor }) => $typeColor ? `${$typeColor}18` : 'transparent'};
    transition: transform ${({ theme }) => theme.transitions.slow};
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
    border-color: ${({ theme }) => theme.colors.borderHover};

    &::before {
      transform: scale(1.4);
    }
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const PokemonNumber = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.muted};
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 4px;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PokemonImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform ${({ theme }) => theme.transitions.normal};
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));

  ${Card}:hover & {
    transform: scale(1.08) translateY(-4px);
  }
`;

const ImageSkeleton = styled.div`
  position: absolute;
  inset: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  display: ${({ $hidden }) => $hidden ? 'none' : 'flex'};
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
`;

const PokemonName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  text-transform: capitalize;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TypesRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TeamButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  background: ${({ $inTeam, theme }) =>
    $inTeam ? theme.colors.accentGlow : theme.colors.surfaceElevated};
  border: 1px solid ${({ $inTeam, theme }) =>
    $inTeam ? theme.colors.accent : theme.colors.border};
  color: ${({ $inTeam, theme }) =>
    $inTeam ? theme.colors.accent : theme.colors.text.muted};
  transition: all ${({ theme }) => theme.transitions.fast};
  z-index: 2;

  &:hover {
    transform: scale(1.15);
    background: ${({ $inTeam, theme }) =>
      $inTeam ? theme.colors.accentGlow : theme.colors.primaryGlow};
    border-color: ${({ $inTeam, theme }) =>
      $inTeam ? theme.colors.accent : theme.colors.primary};
    color: ${({ $inTeam, theme }) =>
      $inTeam ? theme.colors.accent : theme.colors.primary};
  }

  &:active {
    transform: scale(0.95);
  }
`;

function PokemonCard({ pokemon, index = 0 }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [imgLoaded, setImgLoaded] = useState(false);

  const isInTeam = useAppSelector(selectIsInTeam(pokemon.id));
  const teamFull = useAppSelector(selectTeamFull);

  const spriteUrl = pokemon.sprites?.other?.['official-artwork']?.front_default
    || getSpriteUrl(pokemon.id);

  const primaryType = pokemon.types?.[0]?.type?.name;
  const typeColor = primaryType ? theme.colors.types[primaryType] : undefined;

  const handleCardClick = () => {
    navigate(`/pokemon/${pokemon.name}`);
  };

  const handleTeamToggle = (e) => {
    e.stopPropagation();
    if (isInTeam) {
      dispatch(removeFromTeam(pokemon.id));
      toast(`${capitalize(pokemon.name)} removido del equipo`, {
        icon: '💔',
      });
    } else {
      if (teamFull) {
        toast.error('¡El equipo ya tiene 6 pokémon!', {
          icon: '⚠️',
        });
        return;
      }
      dispatch(addToTeam(buildTeamMember(pokemon)));
      toast.success(`${capitalize(pokemon.name)} agregado al equipo`, {
        icon: '⚔️',
      });
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      $index={index}
      $typeColor={typeColor}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles de ${capitalize(pokemon.name)}`}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      id={`pokemon-card-${pokemon.id}`}
    >
      <TeamButton
        onClick={handleTeamToggle}
        $inTeam={isInTeam}
        aria-label={isInTeam ? 'Remover del equipo' : 'Agregar al equipo'}
        id={`team-btn-${pokemon.id}`}
        title={isInTeam ? 'Remover del equipo' : 'Agregar al equipo'}
      >
        {isInTeam ? '❤️' : '🤍'}
      </TeamButton>

      <PokemonNumber>{formatPokemonId(pokemon.id)}</PokemonNumber>

      <ImageWrapper>
        <ImageSkeleton $hidden={imgLoaded}>🔮</ImageSkeleton>
        <PokemonImage
          src={spriteUrl}
          alt={pokemon.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
        />
      </ImageWrapper>

      <PokemonName>{capitalize(pokemon.name)}</PokemonName>

      <TypesRow>
        {pokemon.types?.map((t) => (
          <TypeBadge key={t.type.name} type={t.type.name} />
        ))}
      </TypesRow>
    </Card>
  );
}

export default PokemonCard;
