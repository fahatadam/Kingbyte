import { Platform } from 'react-native';

export const Palette = {
  // Brand Base
  deepNavy: '#0A0F1D',
  midnightSlate: '#121829',
  elevatedCard: '#1A2238',
  cardBorder: '#232D42',

  // Royal Blue Brand Accents
  royalBlue: '#2563EB',
  royalBlueDark: '#1D4ED8',
  royalBlueLight: '#3B82F6',
  royalBlueGlow: 'rgba(37, 99, 235, 0.18)',

  // Sovereign Gold Highlights
  gold: '#F59E0B',
  goldBright: '#FBBF24',
  goldDark: '#B45309',
  goldMuted: 'rgba(245, 158, 11, 0.16)',

  // Status & Transaction Colors
  success: '#10B981',
  successSurface: 'rgba(16, 185, 129, 0.14)',
  danger: '#EF4444',
  dangerSurface: 'rgba(239, 68, 68, 0.14)',
  warning: '#F59E0B',

  // Neutrals
  white: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  divider: '#1E293B',
} as const;

export const Colors = {
  dark: {
    background: Palette.deepNavy,
    surface: Palette.midnightSlate,
    surfaceElevated: Palette.elevatedCard,
    border: Palette.cardBorder,
    primary: Palette.royalBlue,
    primaryPressed: Palette.royalBlueDark,
    accent: Palette.gold,
    text: Palette.white,
    textSecondary: Palette.textSecondary,
    textMuted: Palette.textMuted,
    success: Palette.success,
    danger: Palette.danger,
    warning: Palette.warning,
  },
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceElevated: '#F1F5F9',
    border: '#E2E8F0',
    primary: Palette.royalBlue,
    primaryPressed: Palette.royalBlueDark,
    accent: Palette.goldDark,
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#64748B',
    success: Palette.success,
    danger: Palette.danger,
    warning: Palette.warning,
  },
} as const;

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const Typography = {
  titleLarge: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Palette.white,
    letterSpacing: -0.5,
  },
  titleMedium: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Palette.white,
    letterSpacing: -0.3,
  },
  titleSmall: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Palette.white,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: Palette.white,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Palette.textSecondary,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: Palette.textMuted,
  },
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Palette.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
  },
  currency: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Palette.white,
    letterSpacing: -0.5,
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 75 }) ?? 75;
