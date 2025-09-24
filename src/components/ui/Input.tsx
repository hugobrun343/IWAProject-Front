import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { theme } from '../../styles/theme';

export function Input(props: TextInputProps) {
  return (
    <TextInput
      style={[styles.input, props.style]}
      placeholderTextColor={theme.colors.mutedForeground}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 36,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.inputBackground,
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
  },
});
