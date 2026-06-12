import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

interface NeuralBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

export const NeuralBackground: React.FC<NeuralBackgroundProps> = () => {
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.background }]} pointerEvents="none" />
  );
};

export default NeuralBackground;
