import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Colors, BurnoutColors } from '@/constants/colors';
import { Typography, Radius, Shadow } from '@/constants/theme';

interface BurnoutScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  pulse?: boolean;
}

function getBurnoutLevel(score: number) {
  if (score <= 30) return { level: 'Optimal',   color: BurnoutColors.safe,     bg: 'rgba(52, 197, 133, 0.10)' };
  if (score <= 60) return { level: 'Moderate',  color: BurnoutColors.moderate, bg: 'rgba(240, 169, 73, 0.10)' };
  if (score <= 80) return { level: 'High Risk', color: BurnoutColors.high,     bg: 'rgba(239, 139, 90, 0.10)' };
  return             { level: 'Critical',  color: BurnoutColors.critical, bg: 'rgba(232, 93, 111, 0.10)' };
}

const SIZES = {
  sm: { score: 20, label: 10, px: 10, py: 6 },
  md: { score: 28, label: 11, px: 14, py: 8 },
  lg: { score: 40, label: 13, px: 20, py: 12 },
};

export const BurnoutScoreBadge: React.FC<BurnoutScoreBadgeProps> = ({
  score,
  size = 'md',
  showLabel = true,
  pulse: _pulse = true,
}) => {
  const { level, color, bg } = getBurnoutLevel(score);
  const s = SIZES[size];

  return (
    <View
      style={[
        styles.container,
        Shadow.sm,
        {
          backgroundColor: bg,
          borderColor: `${color}30`,
          paddingHorizontal: s.px,
          paddingVertical: s.py,
          borderRadius: Radius.lg,
        },
      ]}
    >
      <Text style={[styles.score, { fontSize: s.score, color }]}>
        {score}
      </Text>
      {showLabel && (
        <Text style={[styles.label, { fontSize: s.label, color }]}>
          {level}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  score: {
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.3,
    marginTop: 2,
  },
});

export default BurnoutScoreBadge;
