import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/theme';
import { NeuralBackground } from '@/components/ui/NeuralBackground';
import { GlassCard }        from '@/components/ui/GlassCard';
import { ScreenHeader }     from '@/components/ui/ScreenHeader';
import { useAppStore }      from '@/store/appStore';
import { format }           from 'date-fns';

const { width: W } = Dimensions.get('window');
const TODAY = format(new Date(), 'yyyy-MM-dd');

const WEEK_DAYS = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return format(d, 'yyyy-MM-dd');
});
const DAY_LABELS = WEEK_DAYS.map((d) => format(new Date(d), 'EEE'));

export default function HabitTrackerScreen() {
  const insets = useSafeAreaInsets();
  const { habits, toggleHabitCompletion } = useAppStore();

  const completedToday = habits.filter((h) => {
    const entry = h.entries.find((e) => e.date === TODAY);
    return entry?.completed;
  }).length;

  return (
    <View style={styles.root}>
      <NeuralBackground intensity="low" />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Habit Tracker" subtitle="Build your neural chain" showBack accentColor={Colors.positive} />

        {/* Summary */}
        <GlassCard variant="success" style={styles.summaryCard} padding={14}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={[Typography.caption, { color: Colors.textMuted }]}>TODAY'S PROGRESS</Text>
              <Text style={[Typography.h2, { color: Colors.positive }]}>
                {completedToday}/{habits.length}
              </Text>
              <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>habits complete</Text>
            </View>
            <View style={styles.progressCircle}>
              <Text style={[Typography.h3, { color: Colors.positive }]}>
                {Math.round((completedToday / habits.length) * 100)}%
              </Text>
            </View>
          </View>
          <View style={styles.completionBar}>
            <View style={[styles.completionFill, {
              width: `${(completedToday / habits.length) * 100}%`,
            }]} />
          </View>
        </GlassCard>

        {/* Week header */}
        <View style={styles.weekHeader}>
          <View style={{ width: 100 }} />
          {DAY_LABELS.map((d, i) => (
            <View key={i} style={styles.weekDay}>
              <Text style={[Typography.caption, {
                color: WEEK_DAYS[i] === TODAY ? Colors.primary : Colors.textMuted,
                fontSize: 9,
              }]}>
                {d}
              </Text>
            </View>
          ))}
        </View>

        {/* Habits grid */}
        {habits.map((habit) => (
          <GlassCard key={habit.id} style={styles.habitCard} padding={12}>
            <View style={styles.habitRow}>
              {/* Habit info */}
              <View style={styles.habitInfo}>
                <View style={[styles.habitIcon, { backgroundColor: `${habit.color}15` }]}>
                  <Ionicons name={(habit.icon || 'checkmark-circle-outline') as any} size={18} color={habit.color} />
                </View>
                <View>
                  <Text style={[Typography.label, { color: Colors.textPrimary }]}>{habit.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="flame-outline" size={12} color={habit.color} />
                    <Text style={[Typography.caption, { color: habit.color }]}>{habit.streak} day streak</Text>
                  </View>
                </View>
              </View>

              {/* Week checkboxes */}
              <View style={styles.checkboxRow}>
                {WEEK_DAYS.map((date, di) => {
                  const entry    = habit.entries.find((e) => e.date === date);
                  const isToday  = date === TODAY;
                  const isDone   = entry?.completed;
                  return (
                    <TouchableOpacity
                      key={di}
                      onPress={() => isToday && toggleHabitCompletion(habit.id, date)}
                      style={[
                        styles.checkbox,
                        isDone && { backgroundColor: habit.color, borderColor: habit.color },
                        isToday && !isDone && { borderColor: habit.color },
                        !isToday && !isDone && { opacity: 0.4 },
                      ]}
                      disabled={!isToday}
                    >
                      {isDone && <Ionicons name="checkmark" size={10} color={Colors.textInverse} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </GlassCard>
        ))}

        {/* XP info */}
        <GlassCard variant="primary" style={{ marginTop: 8 }} padding={12}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Ionicons name="bulb-outline" size={16} color={Colors.primary} />
            <Text style={[Typography.caption, { color: Colors.primary }]}>XP REWARDS</Text>
          </View>
          <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>
            Complete all daily habits to earn 150 XP. Maintaining a 7-day streak gives a bonus 500 XP and grows your Neural Ecosystem.
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
  summaryCard:  { marginBottom: 16, marginTop: 4 },
  summaryRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressCircle: {
    width: 64, height: 64, borderRadius: 32,
    borderWidth: 3, borderColor: Colors.positive,
    backgroundColor: Colors.glowGreen,
    alignItems: 'center', justifyContent: 'center',
  },
  completionBar: { height: 4, backgroundColor: Colors.backgroundAlt, borderRadius: 2, marginTop: 12, overflow: 'hidden' },
  completionFill: { height: '100%', backgroundColor: Colors.positive, borderRadius: 2 },
  weekHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  weekDay:    { flex: 1, alignItems: 'center' },
  habitCard:  { marginBottom: 8 },
  habitRow:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  habitInfo:  { flexDirection: 'row', alignItems: 'center', gap: 8, width: 130 },
  habitIcon:  { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  checkboxRow: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 1.5, borderColor: Colors.borderSubtle,
    alignItems: 'center', justifyContent: 'center',
  },
});
