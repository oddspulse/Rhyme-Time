export const theme = {
  colors: {
    // Background
    background: '#1a1a2e',
    backgroundGradientStart: '#1a1a2e',
    backgroundGradientEnd: '#16213e',

    // Accents
    primary: '#c9ff00', // Electric lime
    secondary: '#ff006e', // Hot coral
    tertiary: '#f8f8f2', // Soft cream

    // Feedback
    success: '#06ffa5', // Bright mint
    perfect: '#06ffa5',
    good: '#ffbe0b',
    miss: '#ff006e',
    error: '#ff006e',

    // UI
    card: '#2d2d44',
    cardActive: '#3d3d5c',
    text: '#f8f8f2',
    textMuted: '#a0a0b0',
    textDark: '#1a1a2e',

    // Overlay
    overlay: 'rgba(26, 26, 46, 0.9)',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    huge: 48,
  },

  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },

  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 10.32,
      elevation: 16,
    },
  },
};

export type Theme = typeof theme;
