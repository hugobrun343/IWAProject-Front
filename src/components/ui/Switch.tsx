import React from 'react';
import { Switch as RNSwitch, View, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export function Switch({ value, onValueChange, disabled = false }: SwitchProps) {
  return (
    <View style={styles.container}>
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: theme.colors.border,
          true: theme.colors.primary
        }}
        thumbColor={value ? theme.colors.primaryForeground : theme.colors.background}
        ios_backgroundColor={theme.colors.border}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
