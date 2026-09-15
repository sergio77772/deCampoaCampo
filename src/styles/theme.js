// Design tokens - Sistema de diseño central
export const theme = {
  colors: {
    background: '#0a0a0f',
    surface: '#13131a',
    surfaceHover: '#1a1a26',
    surfaceElevated: '#1e1e2e',
    border: 'rgba(255,255,255,0.07)',
    borderHover: 'rgba(108, 99, 255, 0.4)',

    primary: '#6c63ff',
    primaryHover: '#7c74ff',
    primaryGlow: 'rgba(108, 99, 255, 0.25)',
    accent: '#ff6b6b',
    accentHover: '#ff8080',
    accentGlow: 'rgba(255, 107, 107, 0.25)',
    success: '#4ade80',
    warning: '#fbbf24',
    info: '#38bdf8',

    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
      muted: '#475569',
      inverse: '#0a0a0f',
    },

    types: {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC',
      shadow: '#3d3d6b',
      unknown: '#68A090',
    },

    generations: {
      1: '#ff6b6b',
      2: '#ffd93d',
      3: '#6bcb77',
      4: '#4d96ff',
      5: '#c77dff',
      6: '#ff9a3c',
      7: '#00b4d8',
      8: '#f72585',
      9: '#b5e48c',
    },

    stats: {
      hp: '#ff6b6b',
      attack: '#f08030',
      defense: '#6890f0',
      'special-attack': '#f85888',
      'special-defense': '#78c850',
      speed: '#f8d030',
    },
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '40px',
    '2xl': '64px',
  },

  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },

  shadows: {
    card: '0 4px 24px rgba(0,0,0,0.4)',
    cardHover: '0 8px 40px rgba(108, 99, 255, 0.2)',
    glow: '0 0 20px rgba(108, 99, 255, 0.35)',
    accentGlow: '0 0 20px rgba(255, 107, 107, 0.35)',
    inner: 'inset 0 1px 0 rgba(255,255,255,0.05)',
  },

  transitions: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '400ms ease',
  },

  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    display: "'Outfit', 'Inter', sans-serif",
  },

  breakpoints: {
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

export default theme;
