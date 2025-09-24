import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { theme } from '../../styles/theme';

interface TextareaProps extends TextInputProps {
  rows?: number;
}

export function Textarea({ rows = 4, ...props }: TextareaProps) {
  return (
    <TextInput
      style={[styles.textarea, { height: rows * 24 }, props.style]}
      placeholderTextColor={theme.colors.mutedForeground}
      multiline
      textAlignVertical="top"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  textarea: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.inputBackground,
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
  },
});
