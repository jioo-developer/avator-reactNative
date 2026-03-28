import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';

export default function TabBarBackground() {
  return (
    <BlurView
      tint={Platform.OS === 'ios' ? 'systemChromeMaterial' : 'default'}
      intensity={80}
      style={StyleSheet.absoluteFill}
    />
  );
}
