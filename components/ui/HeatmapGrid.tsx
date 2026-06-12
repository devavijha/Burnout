import React, { useEffect } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';

const { width: W } = Dimensions.get('window');

interface HeatmapCell {
  hour: number;
  day: number;
  /** 0–100 intensity */
  value: number;
}

interface HeatmapGridProps {
  data: HeatmapCell[];
  days?: string[];
  hours?: number;
  cellSize?: number;
  animated?: boolean;
}

const DEFAULT_DAYS  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DEFAULT_HOURS = 24;

function valueToColor(value: number): string {
  if (value <= 20) return Colors.positive;
  if (value <= 45) return Colors.warning;
  if (value <= 70) return Colors.energy;
  return Colors.danger;
}

function valueToOpacity(value: number): number {
  return 0.15 + (value / 100) * 0.85;
}

const AnimatedCell: React.FC<{
  value: number;
  cellSize: number;
  animDelay: number;
  animated: boolean;
}> = ({ value, cellSize, animDelay, animated }) => {
  const opacity = useSharedValue(0);
  const scale   = useSharedValue(0.6);

  useEffect(() => {
    if (animated) {
      opacity.value = withDelay(
        animDelay,
        withTiming(valueToOpacity(value), { duration: 400, easing: Easing.out(Easing.cubic) }),
      );
      scale.value = withDelay(
        animDelay,
        withTiming(1, { duration: 400, easing: Easing.out(Easing.back(1.5)) }),
      );
    } else {
      opacity.value = valueToOpacity(value);
      scale.value = 1;
    }
  }, [value, animated]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width:  cellSize - 2,
          height: cellSize - 2,
          borderRadius: 3,
          backgroundColor: valueToColor(value),
          margin: 1,
        },
        style,
      ]}
    />
  );
};

export const HeatmapGrid: React.FC<HeatmapGridProps> = ({
  data,
  days = DEFAULT_DAYS,
  hours = DEFAULT_HOURS,
  cellSize,
  animated = true,
}) => {
  const availableW = W - 64; // margins
  const cs         = cellSize ?? Math.floor(availableW / hours) - 1;

  // Build lookup map
  const lookup: Record<string, number> = {};
  data.forEach((d) => {
    lookup[`${d.day}-${d.hour}`] = d.value;
  });

  return (
    <View>
      {days.map((day, di) => (
        <View key={day} style={styles.row}>
          {Array.from({ length: hours }, (_, hi) => {
            const val = lookup[`${di}-${hi}`] ?? 0;
            const delay = (di * hours + hi) * 8;
            return (
              <AnimatedCell
                key={hi}
                value={val}
                cellSize={cs}
                animDelay={delay}
                animated={animated}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 2,
  },
});

export default HeatmapGrid;
