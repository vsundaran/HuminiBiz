export const COLORS = {
  primary: '#263238',
  darkPrimary: '#263238',
  surfaceBluePrimary: '#263238',
  background2: 'rgba(255, 255, 255, 0.6)', // mapped from #ffffff99
  textMainHeadline: '#263238',
  textSubHeadline: '#515B60',
  textPlaceholder: '#9BA1A3',
  textDisabled: '#9B9B9B',
  textBodyText1: '#6E767A',
  surfaceDisabledBackground: '#DDDDDD',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FFCC00',
  brandYellow: '#F0C400',
  redBackground: '#FFEAEA',
  textRedDarkest: '#705B5B',
  purpleBackground: '#FCECFF',
  textPurpleDark: '#5D4D60',
  greenBackground: 'rgba(223, 255, 212, 0.6)',
  textGreenDark: '#486333',
  selectedTabBlue: '#0C557B',
  textBlueWhite: '#FDFEFF',
};

export const SIZES = {
  space400: 16,
  radius200: 8,
  strokeBorder: 1,
};

export const FONTS = {
  family: 'DM Sans',
  weights: {
    medium: '500',
    semiBold: '600',
    bold: '700',
  } as const,
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
  lineHeights: {
    '20': 20,
    '24': 24,
    '30': 30,
  },
  letterSpacings: {
    '0': 0,
    '0.1': 0.1,
    '0.15': 0.15,
    '-1': -1,
  },
  styles: {
    subTitleSemibold14: {
      fontFamily: 'DM Sans',
      fontWeight: '600' as const,
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    bodyMedium14: {
      fontFamily: 'DM Sans',
      fontWeight: '500' as const,
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0,
    },
    headlineBold24: {
      fontFamily: 'DM Sans',
      fontWeight: '700' as const,
      fontSize: 24,
      lineHeight: 30,
      letterSpacing: -1,
    },
    bodySemibold16: {
      fontFamily: 'DM Sans',
      fontWeight: '600' as const,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0,
    },
    subTitleBold16: {
      fontFamily: 'DM Sans',
      fontWeight: '700' as const,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.15,
    },
  },
};