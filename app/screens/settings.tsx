import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/theme';
import { NeuralBackground } from '@/components/ui/NeuralBackground';
import { GlassCard }        from '@/components/ui/GlassCard';
import { ScreenHeader }     from '@/components/ui/ScreenHeader';
import { useAuthStore }     from '@/store/authStore';

type ToggleSetting = { id: string; label: string; description: string; value: boolean };

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useAuthStore();

  const [toggles, setToggles] = useState<ToggleSetting[]>([
    { id: 'notifications',    label: 'Push Notifications',     description: 'Burnout alerts and reminders',          value: user?.notificationsEnabled ?? true   },
    { id: 'sound',            label: 'Ambient Sound',          description: 'Audio during focus sessions',           value: user?.soundEnabled ?? true           },
    { id: 'haptics',          label: 'Haptic Feedback',        description: 'Vibration for interactions',            value: true                                 },
    { id: 'dailyReport',      label: 'Daily Burnout Report',   description: 'Morning neural state summary',          value: true                                 },
    { id: 'breakReminders',   label: 'Break Reminders',        description: 'Nudge every 90 minutes',               value: true                                 },
    { id: 'nightMode',        label: 'Late-Night Lock',        description: 'Restrict apps after 10 PM',            value: false                                },
    { id: 'biometrics',       label: 'Biometric Lock',         description: 'Face ID / fingerprint for app access', value: false                                },
    { id: 'background',       label: 'Background Tracking',    description: 'Track usage in background',            value: true                                 },
  ]);

  const toggle = (id: string) => {
    setToggles((prev) => prev.map((t) => t.id === id ? { ...t, value: !t.value } : t));
    if (id === 'notifications') updateUser({ notificationsEnabled: !toggles.find((t) => t.id === id)?.value });
    if (id === 'sound')         updateUser({ soundEnabled: !toggles.find((t) => t.id === id)?.value });
  };

  const SECTIONS = [
    { title: 'NOTIFICATIONS', ids: ['notifications', 'dailyReport', 'breakReminders'] },
    { title: 'EXPERIENCE',    ids: ['sound', 'haptics', 'background'] },
    { title: 'SECURITY',      ids: ['nightMode', 'biometrics'] },
  ];

  return (
    <View style={styles.root}>
      <NeuralBackground intensity="low" />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Settings" subtitle="System preferences" showBack />

        {/* Account info */}
        <GlassCard variant="primary" style={styles.accountCard} padding={14}>
          <View style={styles.accountRow}>
            <View style={styles.accountAvatar}>
              <Ionicons name="person-outline" size={28} color={Colors.primary} />
            </View>
            <View>
              <Text style={[Typography.h4]}>{user?.displayName ?? 'Neural User'}</Text>
              <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>{user?.email}</Text>
              <Text style={[Typography.caption, { color: Colors.primary, marginTop: 2 }]}>
                Level {user?.level ?? 1} · {user?.role ?? 'user'}
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Toggle groups */}
        {SECTIONS.map((section) => (
          <View key={section.title}>
            <Text style={[Typography.caption, styles.sectionLabel]}>{section.title}</Text>
            <GlassCard style={styles.sectionCard} padding={0}>
              {section.ids.map((id, i) => {
                const setting = toggles.find((t) => t.id === id);
                if (!setting) return null;
                return (
                  <View
                    key={id}
                    style={[
                      styles.settingRow,
                      i < section.ids.length - 1 && { borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle },
                    ]}
                  >
                    <View style={styles.settingText}>
                      <Text style={[Typography.label, { color: Colors.textPrimary }]}>{setting.label}</Text>
                      <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>{setting.description}</Text>
                    </View>
                    <Switch
                      value={setting.value}
                      onValueChange={() => toggle(id)}
                      trackColor={{ false: Colors.backgroundAlt, true: Colors.primary + '60' }}
                      thumbColor={setting.value ? Colors.primary : Colors.textMuted}
                      ios_backgroundColor={Colors.backgroundAlt}
                    />
                  </View>
                );
              })}
            </GlassCard>
          </View>
        ))}

        {/* App info */}
        <Text style={[Typography.caption, styles.sectionLabel]}>ABOUT</Text>
        <GlassCard padding={0}>
          {[
            { label: 'App Version',   value: '1.0.0',           icon: 'information-circle-outline' },
            { label: 'Build',         value: 'Neural Edition',  icon: 'code-outline' },
            { label: 'Support',       value: 'support@resetos.app', icon: 'mail-outline' },
          ].map((item, i) => (
            <View key={item.label} style={[styles.settingRow, i < 2 && { borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                <Ionicons name={item.icon as any} size={18} color={Colors.textMuted} />
                <Text style={[Typography.label, { color: Colors.textSecondary }]}>{item.label}</Text>
              </View>
              <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>{item.value}</Text>
            </View>
          ))}
        </GlassCard>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg },
  accountCard: { marginBottom: 8, marginTop: 4 },
  accountRow:  { flexDirection: 'row', alignItems: 'center', gap: 14 },
  accountAvatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.glowCyan, borderWidth: 2, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  sectionLabel: { color: Colors.textMuted, marginTop: 16, marginBottom: 8 },
  sectionCard:  { overflow: 'hidden' },
  settingRow:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  settingText:  { flex: 1 },
});
