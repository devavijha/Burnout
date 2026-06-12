import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Text as SvgText, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/theme';
import { NeuralBackground } from '@/components/ui/NeuralBackground';
import { GlassCard }        from '@/components/ui/GlassCard';
import { MetricCard }       from '@/components/ui/MetricCard';
import { ScreenHeader }     from '@/components/ui/ScreenHeader';
import { useAppStore }      from '@/store/appStore';

const { width: W } = Dimensions.get('window');

const SLEEP_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function SleepBarChart({ data }: { data: { hours: number; quality: number }[] }) {
  const chartW  = W - Spacing.lg * 2 - 32;
  const chartH  = 100;
  const barW    = (chartW - 20) / data.length - 8;
  const maxH    = 9;

  return (
    <Svg width={chartW} height={chartH + 24}>
      {data.map((d, i) => {
        const barHeight = (d.hours / maxH) * chartH;
        const x    = i * ((chartW - 20) / data.length) + 10;
        const y    = chartH - barHeight;
        const color = d.quality > 80 ? Colors.positive : d.quality > 60 ? Colors.warning : Colors.danger;
        return (
          <React.Fragment key={i}>
            <Rect x={x} y={0} width={barW} height={chartH} rx={4} fill={Colors.backgroundAlt} />
            <Rect x={x} y={y} width={barW} height={barHeight} rx={4} fill={color} opacity={0.85} />
            <SvgText x={x + barW / 2} y={chartH + 16} textAnchor="middle" fontSize={9} fill={Colors.textMuted}>
              {SLEEP_LABELS[i]}
            </SvgText>
          </React.Fragment>
        );
      })}
      {/* 8h recommended line */}
      <SvgText x={chartW - 4} y={(1 - 8/maxH) * chartH - 4} textAnchor="end" fontSize={9} fill={Colors.primary}>8h</SvgText>
    </Svg>
  );
}

