import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/theme';
import { NeuralBackground } from '@/components/ui/NeuralBackground';
import { GlassCard }        from '@/components/ui/GlassCard';
import { MetricCard }       from '@/components/ui/MetricCard';
import { ScreenHeader }     from '@/components/ui/ScreenHeader';

const { width: W } = Dimensions.get('window');

const APP_USAGE = [
  { app: 'Social Media',  icon: 'phone-portrait-outline', hours: 2.5, color: Colors.danger,    percent: 28 },
  { app: 'Work Tools',    icon: 'briefcase-outline',      hours: 2.1, color: Colors.primary,   percent: 24 },
  { app: 'Entertainment', icon: 'film-outline',           hours: 1.8, color: Colors.secondary, percent: 20 },
  { app: 'Messaging',     icon: 'chatbubble-outline',     hours: 1.2, color: Colors.positive,  percent: 14 },
  { app: 'News',          icon: 'newspaper-outline',      hours: 0.8, color: Colors.warning,   percent: 9  },
  { app: 'Other',         icon: 'cube-outline',           hours: 0.4, color: Colors.textMuted, percent: 5  },
];

function DonutChart() {
  const size = 180, cx = 90, cy = 90, r = 70, stroke = 28;
  const c = 2 * Math.PI * r;
  let cum = 0;
  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size}>
        {APP_USAGE.map((d, i) => {
          const start = cum;
          cum += d.percent;
          return (
            <Circle
              key={i} cx={cx} cy={cy} r={r}
              stroke={d.color} strokeWidth={stroke} fill="none"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - d.percent / 100)}
              rotation={(start / 100) * 360 - 90}
              origin={`${cx},${cy}`}
              strokeLinecap="butt"
            />
          );
        })}
      </Svg>
      <View style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[Typography.metricSm, { color: Colors.textPrimary }]}>8.8h</Text>
          <Text style={[Typography.caption, { color: Colors.textMuted }]}>today</Text>
        </View>
      </View>
    </View>
  );
}

export default function ScreenTimeScreen() {
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<'Today' | '7 Days' | '30 Days'>('Today');

  return (
    <View style={styles.root}>
      <NeuralBackground intensity="low" />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Screen Time" subtitle="Digital usage breakdown" showBack />

        <View style={styles.periodRow}>
          {(['Today', '7 Days', '30 Days'] as const).map((p) => (
            <TouchableOpacity key={p} onPress={() => setPeriod(p)}
              style={[styles.periodBtn, period === p && styles.periodActive]}>
              <Text style={[Typography.label, { color: period === p ? Colors.primary : Colors.textMuted }]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <GlassCard variant="primary" style={styles.donutCard}>
          <DonutChart />
          <View style={styles.legend}>
            {APP_USAGE.map((a) => (
              <View key={a.app} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: a.color }]} />
                <Text style={[Typography.bodySmall, { flex: 1, color: Colors.textSecondary }]}>{a.app}</Text>
                <Text style={[Typography.label, { color: a.color }]}>{a.hours}h</Text>
                <Text style={[Typography.caption, { color: Colors.textMuted, width: 28, textAlign: 'right' }]}>{a.percent}%</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        <View style={styles.metricRow}>
          <MetricCard label="Today Total"  value="8.8" unit="h" accentColor={Colors.primary}   style={styles.metricHalf} />
          <MetricCard label="Weekly Avg"   value="6.8" unit="h" trend={-12} accentColor={Colors.secondary} style={styles.metricHalf} />
        </View>

        <Text style={[Typography.caption, styles.sectionLabel]}>HOURLY PATTERN</Text>
        <GlassCard style={styles.hourlyCard}>
          <View style={styles.hourlyBars}>
            {Array.from({ length: 12 }, (_, i) => {
              const val = [0.1,0.05,0.03,0.02,0.15,0.45,0.7,0.85,0.6,0.5,0.4,0.75][i];
              const color = val > 0.7 ? Colors.danger : val > 0.5 ? Colors.warning : Colors.positive;
              const labels = ['12a','2a','4a','6a','8a','10a','12p','2p','4p','6p','8p','10p'];
              return (
                <View key={i} style={styles.hourBar}>
                  <View style={[styles.hourFill, { height: `${val * 100}%`, backgroundColor: color }]} />
                  <Text style={[Typography.caption, { fontSize: 8, color: Colors.textMuted, marginTop: 3 }]}>{labels[i]}</Text>
                </View>
              );
            })}
          </View>
        </GlassCard>

        <GlassCard variant="primary" padding={14}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Ionicons name="analytics-outline" size={20} color={Colors.primary} />
            <Text style={[Typography.h4]}>Key Insight</Text>
          </View>
          <Text style={[Typography.body, { color: Colors.textMuted }]}>
            Social media accounts for 28% of your screen time. Reducing this by just 1 hour daily could lower your burnout score by ~12 points.
          </Text>
        </GlassCard>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: Colors.background },
  scroll:  { paddingHorizontal: Spacing.lg },
  periodRow: { flexDirection: 'row', gap: 6, marginBottom: 14, marginTop: 4 },
  periodBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.borderSubtle, backgroundColor: Colors.surface },
  periodActive: { borderColor: Colors.primary, backgroundColor: Colors.glowCyan },
  donutCard:  { marginBottom: 12 },
  legend:     { marginTop: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 5 },
  legendDot:  { width: 10, height: 10, borderRadius: 5 },
  metricRow:  { flexDirection: 'row', gap: 10, marginBottom: 4 },
  metricHalf: { flex: 1 },
  sectionLabel: { color: Colors.textMuted, marginTop: 8, marginBottom: 10 },
  hourlyCard:   { marginBottom: 10 },
  hourlyBars:   { flexDirection: 'row', alignItems: 'flex-end', height: 80, gap: 2 },
  hourBar:      { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'flex-end' },
  hourFill:     { width: '80%', borderRadius: 2, minHeight: 3 },
});
