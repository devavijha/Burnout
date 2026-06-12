import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/theme';
import { NeuralBackground } from '@/components/ui/NeuralBackground';
import { HeatmapGrid }      from '@/components/ui/HeatmapGrid';
import { GlassCard }        from '@/components/ui/GlassCard';
import { ScreenHeader }     from '@/components/ui/ScreenHeader';

const DAYS  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function seededVal(day: number, hour: number): number {
  let v = 0;
  if (hour >= 7  && hour <= 9)  v = 30 + ((day * 7 + hour) % 30);
  if (hour >= 9  && hour <= 17) v = 40 + ((day * 5 + hour) % 40);
  if (hour >= 20 && hour <= 23) v = 60 + ((day * 3 + hour) % 40);
  if (hour >= 23 || hour <= 2)  v = 70 + ((day + hour) % 30);
  if (day >= 5) v = Math.round(v * 0.6);
  return Math.min(100, Math.max(0, v));
}

const HEAT_DATA = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => ({ day, hour, value: seededVal(day, hour) })),
).flat();

const PEAK_HOURS = [
  { time: '10–11 PM', label: 'Doom-scrolling peak',        severity: 'high'     },
  { time: '2–4 PM',   label: 'Afternoon distraction zone', severity: 'moderate' },
  { time: '8–9 AM',   label: 'Morning notification spike', severity: 'moderate' },
];

export default function HeatmapScreen() {
  const insets      = useSafeAreaInsets();
  const [selDay, setSelDay] = useState<number | null>(null);

  return (
    <View style={styles.root}>
      <NeuralBackground intensity="low" />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Burnout Heatmap" subtitle="When digital fatigue peaks" showBack />

        {/* Legend */}
        <GlassCard variant="primary" style={{ marginBottom: 14 }} padding={12}>
          <Text style={[Typography.caption, { color: Colors.textMuted, marginBottom: 8 }]}>INTENSITY SCALE</Text>
          <View style={{ flexDirection: 'row', gap: 14 }}>
            {[
              { color: Colors.positive, label: 'Low'      },
              { color: Colors.warning,  label: 'Moderate' },
              { color: Colors.energy,   label: 'High'     },
              { color: Colors.danger,   label: 'Critical' },
            ].map((l) => (
              <View key={l.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: l.color }} />
                <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>{l.label}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Day filter */}
        <View style={styles.dayRow}>
          <TouchableOpacity
            onPress={() => setSelDay(null)}
            style={[styles.dayBtn, selDay === null && styles.daySelected]}
          >
            <Text style={[Typography.bodySmall, { color: selDay === null ? Colors.primary : Colors.textMuted }]}>All</Text>
          </TouchableOpacity>
          {DAYS.map((d, i) => (
            <TouchableOpacity
              key={d}
              onPress={() => setSelDay(i)}
              style={[styles.dayBtn, selDay === i && styles.daySelected]}
            >
              <Text style={[Typography.bodySmall, { color: selDay === i ? Colors.primary : Colors.textMuted }]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Hour labels */}
        <View style={styles.hourLabels}>
          {['12a','3a','6a','9a','12p','3p','6p','9p'].map((h) => (
            <Text key={h} style={[Typography.caption, { color: Colors.textMuted, flex: 1, textAlign: 'center', fontSize: 9 }]}>{h}</Text>
          ))}
        </View>

        {/* Grid */}
        <View style={styles.gridWrap}>
          <View style={styles.dayLabels}>
            {(selDay !== null ? [DAYS[selDay]] : DAYS).map((d, i) => (
              <View key={d} style={styles.dayLabelRow}>
                <Text style={[Typography.caption, { color: selDay === i || selDay === null ? Colors.textSecondary : Colors.textMuted, fontSize: 9 }]}>{d}</Text>
              </View>
            ))}
          </View>
          <HeatmapGrid
            data={selDay !== null ? HEAT_DATA.filter((d) => d.day === selDay) : HEAT_DATA}
            days={selDay !== null ? [DAYS[selDay]] : DAYS}
            animated
          />
        </View>

        {/* Peak windows */}
        <Text style={[Typography.caption, styles.sectionLabel]}>PEAK FATIGUE WINDOWS</Text>
        {PEAK_HOURS.map((p) => (
          <GlassCard
            key={p.time}
            variant={p.severity === 'high' ? 'danger' : 'secondary'}
            glowAccent
            accentColor={p.severity === 'high' ? Colors.danger : Colors.warning}
            style={{ marginBottom: 10 }}
            padding={14}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons
                name={p.severity === 'high' ? 'alert-circle-outline' : 'warning-outline'}
                size={22}
                color={p.severity === 'high' ? Colors.danger : Colors.warning}
              />
              <View>
                <Text style={[Typography.h4]}>{p.time}</Text>
                <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>{p.label}</Text>
              </View>
            </View>
          </GlassCard>
        ))}

        <GlassCard variant="primary" style={{ marginTop: 4 }} padding={16}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Ionicons name="bulb-outline" size={20} color={Colors.primary} />
            <Text style={[Typography.h4]}>AI Insight</Text>
          </View>
          <Text style={[Typography.body, { color: Colors.textMuted }]}>
            Your highest digital fatigue occurs between 10 PM and midnight. Set a hard digital cutoff at 9:30 PM to improve sleep quality and reduce morning burnout by an estimated 15%.
          </Text>
        </GlassCard>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:         { flex: 1, backgroundColor: Colors.background },
  scroll:       { paddingHorizontal: Spacing.lg },
  dayRow:       { flexDirection: 'row', gap: 6, marginBottom: 8, flexWrap: 'wrap' },
  dayBtn:       { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.borderSubtle },
  daySelected:  { borderColor: Colors.primary, backgroundColor: Colors.glowCyan },
  hourLabels:   { flexDirection: 'row', marginBottom: 4, paddingLeft: 38 },
  gridWrap:     { flexDirection: 'row', alignItems: 'flex-start' },
  dayLabels:    { marginRight: 6 },
  dayLabelRow:  { height: 14, justifyContent: 'center', marginBottom: 2 },
  sectionLabel: { color: Colors.textMuted, marginTop: 16, marginBottom: 10 },
});
