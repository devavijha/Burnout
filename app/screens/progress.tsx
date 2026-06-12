import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/theme';
import { NeuralBackground } from '@/components/ui/NeuralBackground';
import { GlassCard }        from '@/components/ui/GlassCard';
import { MetricCard }       from '@/components/ui/MetricCard';
import { ScreenHeader }     from '@/components/ui/ScreenHeader';
import { EnergyRing }       from '@/components/ui/EnergyRing';
import { useBurnoutStore }  from '@/store/burnoutStore';
import { useFocusStore }    from '@/store/focusStore';
import { useAppStore }      from '@/store/appStore';

const { width: W } = Dimensions.get('window');

const WEEKLY_SCORES = [58, 65, 72, 48, 55, 38, 42];
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function MiniBarChart({ data, colors }: { data: number[]; colors: string[] }) {
  const max = Math.max(...data);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 60, gap: 4 }}>
      {data.map((val, i) => (
        <View key={i} style={{ flex: 1, alignItems: 'center', gap: 2 }}>
          <View
            style={{
              width: '100%',
              height: (val / max) * 52,
              backgroundColor: colors[i] ?? Colors.primary,
              borderRadius: 3,
              opacity: 0.85,
              minHeight: 4,
            }}
          />
          <Text style={[Typography.caption, { color: Colors.textMuted, fontSize: 8 }]}>{DAYS[i]}</Text>
        </View>
      ))}
    </View>
  );
}

export default function ProgressScreen() {
  const insets      = useSafeAreaInsets();
  const router      = useRouter();
  const { currentScore, history } = useBurnoutStore();
  const { totalFocusToday, streakDays } = useFocusStore();
  const { sleepQuality, habits } = useAppStore();

  const weekAvg = Math.round(WEEKLY_SCORES.reduce((a, b) => a + b) / 7);
  const barColors = WEEKLY_SCORES.map((s) =>
    s > 70 ? Colors.danger : s > 45 ? Colors.warning : Colors.positive,
  );

  const habitCompletionRate = Math.round(
    (habits.filter((h) => h.streak > 0).length / habits.length) * 100,
  );

  return (
    <View style={styles.root}>
      <NeuralBackground intensity="low" />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Progress Dashboard" subtitle="Your recovery journey" showBack />

        {/* Overall score ring */}
        <View style={styles.ringRow}>
          <EnergyRing value={currentScore} size={160} strokeWidth={12} label="BURNOUT" animate />
          <EnergyRing value={100 - currentScore} size={160} strokeWidth={12} label="WELLNESS" animate color={Colors.positive} />
        </View>

        {/* Weekly chart */}
        <GlassCard variant="primary" style={styles.chartCard}>
          <Text style={[Typography.caption, { color: Colors.textMuted, marginBottom: 12 }]}>
            7-DAY BURNOUT TREND
          </Text>
          <MiniBarChart data={WEEKLY_SCORES} colors={barColors} />
          <View style={styles.chartStats}>
            <View style={styles.statItem}>
              <Text style={[Typography.label, { color: Colors.textMuted }]}>Week Avg</Text>
              <Text style={[Typography.metricSm, { color: Colors.primary }]}>{weekAvg}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[Typography.label, { color: Colors.textMuted }]}>Best Day</Text>
              <Text style={[Typography.metricSm, { color: Colors.positive }]}>38</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[Typography.label, { color: Colors.textMuted }]}>Trend</Text>
              <Text style={[Typography.metricSm, { color: Colors.positive }]}>-16pts</Text>
            </View>
          </View>
        </GlassCard>

        {/* Key metrics */}
        <Text style={[Typography.caption, styles.sectionLabel]}>KEY METRICS THIS WEEK</Text>
        <View style={styles.metricsGrid}>
          <MetricCard label="Focus Time"    value="12.5" unit="h" trend={18}  accentColor={Colors.primary}   style={styles.halfCard} />
          <MetricCard label="Sleep Quality" value={sleepQuality}  unit="%" trend={5}   accentColor={Colors.secondary} style={styles.halfCard} />
          <MetricCard label="Streak"        value={streakDays}    unit="d" trend={40}  accentColor={Colors.positive}  style={styles.halfCard} />
          <MetricCard label="Habits Done"   value={`${habitCompletionRate}`} unit="%" accentColor={Colors.warning}   style={styles.halfCard} />
        </View>

        {/* Recovery milestones */}
        <Text style={[Typography.caption, styles.sectionLabel]}>RECOVERY MILESTONES</Text>
        {[
          { title: 'Burnout Score < 50',      current: currentScore, target: 50,  icon: 'locate-outline',          color: Colors.primary   },
          { title: '10-Day Streak',           current: streakDays,   target: 10,  icon: 'flame-outline',           color: Colors.warning   },
          { title: '100 Focus Minutes/week',  current: 85,           target: 100, icon: 'flash-outline',           color: Colors.positive  },
          { title: 'Sleep Quality > 80%',     current: sleepQuality, target: 80,  icon: 'moon-outline',            color: Colors.secondary },
        ].map((m) => {
          const pct = Math.min(100, Math.round((m.current / m.target) * 100));
          return (
            <GlassCard key={m.title} style={styles.milestoneCard} padding={14} glowAccent accentColor={m.color}>
              <View style={styles.milestoneRow}>
                <Ionicons name={m.icon as any} size={20} color={m.color} />
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.label, { color: Colors.textPrimary }]}>{m.title}</Text>
                  <View style={styles.milestoneBar}>
                    <View style={[styles.milestoneFill, { width: `${pct}%`, backgroundColor: m.color }]} />
                  </View>
                </View>
                <Text style={[Typography.label, { color: m.color }]}>{pct}%</Text>
              </View>
            </GlassCard>
          );
        })}

        {/* Navigation */}
        <View style={styles.navRow}>
          {[
            { title: 'Sleep Analysis', icon: 'moon-outline',             route: '/screens/sleep-analysis' },
            { title: 'Screen Time',    icon: 'phone-portrait-outline',   route: '/screens/screen-time' },
          ].map((item) => (
            <TouchableOpacity key={item.route} onPress={() => router.push(item.route as any)} style={styles.navCard}>
              <GlassCard variant="secondary" style={{ flex: 1 }} padding={14}>
                <Ionicons name={item.icon as any} size={28} color={Colors.secondary} style={{ marginBottom: 6 }} />
                <Text style={[Typography.label, { color: Colors.textPrimary }]}>{item.title}</Text>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: Colors.background },
  scroll:  { paddingHorizontal: Spacing.lg },
  ringRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20 },
  chartCard:  { marginBottom: 8 },
  chartStats: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: Colors.borderSubtle },
  statItem:   { alignItems: 'center', gap: 4 },
  sectionLabel: { color: Colors.textMuted, marginTop: 16, marginBottom: 10 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  halfCard:    { width: (W - Spacing.lg * 2 - 10) / 2 },
  milestoneCard: { marginBottom: 10 },
  milestoneRow:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  milestoneBar:  { height: 4, backgroundColor: Colors.backgroundAlt, borderRadius: 2, marginTop: 6, overflow: 'hidden' },
  milestoneFill: { height: '100%', borderRadius: 2, minWidth: 4 },
  navRow:   { flexDirection: 'row', gap: 10, marginTop: 16 },
  navCard:  { flex: 1, height: 100 },
});
