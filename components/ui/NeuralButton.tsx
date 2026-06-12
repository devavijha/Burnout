import React, { useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { Radius, Typography, Shadow } from '@/constants/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface NeuralButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const SOLID_COLORS: Record<string, string> = {
  primary:   Colors.primary,
  secondary: Colors.secondary,
  ghost:     'transparent',
  danger:    Colors.danger,
  success:   Colors.positive,
};

const TEXT_COLORS: Record<string, string> = {
  primary:   Colors.textInverse,
  secondary: Colors.textInverse,
  ghost:     Colors.primary,
  danger:    Colors.textInverse,
  success:   Colors.textInverse,
};

const SIZES = {
  sm: { height: 36, fontSize: 13, px: 16 },
  md: { height: 48, fontSize: 15, px: 24 },
  lg: { height: 54, fontSize: 16, px: 32 },
};

export const NeuralButton: React.FC<NeuralButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  fullWidth = true,
}) => {
  const scale   = useSharedValue(1);
  const opacity = useSharedValue(disabled ? 0.4 : 1);
  const s = SIZES[size];

  useEffect(() => {
    opacity.value = withTiming(disabled ? 0.4 : 1, { duration: 200 });
  }, [disabled]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSequence(
      withTiming(1.01, { duration: 80 }),
      withTiming(1.0,  { duration: 120 }),
    );
  };

  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const isGhost = variant === 'ghost';
  const bgColor = SOLID_COLORS[variant];
  const txtColor = TEXT_COLORS[variant];

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      disabled={disabled || loading}
      style={[
        styles.wrapper,
        Shadow.md,
        {
          height: s.height,
          borderRadius: Radius.lg,
          width: fullWidth ? '100%' : undefined,
          backgroundColor: bgColor,
          borderColor: isGhost ? Colors.borderActive : 'transparent',
          borderWidth: isGhost ? 1.5 : 0,
          paddingHorizontal: s.px,
        },
        isGhost && { ...Shadow.sm, backgroundColor: Colors.surface },
        animStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={txtColor} size="small" />
      ) : (
        <>
          {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
          <Text
            style={[
              {
                color: txtColor,
                fontSize: s.fontSize,
                fontWeight: '600',
                letterSpacing: -0.1,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default NeuralButton;
