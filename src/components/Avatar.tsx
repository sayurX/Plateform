import React from 'react';
import { View, Text, Image, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '@/theme/colors';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const Avatar = ({ uri, name, size = 100, style }: AvatarProps) => {
  const firstLetter = name?.trim().charAt(0).toUpperCase() || '?';
  
  if (uri && uri !== '') {
    return (
      <Image 
        source={{ uri }} 
        style={[{ width: size, height: size, borderRadius: size / 2 }, style as any]} 
      />
    );
  }

  return (
    <View style={[
      styles.fallback, 
      { width: size, height: size, borderRadius: size / 2 }, 
      style
    ]}>
      <Text style={[styles.letter, { fontSize: size * 0.4 }]}>{firstLetter}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: '#FFE5D4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
