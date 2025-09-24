import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../styles/theme';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  children,
  onPress,
  variant = 'default',
  size = 'default',
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.text,
        styles[`text_${variant}`],
        styles[`textSize_${size}`],
        disabled && styles.textDisabled,
        textStyle,
      ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
  },
  default: { backgroundColor: theme.colors.primary },
  destructive: { backgroundColor: theme.colors.destructive },
  outline: { backgroundColor: theme.colors.background, borderWidth: 1, borderColor: theme.colors.border },
  secondary: { backgroundColor: theme.colors.secondary },
  ghost: { backgroundColor: 'transparent' },
  link: { backgroundColor: 'transparent' },
  size_default: { height: 36, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.sm },
  size_sm: { height: 32, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.xs },
  size_lg: { height: 40, paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.md },
  size_icon: { height: 36, width: 36, paddingHorizontal: 0, paddingVertical: 0 },
  text: { fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.medium, textAlign: 'center' },
  text_default: { color: theme.colors.primaryForeground },
  text_destructive: { color: theme.colors.destructiveForeground },
  text_outline: { color: theme.colors.foreground },
  text_secondary: { color: theme.colors.secondaryForeground },
  text_ghost: { color: theme.colors.foreground },
  text_link: { color: theme.colors.primary, textDecorationLine: 'underline' },
  textSize_default: { fontSize: theme.fontSize.sm },
  textSize_sm: { fontSize: theme.fontSize.xs },
  textSize_lg: { fontSize: theme.fontSize.base },
  textSize_icon: { fontSize: theme.fontSize.sm },
  disabled: { opacity: 0.5 },
  textDisabled: { opacity: 0.5 },
});

export { Button };
