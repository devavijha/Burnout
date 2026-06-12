import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/theme';
import { NeuralBackground } from '@/components/ui/NeuralBackground';
import { GlassCard }        from '@/components/ui/GlassCard';
import { NeuralButton }     from '@/components/ui/NeuralButton';
import { ScreenHeader }     from '@/components/ui/ScreenHeader';
import { useAppStore }      from '@/store/appStore';

export default function ChallengesScreen() {
  const insets = useSafeAreaInsets();
  const { challenges, joinChallenge } = useAppStore();

  const TYPE_COLORS: Record<string, string> = {
    detox:    Colors.positive,
    focus:    Colors.primary,
    recovery: Colors.secondary,
    streak:   Colors.warning,
  };

  const TYPE_ICONS: Record<string, string> = {
    detox: 'ban-outline', focus: 'locate-outline', recovery: 'leaf-outline', streak: 'flame-outline',
  };

  return (
    <View style={styles.root}>
      <NeuralBackground intensity="low" />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Community Challenges" subtitle="Compete & recover together" showBack accentColor={Colors.primary} />

        {/* Stats */}
        <View style={styles.communityStats}>
          {[
            { value: '12.4K', label: 'Active Members', icon: 'people-outline' },
            { value: '847',   label: 'Challenges Completed', icon: 'trophy-outline' },
            { value: '94%',   label: 'Avg Recovery Rate',  icon: 'trending-up-outline' },
          ].map((s) => (
            <GlassCard key={s.label} style={styles.statCard} padding={12}>
              <Ionicons name={s.icon as any} size={22} color={Colors.primary} />
              <Text style={[Typography.h3, { color: Colors.primary, marginTop: 4 }]}>{s.value}</Text>
              <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 2, textAlign: 'center' }]}>{s.label}</Text>
            </GlassCard>
          ))}
        </View>

        {/* Challenge cards */}
        <Text style={[Typography.caption, styles.sectionLabel]}>ACTIVE CHALLENGES</Text>
        {challenges.map((c) => {
          const color = TYPE_COLORS[c.type];
          return (
            <GlassCard
              key={c.id}
              variant={c.isJoined ? 'success' : 'default'}
              glowAccent
              accentColor={c.isJoined ? Colors.positive : color}
              style={styles.challengeCard}
              padding={16}
            >
              {/* Header */}
              <View style={styles.challengeHeader}>
                <View style={[styles.challengeIcon, { backgroundColor: `${color}15` }]}>
                  <Ionicons name={(TYPE_ICONS[c.type] ?? 'flag-outline') as any} size={26} color={color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.h4]}>{c.title}</Text>
                  <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>{c.description}</Text>
                </View>
                {c.isJoined && (
                  <View style={styles.joinedBadge}>
                    <Ionicons name="checkmark-circle" size={20} color={Colors.positive} />
                  </View>
                )}
              </View>

              {/* Stats */}
              <View style={styles.challengeStats}>
                <View style={styles.challengeStat}>
                  <Text style={[Typography.label, { color: color }]}>{c.participants.toLocaleString()}</Text>
                  <Text style={[Typography.caption, { color: Colors.textMuted }]}>Participants</Text>
                </View>
                <View style={styles.challengeStat}>
                  <Text style={[Typography.label, { color: c.daysLeft <= 2 ? Colors.danger : Colors.warning }]}>
                    {c.daysLeft}d left
                  </Text>
                  <Text style={[Typography.caption, { color: Colors.textMuted }]}>Remaining</Text>
                </View>
                <View style={styles.challengeStat}>
                  <Text style={[Typography.label, { color: Colors.primary }]}>{c.reward.split(' ')[0]}</Text>
                  <Text style={[Typography.caption, { color: Colors.textMuted }]}>Reward</Text>
                </View>
              </View>

              {/* Progress (if joined) */}
              {c.isJoined && c.leaderboard.length > 0 && (
                <View style={styles.leaderboard}>
                  <Text style={[Typography.caption, { color: Colors.textMuted, marginBottom: 8 }]}>LEADERBOARD</Text>
                  {c.leaderboard.map((entry) => (
                    <View key={entry.rank} style={styles.leaderRow}>
                      <Text style={[Typography.label, { color: entry.name === 'You' ? Colors.primary : Colors.textMuted, width: 20 }]}>
                        #{entry.rank}
                      </Text>
                      <Ionicons name="person-circle-outline" size={18} color={entry.name === 'You' ? Colors.primary : Colors.textMuted} />
                      <Text style={[Typography.label, { flex: 1, color: entry.name === 'You' ? Colors.primary : Colors.textSecondary }]}>
                        {entry.name}
                      </Text>
                      <Text style={[Typography.label, { color: color }]}>{entry.score}%</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Join button */}
              {!c.isJoined && (
                <NeuralButton
                  title="Join Challenge"
                  onPress={() => joinChallenge(c.id)}
                  variant="primary"
                  style={{ marginTop: 12 }}
                  size="sm"
                />
              )}
            </GlassCard>
          );
        })}

        {/* Upcoming badge */}
        <GlassCard variant="secondary" padding={14} style={{ marginTop: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Ionicons name="rocket-outline" size={20} color={Colors.secondary} />
            <Text style={[Typography.h4]}>Coming Soon</Text>
          </View>
          <Text style={[Typography.body, { color: Colors.textMuted }]}>
            Sleep Optimization Sprint, Mindful Morning Challenge, and Corporate Team Challenges launching next week.
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
  communityStats: { flexDirection: 'row', gap: 10, marginBottom: 8, marginTop: 4 },
  statCard: { flex: 1, alignItems: 'center' },
  sectionLabel: { color: Colors.textMuted, marginTop: 8, marginBottom: 10 },
  challengeCard:  { marginBottom: 14 },
  challengeHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  challengeIcon:   { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  joinedBadge:     { flexShrink: 0 },
  challengeStats:  { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: Colors.borderSubtle, paddingTop: 12 },
  challengeStat:   { alignItems: 'center', gap: 3 },
  leaderboard:     { marginTop: 12, borderTopWidth: 1, borderTopColor: Colors.borderSubtle, paddingTop: 10 },
  leaderRow:       { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
});
