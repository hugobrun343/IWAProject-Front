import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from './Button';
import { Icon } from './Icon';
import { theme } from '../../styles/theme';

interface PageHeaderProps {
  title: string;
  icon?: string;
  onBack?: () => void;
  rightButton?: {
    icon: string;
    onPress: () => void;
  };
  showBackButton?: boolean;
}

export function PageHeader({ 
  title, 
  icon, 
  onBack, 
  rightButton, 
  showBackButton = false 
}: PageHeaderProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {showBackButton && onBack ? (
            <Button
              variant="ghost"
              size="sm"
              onPress={onBack}
              style={styles.backButton}
            >
              <Icon name="arrow-back" size={20} color={theme.colors.foreground} />
            </Button>
          ) : (
            <View style={styles.spacer} />
          )}
          
          <View style={styles.titleContainer}>
            {icon && (
              <Icon name={icon as any} size={20} color={theme.colors.primary} />
            )}
            <Text style={styles.title}>{title}</Text>
          </View>
          
          {rightButton ? (
            <Button
              variant="ghost"
              size="sm"
              onPress={rightButton.onPress}
              style={styles.rightButton}
            >
              <Icon name={rightButton.icon as any} size={20} color={theme.colors.foreground} />
            </Button>
          ) : (
            <View style={styles.spacer} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.foreground,
    textAlign: 'center',
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  rightButton: {
    padding: theme.spacing.sm,
  },
  spacer: {
    width: 40, // Same width as buttons for centering
  },
});
