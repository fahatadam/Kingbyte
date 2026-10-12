import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Palette, Radius, Spacing } from '@/constants/theme';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'gold'
  | 'info'
  | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'neutral', style }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[variant], style]}>
      <Text style={[styles.text, styles[`text_${variant}`]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  success: {
    backgroundColor: Palette.successSurface,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  text_success: {
    color: Palette.success,
  },

  warning: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  text_warning: {
    color: Palette.warning,
  },

  danger: {
    backgroundColor: Palette.dangerSurface,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  text_danger: {
    color: Palette.danger,
  },

  gold: {
    backgroundColor: Palette.goldMuted,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  text_gold: {
    color: Palette.goldBright,
  },

  info: {
    backgroundColor: Palette.royalBlueGlow,
    borderColor: 'rgba(37, 99, 235, 0.3)',
  },
  text_info: {
    color: Palette.royalBlueLight,
  },

  neutral: {
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    borderColor: Palette.cardBorder,
  },
  text_neutral: {
    color: Palette.textSecondary,
  },
});
