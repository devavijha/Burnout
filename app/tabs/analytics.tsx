import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { GlassCard }        from '@/components/ui/GlassCard';
import { MetricCard }       from '@/components/ui/MetricCard';
import { BurnoutScoreBadge } from '@/components/ui/BurnoutScoreBadge';
import { useBurnoutStore }  from '@/store/burnoutStore';

const { width: W } = Dimensions.get('window');

function WeekBarChart({ data }: { data: { day: string; score: number }[] }) {
  const chartW   = W - Spacing.lg * 2 - 32;
  const chartH   = 120;
  const barWidth = (chartW - 20) / data.length - 8;
  const maxVal   = 100;

  return (
    <Svg width={chartW} height={chartH + 24}>
      {data.map((d, i) => {
        const barH = (d.score / maxVal) * chartH;
        const x    = i * ((chartW - 20) / data.length) + 10;
        const y    = chartH - barH;
        const barColor = d.score > 70 ? Colors.danger : d.score > 45 ? Colors.warning : Colors.positive;
        return (
          <React.Fragment key={i}>
            <Rect x={x} y={0} width={barWidth} height={chartH} rx={6} fill={Colors.backgroundAlt} />
            <Rect x={x} y={y} width={barWidth} height={barH} rx={6} fill={barColor} opacity={0.75} />
            <SvgText
              x={x + barWidth / 2}
              y={chartH + 16}
              textAnchor="middle"
              fontSize={11}
              fontWeight="500"
              fill={Colors.textMuted}
            >
              {d.day}
            </SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

const TABS = ['Weekly', 'Monthly', 'All Time'] as const;
type TabType = typeof TABS[number];

const WEEKLY_DATA = [
  { day: 'Mon', score: 55 },
  { day: 'Tue', score: 68 },
  { day: 'Wed', score: 72 },
  { day: 'Thu', score: 48 },
  { day: 'Fri', score: 62 },
  { day: 'Sat', score: 35 },
  { day: 'Sun', score: 42 },
];

export default function AnalyticsScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { currentScore, dimensions } = useBurnoutStore();
  const [activeTab, setActiveTab] = useState<TabType>('Weekly');

  const weekAvg   = Math.round(WEEKLY_DATA.reduce((s, d) => s + d.score, 0) / 7);
  const bestDay   = WEEKLY_DATA.reduce((a, b) => a.score < b.score ? a : b);
  const worstDay  = WEEKLY_DATA.reduce((a, b) => a.score > b.score ? a : b);

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 12 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[Typography.h1]}>Insights</Text>
            <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>
              Patterns from your digital behavior
            </Text>
          </View>
          <BurnoutScoreBadge score={currentScore} size="sm" />
        </View>

        {/* Tab selector */}
        <View style={styles.tabRow}>
          {TABS.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setActiveTab(t)}
              style={[styles.tab, activeTab === t && styles.tabActive]}
            >
              <Text style={[Typography.label, {
                color: activeTab === t ? Colors.primary : Colors.textMuted,
                fontWeight: activeTab === t ? '600' : '500',
              }]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Burnout chart */}
        <GlassCard style={styles.chartCard}>
          <Text style={[Typography.caption, { color: Colors.textMuted, marginBottom: 16 }]}>
            WELLBEING SCORE — {activeTab.toUpperCase()}
          </Text>
          <WeekBarChart data={WEEKLY_DATA} />

          <View style={styles.chartSummary}>
            <View style={styles.summaryItem}>
              <Text style={[Typography.metricSm, { color: Colors.primary }]}>{weekAvg}</Text>
              <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>Avg Score</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[Typography.metricSm, { color: Colors.positive }]}>{bestDay.day}</Text>
              <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>Best Day</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[Typography.metricSm, { color: Colors.danger }]}>{worstDay.day}</Text>
              <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>Worst Day</Text>
            </View>
          </View>
        </GlassCard>

        {/* Quick stat cards */}
        <Text style={[Typography.caption, styles.sectionLabel]}>PERFORMANCE METRICS</Text>
        <View style={styles.gridRow}>
          <MetricCard label="Focus Hours" value="12.5" unit="hrs" trend={18} subtitle="this week"
            accentColor={Colors.primary} style={styles.halfCard} />
          <MetricCard label="Recovery" value="14" trend={40} subtitle="sessions"
            accentColor={Colors.positive} style={styles.halfCard} />
          <MetricCard label="Screen Time" value="5.2" unit="hrs/day" trend={-12} subtitle="avg"
            accentColor={Colors.warning} style={styles.halfCard} />
          <MetricCard label="Break Score" value="78" unit="%" trend={8} subtitle="vs last week"
            accentColor={Colors.secondary} style={styles.halfCard} />
        </View>

        {/* Dimension breakdown */}
        <Text style={[Typography.caption, styles.sectionLabel]}>DIMENSION BREAKDOWN</Text>
        <GlassCard style={styles.dimsCard}>
          {dimensions.map((d, i) => (
            <View key={i} style={[styles.dimRow, i < dimensions.length - 1 && { borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle }]}>
              <View style={{ width: 120 }}>
                <Text style={[Typography.label, { color: Colors.textPrimary }]}>{d.label}</Text>
                <Text style={[Typography.bodySmall, { color: Colors.textMuted, fontSize: 11 }]}>
                  Weight: {Math.round(d.weight * 100)}%
                </Text>
              </View>
              <View style={styles.dimBarWrap}>
                <View
                  style={[
                    styles.dimFill,
                    {
                      width: `${d.value}%`,
                      backgroundColor: d.value > 70 ? Colors.danger : d.value > 45 ? Colors.warning : Colors.positive,
                    },
                  ]}
                />
              </View>
              <Text style={[Typography.label, { color: Colors.textMuted, width: 28, textAlign: 'right' }]}>
                {d.value}
              </Text>
            </View>
          ))}
        </GlassCard>

        {/* Navigation shortcuts */}
        <Text style={[Typography.caption, styles.sectionLabel]}>DEEP DIVES</Text>
        <View style={styles.deepDives}>
          {[
            { title: 'Screen Time',     iconName: 'phone-portrait-outline' as const, route: '/screens/screen-time', color: Colors.primary },
            { title: 'Burnout Heatmap', iconName: 'grid-outline' as const,           route: '/screens/heatmap',      color: Colors.danger },
            { title: 'Sleep Impact',    iconName: 'moon-outline' as const,            route: '/screens/sleep-analysis', color: Colors.secondary },
            { title: 'Progress',        iconName: 'trending-up-outline' as const,     route: '/screens/progress',       color: Colors.positive },
          ].map((item) => (
            <TouchableOpacity
              key={item.route}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.8}
            >
              <GlassCard style={styles.diveCard} padding={16}>
                <View style={styles.diveRow}>
                  <View style={[styles.diveIcon, { backgroundColor: `${item.color}10` }]}>
                    <Ionicons name={item.iconName} size={18} color={item.color} />
                  </View>
                  <Text style={[Typography.h4, { flex: 1 }]}>{item.title}</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                </View>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: Colors.background },
  scroll:  { paddingHorizontal: Spacing.lg },
  header: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'flex-start',
    paddingVertical: 16,
    marginBottom:   8,
  },
  tabRow: {
    flexDirection:   'row',
    backgroundColor: Colors.backgroundAlt,
    borderRadius:    Radius.lg,
    padding:         4,
    marginBottom:    16,
  },
  tab: {
    flex:           1,
    paddingVertical: 10,
    alignItems:     'center',
    borderRadius:   Radius.md,
  },
  tabActive: { backgroundColor: Colors.surface, ...Shadow.sm },
  chartCard: { marginBottom: 8 },
  chartSummary: {
    flexDirection:  'row',
    justifyContent: 'space-around',
    marginTop:      20,
    paddingTop:     16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  summaryItem:    { alignItems: 'center', gap: 4 },
  summaryDivider: { width: 1, backgroundColor: Colors.borderSubtle },
  sectionLabel:   { color: Colors.textMuted, marginTop: 20, marginBottom: 12 },
  gridRow: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           12,
    marginBottom:  8,
  },
  halfCard: { width: (W - Spacing.lg * 2 - 12) / 2 },
  dimsCard: { marginBottom: 8 },
  dimRow:   { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  dimBarWrap: { flex: 1, height: 6, backgroundColor: Colors.backgroundAlt, borderRadius: 3, marginHorizontal: 12, overflow: 'hidden' },
  dimFill:    { height: '100%', borderRadius: 3, minWidth: 4 },
  deepDives:  { gap: 10 },
  diveCard:   { marginBottom: 0 },
  diveRow:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  diveIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
