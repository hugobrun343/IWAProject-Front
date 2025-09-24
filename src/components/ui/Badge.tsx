import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../styles/theme';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({ children, variant = 'default', style, textStyle }: BadgeProps) {
  return (
    <View style={[styles.base, styles[variant], style]}>
      <Text style={[styles.text, styles[`text_${variant}`], textStyle]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
  },
  default: { backgroundColor: theme.colors.primary },
  secondary: { backgroundColor: theme.colors.secondary },
  destructive: { backgroundColor: theme.colors.destructive },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.border },
  text: { fontSize: theme.fontSize.xs, fontWeight: theme.fontWeight.medium },
  text_default: { color: theme.colors.primaryForeground },
  text_secondary: { color: theme.colors.secondaryForeground },
  text_destructive: { color: theme.colors.destructiveForeground },
  text_outline: { color: theme.colors.foreground },
});

export { Badge };
