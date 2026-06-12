import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/theme';
import { NeuralBackground } from '@/components/ui/NeuralBackground';
import { GlassCard }        from '@/components/ui/GlassCard';
import { ScreenHeader }     from '@/components/ui/ScreenHeader';
import { useAppStore }      from '@/store/appStore';

const CATEGORY_COLORS: Record<string, string> = {
  focus:     Colors.primary,
  recovery:  Colors.positive,
  streak:    Colors.warning,
  social:    Colors.secondary,
  milestone: Colors.danger,
};

const CATEGORY_ICONS: Record<string, string> = {
  focus:     'locate-outline',
  recovery:  'leaf-outline',
  streak:    'flame-outline',
  social:    'people-outline',
  milestone: 'star-outline',
};

export default function AchievementsScreen() {
  const insets = useSafeAreaInsets();
  const { achievements, totalXP, level } = useAppStore();

  const unlocked = achievements.filter((a) => a.isUnlocked);
  const locked   = achievements.filter((a) => !a.isUnlocked);

  return (
    <View style={styles.root}>
      <NeuralBackground intensity="medium" />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Achievements" subtitle="Your neural milestones" showBack accentColor={Colors.warning} />

        {/* XP summary */}
        <GlassCard variant="primary" style={styles.xpCard}>
          <View style={styles.xpRow}>
            <View>
              <Text style={[Typography.caption, { color: Colors.textMuted }]}>NEURAL LEVEL</Text>
              <Text style={[Typography.h1, { color: Colors.warning }]}>Level {level}</Text>
            </View>
            <View>
              <Text style={[Typography.metricSm, { color: Colors.primary }]}>{totalXP}</Text>
              <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>Total XP</Text>
            </View>
          </View>
          <View style={styles.xpBar}>
            <LinearGradient
              colors={[Colors.warning, Colors.primary]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={[StyleSheet.absoluteFill, { width: `${(totalXP % 500) / 5}%`, borderRadius: 2 }]}
            />
          </View>
          <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 4 }]}>
            {unlocked.length}/{achievements.length} unlocked · {500 - (totalXP % 500)} XP to Level {level + 1}
          </Text>
        </GlassCard>

        {/* Unlocked */}
        <Text style={[Typography.caption, styles.sectionLabel]}>UNLOCKED</Text>
        {unlocked.map((a) => (
          <GlassCard
            key={a.id}
            variant="success"
            glowAccent
            accentColor={CATEGORY_COLORS[a.category]}
            style={styles.achievementCard}
            padding={14}
          >
            <View style={styles.achievementRow}>
              <View style={[styles.achievementIcon, { backgroundColor: `${CATEGORY_COLORS[a.category]}15` }]}>
                <Ionicons name={(CATEGORY_ICONS[a.category] ?? 'trophy-outline') as any} size={26} color={CATEGORY_COLORS[a.category]} />
              </View>
              <View style={styles.achievementText}>
                <Text style={[Typography.h4]}>{a.title}</Text>
                <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>{a.description}</Text>
                <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 4 }]}>
                  Unlocked {a.unlockedAt ? new Date(a.unlockedAt).toLocaleDateString() : ''}
                </Text>
              </View>
              <View style={styles.xpBadge}>
                <Text style={[Typography.caption, { color: Colors.positive }]}>+{a.xpReward}</Text>
                <Text style={[Typography.caption, { color: Colors.textMuted }]}>XP</Text>
              </View>
            </View>
          </GlassCard>
        ))}

        {/* Locked */}
        <Text style={[Typography.caption, styles.sectionLabel]}>IN PROGRESS</Text>
        {locked.map((a) => (
          <GlassCard
            key={a.id}
            variant="default"
            glowAccent
            accentColor={Colors.textMuted}
            style={[styles.achievementCard, styles.lockedCard]}
            padding={14}
          >
            <View style={styles.achievementRow}>
              <View style={[styles.achievementIcon, styles.lockedIcon]}>
                <Ionicons name={(CATEGORY_ICONS[a.category] ?? 'trophy-outline') as any} size={26} color={Colors.textMuted} style={{ opacity: 0.4 }} />
              </View>
              <View style={styles.achievementText}>
                <Text style={[Typography.h4, { color: Colors.textMuted }]}>{a.title}</Text>
                <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>{a.description}</Text>
                {a.progress !== undefined && (
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, {
                      width: `${a.progress}%`,
                      backgroundColor: CATEGORY_COLORS[a.category],
                    }]} />
                  </View>
                )}
              </View>
              <View style={styles.xpBadge}>
                <Text style={[Typography.caption, { color: Colors.textMuted }]}>+{a.xpReward}</Text>
                <Text style={[Typography.caption, { color: Colors.textMuted }]}>XP</Text>
              </View>
            </View>
          </GlassCard>
        ))}

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg },
  xpCard: { marginBottom: 8, marginTop: 4 },
  xpRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  xpBar:  { height: 4, backgroundColor: Colors.backgroundAlt, borderRadius: 2, overflow: 'hidden', position: 'relative' },
  sectionLabel: { color: Colors.textMuted, marginTop: 16, marginBottom: 10 },
  achievementCard: { marginBottom: 10 },
  achievementRow:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  achievementIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  achievementText: { flex: 1 },
  lockedCard:  { opacity: 0.7 },
  lockedIcon:  { backgroundColor: Colors.backgroundAlt },
  xpBadge:     { alignItems: 'center' },
  progressBarBg:   { height: 3, backgroundColor: Colors.backgroundAlt, borderRadius: 2, marginTop: 8, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 2, minWidth: 4 },
});
