import React, { useState } from 'react';
import { View, Image, StyleSheet, ImageStyle } from 'react-native';
import { Icon } from './Icon';
import { theme } from '../../styles/theme';

interface ImageWithFallbackProps {
  src: string;
  alt?: string;
  style?: ImageStyle;
}

export function ImageWithFallback({ src, alt, style }: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);

  if (didError) {
    return (
      <View style={[styles.fallback, style]}>
        <Icon name="Image" size={32} color={theme.colors.mutedForeground} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: src }}
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
