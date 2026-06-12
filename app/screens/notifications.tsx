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
import { ScreenHeader }     from '@/components/ui/ScreenHeader';
import { useAppStore }      from '@/store/appStore';

const NOTIFICATIONS = [
  {
    id: '1', type: 'burnout-alert', title: 'Burnout Alert',
    body: 'Your score reached 72 — high risk. Consider a recovery break.',
    time: '10 min ago', icon: 'alert-circle-outline', color: Colors.danger, unread: true,
  },
  {
    id: '2', type: 'focus-reminder', title: 'Focus Session Complete',
    body: 'You completed a 25-minute deep work session. +50 XP earned!',
    time: '1 hour ago', icon: 'locate-outline', color: Colors.primary, unread: true,
  },
  {
    id: '3', type: 'ai-insights', title: 'NeuroAI Insight',
    body: 'Based on your patterns, your peak focus window is 9-11 AM. Plan your hardest task then.',
    time: '3 hours ago', icon: 'hardware-chip-outline', color: Colors.secondary, unread: true,
  },
  {
    id: '4', type: 'community', title: 'Challenge Update',
    body: 'You moved to rank #3 in the 7-Day Social Detox challenge!',
    time: '5 hours ago', icon: 'medal-outline', color: Colors.warning, unread: true,
  },
  {
    id: '5', type: 'recovery', title: 'Break Reminder',
    body: "You've been working for 90 minutes. Time for a micro recovery break.",
    time: 'Yesterday', icon: 'leaf-outline', color: Colors.positive, unread: false,
  },
  {
    id: '6', type: 'burnout-alert', title: 'Weekly Report Ready',
    body: 'Your weekly mental health report is ready. Burnout trend: improving',
    time: 'Yesterday', icon: 'analytics-outline', color: Colors.primary, unread: false,
  },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { decrementUnread, unreadCount } = useAppStore();

  const unread = NOTIFICATIONS.filter((n) => n.unread);
  const read   = NOTIFICATIONS.filter((n) => !n.unread);

  return (
    <View style={styles.root}>
      <NeuralBackground intensity="low" />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Notifications"
          subtitle={`${unreadCount} unread`}
          showBack
          accentColor={Colors.primary}
        />

        {unread.length > 0 && (
          <>
            <Text style={[Typography.caption, styles.sectionLabel]}>NEW</Text>
            {unread.map((n) => (
              <TouchableOpacity key={n.id} onPress={decrementUnread} activeOpacity={0.85}>
                <GlassCard
                  variant="primary"
                  glowAccent
                  accentColor={n.color}
                  style={styles.notifCard}
                  padding={14}
                >
                  <View style={styles.notifRow}>
                    <View style={[styles.notifIcon, { backgroundColor: `${n.color}15` }]}>
                      <Ionicons name={n.icon as any} size={22} color={n.color} />
                    </View>
                    <View style={styles.notifText}>
                      <View style={styles.notifTitleRow}>
                        <Text style={[Typography.label, { color: Colors.textPrimary }]}>{n.title}</Text>
                        <View style={styles.unreadDot} />
                      </View>
                      <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>{n.body}</Text>
                      <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 4 }]}>{n.time}</Text>
                    </View>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </>
        )}

        {read.length > 0 && (
          <>
            <Text style={[Typography.caption, styles.sectionLabel]}>EARLIER</Text>
            {read.map((n) => (
              <GlassCard key={n.id} style={styles.notifCard} padding={14}>
                <View style={styles.notifRow}>
                  <View style={[styles.notifIcon, { backgroundColor: `${n.color}08` }]}>
                    <Ionicons name={n.icon as any} size={22} color={n.color} style={{ opacity: 0.7 }} />
                  </View>
                  <View style={styles.notifText}>
                    <Text style={[Typography.label, { color: Colors.textSecondary }]}>{n.title}</Text>
                    <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>{n.body}</Text>
                    <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 4 }]}>{n.time}</Text>
                  </View>
                </View>
              </GlassCard>
            ))}
          </>
        )}

        {/* Notification settings prompt */}
        <GlassCard variant="secondary" style={{ marginTop: 8 }} padding={12}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="settings-outline" size={20} color={Colors.secondary} />
            <Text style={[Typography.bodySmall, { color: Colors.textMuted, flex: 1 }]}>
              Manage notification preferences in Settings
            </Text>
          </View>
        </GlassCard>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg },
  sectionLabel: { color: Colors.textMuted, marginTop: 12, marginBottom: 8 },
  notifCard:  { marginBottom: 10 },
  notifRow:   { flexDirection: 'row', gap: 12 },
  notifIcon:  { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  notifText:  { flex: 1 },
  notifTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  unreadDot:  { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
});
