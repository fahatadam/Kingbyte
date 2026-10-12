import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Palette, Radius, Spacing } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        pressed && !isDisabled && styles[`pressed_${variant}`],
        isDisabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'accent' ? '#000000' : Palette.white}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
          <Text
            style={[
              styles.textBase,
              styles[`text_${variant}`],
              styles[`textSize_${size}`],
              textStyle,
            ]}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  textBase: {
    fontWeight: '600',
    textAlign: 'center',
  },

  // Variants
  primary: {
    backgroundColor: Palette.royalBlue,
  },
  pressed_primary: {
    backgroundColor: Palette.royalBlueDark,
  },
  accent: {
    backgroundColor: Palette.gold,
  },
  pressed_accent: {
    backgroundColor: Palette.goldDark,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Palette.cardBorder,
  },
  pressed_outline: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  pressed_ghost: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  danger: {
    backgroundColor: Palette.danger,
  },
  pressed_danger: {
    backgroundColor: '#DC2626',
  },

  // Text Variants
  text_primary: {
    color: Palette.white,
  },
  text_accent: {
    color: '#0A0F1D',
    fontWeight: '700',
  },
  text_outline: {
    color: Palette.white,
  },
  text_ghost: {
    color: Palette.textSecondary,
  },
  text_danger: {
    color: Palette.white,
  },

  // Sizes
  size_sm: {
    height: 36,
    paddingHorizontal: Spacing.md,
  },
  size_md: {
    height: 48,
    paddingHorizontal: Spacing.lg,
  },
  size_lg: {
    height: 54,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.lg,
  },

  textSize_sm: {
    fontSize: 13,
  },
  textSize_md: {
    fontSize: 15,
  },
  textSize_lg: {
    fontSize: 16,
    fontWeight: '700',
  },

  disabled: {
    opacity: 0.5,
  },
});
