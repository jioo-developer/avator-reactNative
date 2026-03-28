import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

type IconSymbolProps = {
  name: SymbolViewProps['name'];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
};

export function IconSymbol({ name, size = 24, color, style }: IconSymbolProps) {
  return <SymbolView name={name} size={size} tintColor={color} style={style} />;
}
