import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/theme';
import { NeuralBackground } from '@/components/ui/NeuralBackground';
import { EnergyRing }       from '@/components/ui/EnergyRing';
import { GlassCard }        from '@/components/ui/GlassCard';
import { ScreenHeader }     from '@/components/ui/ScreenHeader';
import { useBurnoutScore }  from '@/hooks/useBurnoutScore';
import { useBurnoutStore }  from '@/store/burnoutStore';

const { width: W } = Dimensions.get('window');

const DIMENSION_ICONS: Record<string, string> = {
  screenTime:    'phone-portrait-outline',
  appSwitching:  'sync-outline',
  lateNightUse:  'moon-outline',
  focusCapacity: 'locate-outline',
  compulsion:    'warning-outline',
  mentalFatigue: 'sparkles-outline',
};

export default function EnergyRingScreen() {
  const insets = useSafeAreaInsets();
  const { score, level, color, delta, trend, dimensions } = useBurnoutScore();
  const { screenTimeToday, appSwitchesToday, lateNightMinsToday, notificationsToday } = useBurnoutStore();
  const [selectedDim, setSelectedDim] = useState<number | null>(null);

  const mentalEnergy = Math.max(0, 100 - score);

  return (
    <View style={styles.root}>
      <NeuralBackground intensity="high" />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Energy Ring" subtitle="Neural energy deep dive" showBack />

        {/* Main ring */}
        <View style={styles.ringSection}>
          <EnergyRing value={score} size={240} strokeWidth={16} label="BURNOUT INDEX" sublabel={level} animate />
          <View style={styles.ringMeta}>
            <View style={[styles.metaPill, { borderColor: color }]}>
              <Text style={[Typography.bodySmall, { color }]}>
                {trend === 'improving' ? '↓' : trend === 'worsening' ? '↑' : '→'}
                {' '}{Math.abs(delta)} pts vs yesterday
              </Text>
            </View>
          </View>
        </View>

        {/* Dual mini rings */}
        <View style={styles.dualRow}>
          <View style={styles.dualItem}>
            <EnergyRing value={mentalEnergy} size={130} strokeWidth={10} label="ENERGY" animate color={Colors.positive} />
          </View>
          <View style={styles.dualItem}>
            <EnergyRing value={Math.min(100, notificationsToday / 2)} size={130} strokeWidth={10} label="NOTIF LOAD" animate color={Colors.warning} />
          </View>
        </View>

        {/* Raw signals */}
        <Text style={[Typography.caption, styles.sectionLabel]}>LIVE SIGNALS</Text>
        <View style={styles.signalsGrid}>
          {[
            { label: 'Screen Time', value: `${screenTimeToday}h`,      icon: 'phone-portrait-outline', color: Colors.primary   },
            { label: 'App Switches', value: appSwitchesToday,           icon: 'sync-outline',           color: Colors.warning   },
            { label: 'Late Night',  value: `${lateNightMinsToday}m`,   icon: 'moon-outline',           color: Colors.secondary },
            { label: 'Notifications', value: notificationsToday,        icon: 'notifications-outline',  color: Colors.danger    },
          ].map((s) => (
            <GlassCard key={s.label} style={styles.signalCard} padding={12}>
              <Ionicons name={s.icon as any} size={22} color={s.color} />
              <Text style={[Typography.metricSm, { color: s.color, marginTop: 6 }]}>{s.value}</Text>
              <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 2 }]}>
                {s.label.toUpperCase()}
              </Text>
            </GlassCard>
          ))}
        </View>

        {/* Dimension rings */}
        <Text style={[Typography.caption, styles.sectionLabel]}>NEURAL DIMENSIONS</Text>
        <View style={styles.dimsGrid}>
          {dimensions.map((d, i) => {
            const dimColor = d.value > 70 ? Colors.danger : d.value > 45 ? Colors.warning : Colors.positive;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => setSelectedDim(selectedDim === i ? null : i)}
              >
                <GlassCard
                  style={styles.dimCard}
                  variant={selectedDim === i ? 'primary' : 'default'}
                  glowAccent
                  accentColor={dimColor}
                  padding={14}
                >
                  <Ionicons name={(DIMENSION_ICONS[d.label] ?? 'analytics-outline') as any} size={20} color={dimColor} />
                  <Text style={[Typography.metricSm, { color: dimColor, marginTop: 4 }]}>{d.value}</Text>
                  <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 2, textAlign: 'center' }]}>
                    {d.label.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
                  </Text>
                  <View style={styles.dimMiniBar}>
                    <View style={[styles.dimMiniFill, { width: `${d.value}%`, backgroundColor: dimColor }]} />
                  </View>
                </GlassCard>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Interpretation */}
        <GlassCard
          variant={score > 70 ? 'danger' : score > 40 ? 'secondary' : 'success'}
          style={styles.interpretation}
          padding={16}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Ionicons name="sparkles-outline" size={20} color={Colors.secondary} />
            <Text style={[Typography.h4]}>Neural Interpretation</Text>
          </View>
          <Text style={[Typography.body, { color: Colors.textMuted }]}>
            {score <= 30
              ? 'Optimal neural state. Your brain is operating at peak capacity. Maintain these habits.'
              : score <= 60
              ? 'Moderate fatigue detected. A 5-minute recovery break and reduced app switching will help.'
              : score <= 80
              ? 'High burnout risk. Prefrontal cortex under stress. Activate Dopamine Detox Mode.'
              : 'Critical overload. Step away from all screens for at least 30 minutes immediately.'}
          </Text>
        </GlassCard>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg },
  ringSection: { alignItems: 'center', paddingVertical: 20, position: 'relative' },
  ringMeta:    { marginTop: 12 },
  metaPill: {
    borderWidth: 1, borderRadius: Radius.full,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  dualRow:      { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 8 },
  dualItem:     { alignItems: 'center' },
  sectionLabel: { color: Colors.textMuted, marginTop: 8, marginBottom: 10 },
  signalsGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  signalCard: {
    width: (W - Spacing.lg * 2 - 10) / 2,
    alignItems: 'center', padding: 12,
  },
  dimsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  dimCard:  { width: (W - Spacing.lg * 2 - 10) / 2, alignItems: 'center' },
  dimMiniBar: {
    height: 3, width: '100%', backgroundColor: Colors.backgroundAlt,
    borderRadius: 2, marginTop: 8, overflow: 'hidden',
  },
  dimMiniFill:    { height: '100%', borderRadius: 2 },
  interpretation: { marginBottom: 8 },
});
