import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { Icon } from './Icon';
import { theme } from '../../styles/theme';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: SelectOption[];
  style?: any;
}

export function Select({ value, onValueChange, placeholder, options, style }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (selectedValue: string) => {
    onValueChange?.(selectedValue);
    setIsOpen(false);
  };

  return (
    <View style={style}>
      <TouchableOpacity 
        style={styles.trigger}
        onPress={() => setIsOpen(true)}
      >
        <Text style={[styles.triggerText, !selectedOption && styles.placeholder]}>
          {selectedOption?.label || placeholder}
        </Text>
        <Icon name="ChevronRight" size={16} color={theme.colors.mutedForeground} />
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.content}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, item.value === value && styles.selectedOption]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={[styles.optionText, item.value === value && styles.selectedOptionText]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 36,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.inputBackground,
  },
  triggerText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
  },
  placeholder: {
    color: theme.colors.mutedForeground,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    maxHeight: 300,
    width: '80%',
    ...theme.shadows.md,
  },
  option: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectedOption: {
    backgroundColor: theme.colors.primary + '10',
  },
  optionText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
  },
  selectedOptionText: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
});
