import React from 'react';
import { NavLink } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import useOnlineStatus from '../../hooks/useOnlineStatus';
import { useAppSelector } from '../../app/hooks';
import { selectTeamCount } from '../../features/team/teamSlice';
import { selectIsOnline } from '../../features/connection/connectionSlice';

const slideDown = keyframes`
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Wrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 72px;
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  background: rgba(10, 10, 15, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  animation: ${slideDown} 0.4s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

const Logo = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.4rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
  text-decoration: none;
  letter-spacing: -0.02em;

  span.accent {
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    width: 32px;
    height: 32px;
    animation: spin 8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.1rem;
    svg { width: 24px; height: 24px; }
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-left: auto;
`;

const NavItem = styled(NavLink)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: color ${({ theme }) => theme.transitions.fast},
              background ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.surfaceHover};
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primaryGlow};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 8px 10px;
    font-size: 0.75rem;
    gap: 4px;
  }
`;

const TeamBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 50%;
  font-size: 0.65rem;
  font-weight: 700;
  line-height: 1;
`;

const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: ${({ theme }) => theme.spacing.md};
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.7rem;
  font-weight: 500;
  color: ${({ $online, theme }) =>
    $online ? theme.colors.success : theme.colors.accent};
  background: ${({ $online }) =>
    $online ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255, 107, 107, 0.1)'};
  border: 1px solid ${({ $online, theme }) =>
    $online ? 'rgba(74, 222, 128, 0.3)' : 'rgba(255, 107, 107, 0.3)'};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

const Dot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  animation: ${({ $online }) => $online ? 'none' : 'pulse 1.5s ease-in-out infinite'};

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
`;

// SVG del pokeball para el logo
const PokeballIcon = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.3"/>
    <path d="M4 50 h92" stroke="currentColor" strokeWidth="8"/>
    <circle cx="50" cy="50" r="14" fill="none" stroke="currentColor" strokeWidth="8"/>
    <circle cx="50" cy="50" r="6" fill="currentColor"/>
    <path d="M4 50 a46 46 0 0 1 92 0" fill="currentColor" opacity="0.15"/>
  </svg>
);

function Header() {
  const teamCount = useAppSelector(selectTeamCount);
  const isOnline = useAppSelector(selectIsOnline);
  
  // Custom selector para saber si hay queries de rtk-query en estado 'pending'
  const isFetching = useAppSelector((state) => 
    Object.values(state.pokemonApi.queries).some(q => q && q.status === 'pending')
  );

  return (
    <Wrapper>
      <Logo to="/" id="header-logo">
        <PokeballIcon />
        Poké<span className="accent">dex</span>
      </Logo>

      <Nav>
        <NavItem to="/" end id="nav-home">
          <span>🔍</span>
          <span>Explorar</span>
        </NavItem>
        <NavItem to="/team" id="nav-team">
          <span>⚔️</span>
          <span>Mi Equipo</span>
          {teamCount > 0 && <TeamBadge>{teamCount}</TeamBadge>}
        </NavItem>
        <NavItem to="/compare" id="nav-compare">
          <span>⚖️</span>
          <span>Comparar</span>
        </NavItem>

        <ConnectionStatus $online={isOnline} id="connection-status">
          <Dot $online={isOnline} />
          {isOnline ? 'Online' : 'Offline'}
        </ConnectionStatus>
        {isFetching && (
          <ConnectionStatus $online={true} style={{ color: '#a78bfa', background: 'rgba(167, 139, 250, 0.1)', borderColor: 'rgba(167, 139, 250, 0.3)' }}>
            <Dot $online={false} style={{ animation: 'pulse 1s infinite' }} />
            Actualizando...
          </ConnectionStatus>
        )}
      </Nav>
    </Wrapper>
  );
}

export default Header;