export default function SleepAnalysisScreen() {
  const insets = useSafeAreaInsets();
  const { sleepHours, sleepQuality, bedtime, wakeTime, sleepHistory } = useAppStore();

  const chartData = sleepHistory.map((h) => ({ hours: h.hours, quality: h.quality }));
  const avgHours  = +(sleepHistory.reduce((s, e) => s + e.hours, 0) / sleepHistory.length).toFixed(1);
  const avgQuality = Math.round(sleepHistory.reduce((s, e) => s + e.quality, 0) / sleepHistory.length);
  const deficit    = Math.max(0, +(8 - avgHours).toFixed(1));

  return (
    <View style={styles.root}>
      <NeuralBackground intensity="low" />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Sleep Impact" subtitle="How sleep affects your burnout" showBack accentColor={Colors.secondary} />

        {/* Key metrics */}
        <View style={styles.metricsRow}>
          <MetricCard label="Last Night"   value={sleepHours}        unit="h"   trend={-5}  accentColor={Colors.secondary} style={styles.metricCard} />
          <MetricCard label="Sleep Quality" value={sleepQuality}     unit="%"   trend={3}   accentColor={Colors.positive}  style={styles.metricCard} />
          <MetricCard label="Avg Deficit"  value={deficit}           unit="h"              accentColor={Colors.danger}    style={styles.metricCard} />
          <MetricCard label="Consistency"  value="74"                unit="%"   trend={8}   accentColor={Colors.warning}   style={styles.metricCard} />
        </View>

        {/* Sleep chart */}
        <GlassCard variant="secondary" style={styles.chartCard}>
          <Text style={[Typography.caption, { color: Colors.textMuted, marginBottom: 12 }]}>
            SLEEP HOURS — LAST 7 NIGHTS
          </Text>
          <SleepBarChart data={chartData} />
          <View style={styles.chartLegend}>
            {[
              { color: Colors.positive, label: 'Good (>80%)' },
              { color: Colors.warning,  label: 'Fair (60-80%)' },
              { color: Colors.danger,   label: 'Poor (<60%)' },
            ].map((l) => (
              <View key={l.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: l.color }} />
                <Text style={[Typography.caption, { color: Colors.textMuted }]}>{l.label}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Sleep schedule */}
        <Text style={[Typography.caption, styles.sectionLabel]}>SLEEP SCHEDULE</Text>
        <GlassCard style={styles.scheduleCard}>
          <View style={styles.scheduleRow}>
            <View style={styles.scheduleItem}>
              <Ionicons name="moon-outline" size={28} color={Colors.secondary} />
              <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 4 }]}>BEDTIME</Text>
              <Text style={[Typography.h3, { color: Colors.secondary }]}>{bedtime}</Text>
            </View>
            <View style={styles.scheduleDivider} />
            <View style={styles.scheduleItem}>
              <Ionicons name="sunny-outline" size={28} color={Colors.positive} />
              <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 4 }]}>WAKE TIME</Text>
              <Text style={[Typography.h3, { color: Colors.positive }]}>{wakeTime}</Text>
            </View>
            <View style={styles.scheduleDivider} />
            <View style={styles.scheduleItem}>
              <Ionicons name="time-outline" size={28} color={Colors.primary} />
              <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 4 }]}>DURATION</Text>
              <Text style={[Typography.h3, { color: Colors.primary }]}>{sleepHours}h</Text>
            </View>
          </View>
        </GlassCard>

        {/* Sleep-Burnout Correlation */}
        <Text style={[Typography.caption, styles.sectionLabel]}>SLEEP x BURNOUT CORRELATION</Text>
        <GlassCard variant="primary" padding={14}>
          <Text style={[Typography.h4, { marginBottom: 12 }]}>Impact Analysis</Text>
          {[
            { label: 'Nights with <6h sleep', burnoutImpact: '+18 pts', color: Colors.danger },
            { label: 'Nights with 7-8h sleep', burnoutImpact: '-12 pts', color: Colors.positive },
            { label: 'Poor quality nights (<60%)', burnoutImpact: '+15 pts', color: Colors.warning },
            { label: 'Consistent sleep schedule', burnoutImpact: '-8 pts/day', color: Colors.positive },
          ].map((c) => (
            <View key={c.label} style={styles.correlationRow}>
              <Text style={[Typography.bodySmall, { color: Colors.textSecondary, flex: 1 }]}>{c.label}</Text>
              <Text style={[Typography.label, { color: c.color }]}>{c.burnoutImpact}</Text>
            </View>
          ))}
        </GlassCard>

        {/* Tips */}
        <GlassCard variant="secondary" style={styles.tipsCard} padding={14}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Ionicons name="bulb-outline" size={20} color={Colors.secondary} />
            <Text style={[Typography.h4]}>Sleep Optimization Tips</Text>
          </View>
          {[
            'Set a digital cutoff 90 minutes before bed',
            'Keep room temperature at 65-68F (18-20C)',
            'Use the box breathing exercise before sleep',
            'Avoid caffeine after 2 PM',
            'Consistent wake time stabilizes circadian rhythm',
          ].map((tip, i) => (
            <Text key={i} style={[Typography.bodySmall, { color: Colors.textMuted, marginBottom: 4 }]}>
              {i + 1}. {tip}
            </Text>
          ))}
        </GlassCard>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: Colors.background },
  scroll:  { paddingHorizontal: Spacing.lg },
  metricsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16, marginTop: 4 },
  metricCard: { width: (W - Spacing.lg * 2 - 10) / 2 },
  chartCard:  { marginBottom: 8 },
  chartLegend: { flexDirection: 'row', gap: 14, flexWrap: 'wrap', marginTop: 12 },
  sectionLabel: { color: Colors.textMuted, marginTop: 8, marginBottom: 10 },
  scheduleCard: { marginBottom: 8 },
  scheduleRow:  { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  scheduleItem: { alignItems: 'center', flex: 1 },
  scheduleDivider: { width: 1, height: 60, backgroundColor: Colors.borderSubtle },
  correlationRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle },
  tipsCard: { marginTop: 8 },
});
