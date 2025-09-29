import React, { useState } from 'react';
import { View, Image, StyleSheet, ImageStyle } from 'react-native';
import { Icon } from './Icon';
import { theme } from '../../styles/theme';

interface ImageWithFallbackProps {
  source: { uri: string };
  style?: ImageStyle;
  fallbackIcon?: string;
}

export function ImageWithFallback({ source, style, fallbackIcon = "Image" }: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);

  if (didError) {
    return (
      <View style={[styles.fallback, style]}>
        <Icon name={fallbackIcon as any} size={32} color={theme.colors.mutedForeground} />
      </View>
    );
  }

  return (
    <Image
      source={source}
      style={style}
      onError={() => setDidError(true)}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: theme.colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
