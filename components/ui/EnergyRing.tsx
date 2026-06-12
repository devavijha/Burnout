import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/theme';

interface EnergyRingProps {
  /** 0–100 */
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  showValue?: boolean;
  animate?: boolean;
  color?: string;
}

export const EnergyRing: React.FC<EnergyRingProps> = ({
  value,
  size = 200,
  strokeWidth = 12,
  label,
  sublabel,
  showValue = true,
  animate = true,
  color,
}) => {
  const radius        = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  const pulseScale  = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    if (animate) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(1.0,  { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 2000 }),
          withTiming(0.2, { duration: 2000 }),
        ),
        -1,
        false,
      );
    }
  }, [animate]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: pulseScale.value }],
  }));

  const ringColor = color ?? (
    value > 80 ? Colors.danger :
    value > 60 ? Colors.energy :
    value > 30 ? Colors.warning :
    Colors.positive
  );

  const dashOffset = circumference * (1 - value / 100);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Subtle outer glow */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: size + 16,
            height: size + 16,
            borderRadius: (size + 16) / 2,
            borderWidth: 1,
            borderColor: ringColor,
          },
          glowStyle,
        ]}
      />

      {/* SVG ring */}
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%"   stopColor={ringColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={ringColor} stopOpacity="0.6" />
          </LinearGradient>
        </Defs>

        {/* Background track */}
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={Colors.glass30}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Active arc */}
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="url(#ringGrad)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${cx}, ${cy}`}
        />
      </Svg>

      {/* Center content */}
      {showValue && (
        <View style={[StyleSheet.absoluteFill, styles.center]}>
          {label && (
            <Text style={[Typography.caption, { color: Colors.textMuted, marginBottom: 4 }]}>
              {label}
            </Text>
          )}
          <Text style={[Typography.metric, { color: ringColor }]}>
            {value}
          </Text>
          {sublabel && (
            <Text style={[Typography.bodySmall, { color: Colors.textMuted, marginTop: 4 }]}>
              {sublabel}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EnergyRing;
