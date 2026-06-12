import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/theme';
import { NeuralBackground } from '@/components/ui/NeuralBackground';
import { NeuralButton }     from '@/components/ui/NeuralButton';
import { GlassCard }        from '@/components/ui/GlassCard';

const PERMISSIONS = [
  {
    id: 'notifications',
    icon: 'notifications-outline',
    title: 'Notifications',
    description: 'Burnout alerts, focus reminders, and recovery nudges at the right moment.',
    color: Colors.primary,
    required: true,
  },
  {
    id: 'screenTime',
    icon: 'phone-portrait-outline',
    title: 'Screen Time Access',
    description: 'Analyze your digital usage patterns to calculate an accurate burnout score.',
    color: Colors.secondary,
    required: true,
  },
  {
    id: 'health',
    icon: 'heart-outline',
    title: 'Health & Fitness',
    description: 'Track sleep quality and physical recovery to correlate with digital fatigue.',
    color: Colors.positive,
    required: false,
  },
  {
    id: 'focus',
    icon: 'shield-outline',
    title: 'App Usage Control',
    description: 'Enable Focus Mode to temporarily limit distracting apps during deep work.',
    color: Colors.warning,
    required: false,
  },
] as const;

export default function PermissionsScreen() {
  const router = useRouter();
  const [granted, setGranted] = useState<Record<string, boolean>>({});
  const [isRequesting, setIsRequesting] = useState(false);

  const togglePermission = (id: string) => {
    setGranted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const requestAll = async () => {
    setIsRequesting(true);
    try {
      // In production: use expo-notifications / expo-battery APIs
      await new Promise((r) => setTimeout(r, 600));
      const allGranted: Record<string, boolean> = {};
      PERMISSIONS.forEach((p) => (allGranted[p.id] = true));
      setGranted(allGranted);
    } finally {
      setIsRequesting(false);
    }
  };

  const canContinue = PERMISSIONS.filter((p) => p.required).every((p) => granted[p.id]);

  const skipOptional = () => {
    const requiredGranted: Record<string, boolean> = {};
    PERMISSIONS.filter((p) => p.required).forEach((p) => (requiredGranted[p.id] = true));
    setGranted((prev) => ({ ...prev, ...requiredGranted }));
  };

  const handleContinue = () => {
    router.replace('/tabs/dashboard');
  };

  return (
    <View style={styles.root}>
      <NeuralBackground intensity="low" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBlock}>
          <Text style={[Typography.caption, { color: Colors.textMuted }]}>STEP 3</Text>
          <Text style={[Typography.h1, { marginTop: 8 }]}>Enable Sensors</Text>
          <Text style={[Typography.body, { color: Colors.textMuted, marginTop: 8 }]}>
            ResetOS needs access to certain data sources to monitor and protect your brain.
          </Text>
        </View>

        <View style={styles.permList}>
          {PERMISSIONS.map((p) => (
            <TouchableOpacity
              key={p.id}
              onPress={() => togglePermission(p.id)}
              activeOpacity={0.8}
            >
              <GlassCard
                style={styles.permCard}
                variant={granted[p.id] ? 'success' : 'default'}
                glowAccent
                accentColor={granted[p.id] ? Colors.positive : p.color}
              >
                <View style={styles.permRow}>
                  {/* Icon */}
                  <View style={[styles.iconBox, { backgroundColor: `${p.color}22` }]}>
                    <Ionicons name={p.icon as any} size={24} color={p.color} />
                  </View>

                  {/* Text */}
                  <View style={styles.permText}>
                    <View style={styles.permTitleRow}>
                      <Text style={[Typography.h4, { color: Colors.textPrimary }]}>{p.title}</Text>
                      {p.required && (
                        <View style={styles.requiredBadge}>
                          <Text style={styles.requiredText}>Required</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[Typography.bodySmall, { color: Colors.textMuted, marginTop: 3 }]}>
                      {p.description}
                    </Text>
                  </View>

                  {/* Checkbox */}
                  <View
                    style={[
                      styles.checkbox,
                      granted[p.id]
                        ? { backgroundColor: Colors.positive, borderColor: Colors.positive }
                        : { borderColor: Colors.borderSubtle },
                    ]}
                  >
                    {granted[p.id] && (
                      <Ionicons name="checkmark" size={14} color={Colors.textInverse} />
                    )}
                  </View>
                </View>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick-grant button */}
        <NeuralButton
          title="Allow All Access"
          onPress={requestAll}
          loading={isRequesting}
          variant="primary"
          style={{ marginBottom: 12 }}
        />

        <NeuralButton
          title="Continue"
          onPress={handleContinue}
          variant={canContinue ? 'success' : 'ghost'}
          disabled={!canContinue}
          style={{ marginBottom: 12 }}
        />

        <TouchableOpacity onPress={skipOptional} style={styles.skipLink}>
          <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>
            Skip optional permissions
          </Text>
        </TouchableOpacity>

        {/* Privacy note */}
        <GlassCard variant="secondary" style={styles.privacyNote} padding={12}>
          <View style={styles.privacyRow}>
            <Ionicons name="lock-closed" size={14} color={Colors.secondary} />
            <Text style={[Typography.bodySmall, { color: Colors.textMuted, flex: 1, marginLeft: 8 }]}>
              All data is encrypted and processed on-device. We never sell your personal information.
            </Text>
          </View>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: {
    padding:    Spacing.xl,
    paddingBottom: 60,
  },
  headerBlock: { marginTop: 60, marginBottom: 32 },
  permList:    { gap: 12, marginBottom: 24 },
  permCard:    { marginBottom: 0 },
  permRow:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: {
    width:         44,
    height:        44,
    borderRadius:  12,
    alignItems:    'center',
    justifyContent: 'center',
    flexShrink:    0,
  },
  permText:     { flex: 1 },
  permTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  requiredBadge: {
    backgroundColor: Colors.glowCyan,
    borderRadius:    Radius.full,
    paddingHorizontal: 6,
    paddingVertical:   2,
  },
  requiredText: {
    fontSize:   9,
    fontWeight: '700',
    color:      Colors.primary,
    letterSpacing: 0.8,
  },
  checkbox: {
    width:         24,
    height:        24,
    borderRadius:  12,
    borderWidth:   2,
    alignItems:    'center',
    justifyContent: 'center',
    flexShrink:    0,
  },
  skipLink:    { alignItems: 'center', marginBottom: 20 },
  privacyNote: { marginTop: 8 },
  privacyRow:  { flexDirection: 'row', alignItems: 'flex-start' },
});
