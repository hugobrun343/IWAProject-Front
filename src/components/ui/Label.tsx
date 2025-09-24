import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { theme } from '../../styles/theme';

interface LabelProps extends TextProps {
  children: React.ReactNode;
}

export function Label({ children, style, ...props }: LabelProps) {
  return (
    <Text style={[styles.label, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.xs,
  },
});
