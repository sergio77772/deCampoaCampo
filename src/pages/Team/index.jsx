import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import toast from 'react-hot-toast';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectTeam,
  selectTeamCount,
  removeFromTeam,
  clearTeam,
  MAX_TEAM,
} from '../../features/team/teamSlice';
import TypeBadge from '../../components/TypeBadge';
import EmptyState from '../../components/EmptyState';
import { capitalize, formatPokemonId } from '../../utils/pokemonUtils';

// ──── Styled Components ────
const PageWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TitleGroup = styled.div``;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const SlotBar = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Slot = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 2px solid ${({ $filled, theme }) =>
    $filled ? theme.colors.primary : theme.colors.border};
  background: ${({ $filled, theme }) =>
    $filled ? theme.colors.primaryGlow : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: ${({ $filled, theme }) =>
    $filled ? theme.colors.primary : theme.colors.text.muted};
  font-weight: 700;
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const ClearButton = styled.button`
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.accentGlow};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    color: white;
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-12px); }
  to { opacity: 1; transform: translateX(0); }
`;

const MemberCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  animation: ${slideIn} 0.3s ease both;
  animation-delay: ${({ $index }) => $index * 60}ms;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
    transform: translateX(4px);
  }
`;

const MemberSprite = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
  flex-shrink: 0;
`;

const MemberInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const MemberNumber = styled.div`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.text.muted};
  font-weight: 600;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
`;

const MemberName = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  text-transform: capitalize;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TypesRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const RemoveButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.muted};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.accentGlow};
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    transform: scale(1.1);
  }
`;

const SlotNumber = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryGlow};
  border: 1px solid ${({ theme }) => theme.colors.borderHover};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

// ──────────────────────────────────────────────
function Team() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const team = useAppSelector(selectTeam);
  const teamCount = useAppSelector(selectTeamCount);

  const handleRemove = (id, name) => {
    dispatch(removeFromTeam(id));
    toast(`${capitalize(name)} removido del equipo`, { icon: '💔' });
  };

  const handleClearAll = () => {
    if (window.confirm('¿Querés vaciar el equipo completo?')) {
      dispatch(clearTeam());
      toast('Equipo vaciado', { icon: '🗑️' });
    }
  };

  return (
    <PageWrapper>
      <Header>
        <TitleGroup>
          <PageTitle>⚔️ Mi Equipo</PageTitle>
          <Subtitle>
            {teamCount}/{MAX_TEAM} pokémon — como en los juegos, máximo 6
          </Subtitle>
        </TitleGroup>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end' }}>
          {/* Indicador de slots */}
          <SlotBar>
            {Array.from({ length: MAX_TEAM }).map((_, i) => (
              <Slot key={i} $filled={i < teamCount} id={`team-slot-${i + 1}`}>
                {i < teamCount ? '●' : '○'}
              </Slot>
            ))}
          </SlotBar>

          {teamCount > 0 && (
            <ClearButton onClick={handleClearAll} id="team-clear-all">
              🗑️ Vaciar equipo
            </ClearButton>
          )}
        </div>
      </Header>

      {teamCount === 0 ? (
        <EmptyState
          emoji="🏟️"
          title="El equipo está vacío"
          description="Todavía no agregaste ningún pokémon a tu equipo. Explorá la Pokédex y agregá hasta 6 pokémon."
          actionLabel="Ir a explorar"
          onAction={() => navigate('/')}
          minHeight="400px"
        />
      ) : (
        <TeamGrid>
          {team.map((member, index) => (
            <MemberCard
              key={member.id}
              $index={index}
              onClick={() => navigate(`/pokemon/${member.name}`)}
              id={`team-member-${member.id}`}
            >
              <SlotNumber>{index + 1}</SlotNumber>
              <MemberSprite
                src={member.sprite}
                alt={member.name}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <MemberInfo>
                <MemberNumber>{formatPokemonId(member.id)}</MemberNumber>
                <MemberName>{capitalize(member.name)}</MemberName>
                <TypesRow>
                  {member.types?.map((type) => (
                    <TypeBadge key={type} type={type} />
                  ))}
                </TypesRow>
              </MemberInfo>
              <RemoveButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(member.id, member.name);
                }}
                aria-label={`Remover ${member.name} del equipo`}
                id={`team-remove-${member.id}`}
              >
                ✕
              </RemoveButton>
            </MemberCard>
          ))}
        </TeamGrid>
      )}
    </PageWrapper>
  );
}

export default Team;
