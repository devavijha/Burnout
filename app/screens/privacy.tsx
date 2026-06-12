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
import { NeuralButton }     from '@/components/ui/NeuralButton';
import { ScreenHeader }     from '@/components/ui/ScreenHeader';

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState({
    localProcessing: true,
    anonymousAnalytics: false,
    crashReports: true,
    personalization: true,
    dataSharing: false,
    encryptedBackup: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const DATA_ITEMS = [
    { icon: '📱', label: 'Screen time patterns', retained: '90 days', onDevice: true },
    { icon: '🧠', label: 'Burnout score history', retained: '1 year', onDevice: true },
    { icon: '🎯', label: 'Focus session data', retained: '90 days', onDevice: true },
    { icon: '💤', label: 'Sleep patterns', retained: '1 year', onDevice: true },
    { icon: '💬', label: 'AI chat conversations', retained: '30 days', onDevice: true },
    { icon: '🏆', label: 'Achievements & XP', retained: 'Permanent', onDevice: false },
  ];

  return (
    <View style={styles.root}>
      <NeuralBackground intensity="low" />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Data Privacy" subtitle="Your neural data is yours" showBack accentColor={Colors.positive} />

        {/* Privacy pledge */}
        <GlassCard variant="success" style={styles.pledgeCard} padding={16}>
          <View style={styles.pledgeRow}>
            <Ionicons name="shield-checkmark" size={32} color={Colors.positive} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[Typography.h4]}>Privacy-First Architecture</Text>
              <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>
                All burnout analysis and behavioral data is processed on-device. We never sell your personal information. You maintain full control.
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Data controls */}
        <Text style={[Typography.caption, styles.sectionLabel]}>DATA CONTROLS</Text>
        <GlassCard padding={0}>
          {[
            { id: 'localProcessing', label: 'On-Device AI Processing', description: 'Keeps all analysis local — no data leaves your device', locked: true },
            { id: 'anonymousAnalytics', label: 'Anonymous Analytics', description: 'Help improve the app with anonymized usage stats' },
            { id: 'crashReports', label: 'Crash Reports', description: 'Send anonymous crash data to help fix bugs' },
            { id: 'personalization', label: 'AI Personalization', description: 'Use your patterns to improve AI coach responses' },
            { id: 'dataSharing', label: 'Research Participation', description: 'Contribute to anonymous digital wellness research' },
            { id: 'encryptedBackup', label: 'Encrypted Backup', description: 'Back up your data with end-to-end encryption' },
          ].map((item, i, arr) => (
            <View
              key={item.id}
              style={[
                styles.controlRow,
                i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle },
              ]}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[Typography.label, { color: Colors.textPrimary }]}>{item.label}</Text>
                  {item.locked && <Ionicons name="lock-closed" size={12} color={Colors.positive} />}
                </View>
                <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>{item.description}</Text>
              </View>
              <Switch
                value={settings[item.id as keyof typeof settings]}
                onValueChange={() => {
                  if (!item.locked) toggle(item.id as keyof typeof settings);
                }}
                disabled={item.locked}
                trackColor={{ false: Colors.surface, true: Colors.positive + '60' }}
                thumbColor={settings[item.id as keyof typeof settings] ? Colors.positive : Colors.textMuted}
                ios_backgroundColor={Colors.surface}
              />
            </View>
          ))}
        </GlassCard>

        {/* Data inventory */}
        <Text style={[Typography.caption, styles.sectionLabel]}>DATA WE COLLECT</Text>
        <GlassCard padding={0}>
          {DATA_ITEMS.map((d, i) => (
            <View
              key={d.label}
              style={[
                styles.dataRow,
                i < DATA_ITEMS.length - 1 && { borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle },
              ]}
            >
              <Text style={{ fontSize: 20 }}>{d.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.label, { color: Colors.textPrimary }]}>{d.label}</Text>
                <Text style={[Typography.caption, { color: Colors.textMuted }]}>Retained: {d.retained}</Text>
              </View>
              <View style={[styles.locationBadge, { backgroundColor: d.onDevice ? Colors.glowGreen : Colors.glowCyan }]}>
                <Text style={[Typography.caption, { color: d.onDevice ? Colors.positive : Colors.primary, fontSize: 9 }]}>
                  {d.onDevice ? '📱 Device' : '☁️ Cloud'}
                </Text>
              </View>
            </View>
          ))}
        </GlassCard>

        {/* Actions */}
        <Text style={[Typography.caption, styles.sectionLabel]}>DATA ACTIONS</Text>
        <View style={styles.actionsCol}>
          <NeuralButton title="Download My Data" onPress={() => {}} variant="ghost" size="sm" />
          <NeuralButton title="Delete All Data" onPress={() => {}} variant="danger" size="sm" />
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg },
  pledgeCard: { marginBottom: 8, marginTop: 4 },
  pledgeRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  sectionLabel: { color: Colors.textMuted, marginTop: 16, marginBottom: 8 },
  controlRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  dataRow:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  locationBadge: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  actionsCol: { gap: 10 },
});
