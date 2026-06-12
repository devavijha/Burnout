import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';
import { Typography, Radius, Spacing } from '@/constants/theme';
import { GlassCard } from './GlassCard';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  trend?: number;
  icon?: React.ReactNode;
  accentColor?: string;
  style?: ViewStyle;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  subtitle,
  trend,
  icon,
  accentColor = Colors.primary,
  style,
}) => {
  const trendUp    = trend !== undefined && trend > 0;
  const trendDown  = trend !== undefined && trend < 0;
  const trendColor = trendUp ? Colors.danger : trendDown ? Colors.positive : Colors.textMuted;

  return (
    <GlassCard style={style} padding={16}>
      <View style={styles.topRow}>
        <View style={[styles.indicator, { backgroundColor: accentColor }]} />
        <Text style={[Typography.caption, { color: Colors.textMuted }]}>{label}</Text>
        {icon && <View style={styles.iconWrap}>{icon}</View>}
      </View>

      <View style={styles.valueRow}>
        <Text style={[Typography.metricSm, { color: Colors.textPrimary }]}>{value}</Text>
        {unit && (
          <Text style={[Typography.bodySmall, { color: Colors.textMuted, marginLeft: 4, marginTop: 4 }]}>
            {unit}
          </Text>
        )}
      </View>

      {(subtitle || trend !== undefined) && (
        <View style={styles.bottomRow}>
          {trend !== undefined && (
            <View style={[styles.trendBadge, { backgroundColor: `${trendColor}12` }]}>
              <Text style={[Typography.bodySmall, { color: trendColor, fontSize: 12, fontWeight: '600' }]}>
                {trendUp ? '\u2191' : trendDown ? '\u2193' : '\u2192'} {Math.abs(trend)}%
              </Text>
            </View>
          )}
          {subtitle && (
            <Text style={[Typography.bodySmall, { color: Colors.textMuted, marginLeft: trend !== undefined ? 6 : 0 }]}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  iconWrap: {
    marginLeft: 'auto',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  trendBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
});

export default MetricCard;
