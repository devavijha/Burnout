import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';

interface PulseRingProps {
  size?: number;
  color?: string;
  rings?: number;
  speed?: 'slow' | 'normal' | 'fast';
  children?: React.ReactNode;
}

const SPEEDS = { slow: 2800, normal: 1800, fast: 1000 };

export const PulseRing: React.FC<PulseRingProps> = ({
  size = 100,
  color = Colors.primary,
  rings = 3,
  speed = 'normal',
  children,
}) => {
  const duration = SPEEDS[speed];

  const pulses = Array.from({ length: rings }, (_, i) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const scale   = useSharedValue(1);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const opacity = useSharedValue(0.7);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const delay = (i / rings) * duration;
      scale.value = withRepeat(
        withTiming(2.5, {
          duration,
          easing: Easing.out(Easing.cubic),
        }),
        -1,
        false,
      );
      opacity.value = withRepeat(
        withTiming(0, { duration, easing: Easing.out(Easing.cubic) }),
        -1,
        false,
      );
    }, []);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const style = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }));

    return { style };
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {pulses.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.ring,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: color,
            },
            p.style,
          ]}
        />
      ))}
      {children && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <View style={styles.center}>{children}</View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    borderWidth: 2,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PulseRing;
