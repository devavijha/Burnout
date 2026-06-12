import React from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
  StyleProp,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { Radius, Shadow } from '@/constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  accentColor?: string;
  glowAccent?: boolean;
  blur?: number;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'danger';
  glow?: boolean;
  padding?: number;
  borderRadius?: number;
}

const ACCENT_COLORS: Record<string, string> = {
  default:   Colors.borderSubtle,
  primary:   Colors.primary,
  secondary: Colors.secondary,
  success:   Colors.positive,
  danger:    Colors.danger,
};

const TINT_COLORS: Record<string, string> = {
  default:   Colors.surface,
  primary:   'rgba(45, 181, 163, 0.04)',
  secondary: 'rgba(124, 107, 240, 0.04)',
  success:   'rgba(52, 197, 133, 0.04)',
  danger:    'rgba(232, 93, 111, 0.04)',
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  accentColor,
  glowAccent = false,
  blur: _blur,
  variant = 'default',
  glow = false,
  padding = 16,
  borderRadius = Radius.xl,
}) => {
  const borderColor = accentColor ?? ACCENT_COLORS[variant];
  const tintBg = TINT_COLORS[variant];

  return (
    <View
      style={[
        styles.wrapper,
        Shadow.sm,
        {
          borderRadius,
          borderColor: variant === 'default' ? Colors.borderSubtle : `${borderColor}20`,
          backgroundColor: tintBg,
        },
        glow && Shadow.glow,
        style,
      ]}
    >
      {glowAccent && (
        <View
          style={[
            styles.accentBar,
            { backgroundColor: borderColor, borderRadius: 2 },
          ]}
        />
      )}

      <View style={[styles.content, { padding }]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 12,
    bottom: 12,
    width: 3,
    zIndex: 2,
  },
});

export default GlassCard;
