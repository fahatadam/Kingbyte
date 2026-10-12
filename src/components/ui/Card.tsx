import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { Palette, Radius, Spacing } from '@/constants/theme';

interface CardProps extends ViewProps {
  elevated?: boolean;
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
}

export function Card({ elevated = false, style, children, ...props }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        elevated ? styles.elevated : styles.standard,
        style,
      ]}
      {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
  },
  standard: {
    backgroundColor: Palette.midnightSlate,
  },
  elevated: {
    backgroundColor: Palette.elevatedCard,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
});
