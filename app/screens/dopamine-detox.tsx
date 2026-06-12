import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Alert,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/theme';
import { NeuralBackground } from '@/components/ui/NeuralBackground';
import { GlassCard }        from '@/components/ui/GlassCard';
import { NeuralButton }     from '@/components/ui/NeuralButton';
import { ScreenHeader }     from '@/components/ui/ScreenHeader';
import { PulseRing }        from '@/components/ui/PulseRing';

const APPS = [
  { id: 'twitter',   name: 'X (Twitter)',  icon: 'logo-twitter'       as const, enabled: true  },
  { id: 'instagram', name: 'Instagram',    icon: 'logo-instagram'     as const, enabled: true  },
  { id: 'tiktok',    name: 'TikTok',       icon: 'musical-notes-outline' as const, enabled: true  },
  { id: 'reddit',    name: 'Reddit',       icon: 'logo-reddit'        as const, enabled: false },
  { id: 'youtube',   name: 'YouTube',      icon: 'logo-youtube'       as const, enabled: false },
  { id: 'linkedin',  name: 'LinkedIn',     icon: 'logo-linkedin'      as const, enabled: false },
];

const DURATIONS = [
  { label: '1 Hour',   hours: 1  },
  { label: '4 Hours',  hours: 4  },
  { label: '8 Hours',  hours: 8  },
  { label: '24 Hours', hours: 24 },
  { label: 'Weekend',  hours: 48 },
];

export default function DopamineDetoxScreen() {
  const insets = useSafeAreaInsets();
  const [isActive,   setIsActive]   = useState(false);
  const [selDur,     setSelDur]     = useState(1);
  const [blocked,    setBlocked]    = useState<Record<string, boolean>>(
    Object.fromEntries(APPS.map((a) => [a.id, a.enabled])),
  );
  const [secondsLeft, setSecondsLeft] = useState(0);

  const shieldScale = useSharedValue(1);
  const shieldGlow  = useSharedValue(0.5);

  useEffect(() => {
    if (isActive) {
      shieldScale.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(1.0,  { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        ), -1, false,
      );
      shieldGlow.value = withRepeat(
        withSequence(withTiming(1, { duration: 1500 }), withTiming(0.3, { duration: 1500 })),
        -1, false,
      );
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive || secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [isActive, secondsLeft]);

  const shieldStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shieldScale.value }],
    opacity:   shieldGlow.value,
  }));

  const handleActivate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSecondsLeft(DURATIONS[selDur].hours * 3600);
    setIsActive(true);
  };

  const handleDeactivate = () => {
    Alert.alert('Break Detox?', 'Ending early reduces your recovery score. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End Detox', style: 'destructive', onPress: () => { setIsActive(false); setSecondsLeft(0); } },
    ]);
  };

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  const progress = isActive
    ? 1 - secondsLeft / (DURATIONS[selDur].hours * 3600)
    : 0;

  return (
    <View style={styles.root}>
      <NeuralBackground intensity={isActive ? 'medium' : 'low'} />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Dopamine Detox" subtitle="Neural restriction protocol" showBack />

        <View style={styles.shieldSection}>
          {isActive ? (
            <Animated.View style={shieldStyle}>
              <PulseRing size={160} color={Colors.positive} rings={3} speed="slow">
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="shield-checkmark-outline" size={52} color={Colors.positive} />
                </View>
              </PulseRing>
            </Animated.View>
          ) : (
            <View style={{ width: 120, height: 120, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="phone-portrait-outline" size={64} color={Colors.textMuted} />
            </View>
          )}
          {isActive && (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text style={[Typography.caption, { color: Colors.positive }]}>DETOX ACTIVE</Text>
              <Text style={[Typography.metric, { color: Colors.positive }]}>{fmt(secondsLeft)}</Text>
              <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>remaining</Text>
            </View>
          )}
        </View>

        {!isActive ? (
          <>
            <Text style={[Typography.caption, styles.sectionLabel]}>DETOX DURATION</Text>
            <View style={styles.durationRow}>
              {DURATIONS.map((d, i) => (
                <TouchableOpacity key={d.label} onPress={() => setSelDur(i)}
                  style={[styles.durationBtn, selDur === i && styles.durationSelected]}>
                  <Text style={[Typography.label, { color: selDur === i ? Colors.positive : Colors.textMuted }]}>{d.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[Typography.caption, styles.sectionLabel]}>BLOCK THESE APPS</Text>
            <GlassCard>
              {APPS.map((app, i) => (
                <View key={app.id} style={[styles.appRow, i < APPS.length - 1 && { borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle }]}>
                  <Ionicons name={app.icon as any} size={22} color={Colors.textSecondary} />
                  <Text style={[Typography.bodyLarge, { flex: 1 }]}>{app.name}</Text>
                  <Switch
                    value={blocked[app.id]}
                    onValueChange={() => setBlocked((p) => ({ ...p, [app.id]: !p[app.id] }))}
                    trackColor={{ false: Colors.backgroundAlt, true: Colors.positive + '60' }}
                    thumbColor={blocked[app.id] ? Colors.positive : Colors.textMuted}
                    ios_backgroundColor={Colors.backgroundAlt}
                  />
                </View>
              ))}
            </GlassCard>

            <GlassCard variant="success" style={{ marginTop: 12 }} padding={14}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Ionicons name="sparkles-outline" size={20} color={Colors.positive} />
                <Text style={[Typography.h4]}>What Happens During Detox</Text>
              </View>
              {['Dopamine receptors resensitize after 2h', 'Focus recovers at 4h', 'Deep work restores after 8h', 'Full neural reset at 24h'].map((b, i) => (
                <View key={i} style={{ flexDirection: 'row', gap: 8, marginBottom: 4 }}>
                  <Ionicons name="checkmark-outline" size={16} color={Colors.positive} />
                  <Text style={[Typography.bodySmall, { color: Colors.textMuted, flex: 1 }]}>{b}</Text>
                </View>
              ))}
            </GlassCard>

            <NeuralButton title="Activate Detox Protocol" onPress={handleActivate} variant="success" style={{ marginTop: 12 }} />
          </>
        ) : (
          <>
            <GlassCard variant="success" style={{ marginBottom: 12 }} padding={16}>
              <Text style={[Typography.h4, { marginBottom: 6 }]}>Detox in Progress</Text>
              <Text style={[Typography.body, { color: Colors.textMuted }]}>
                {Object.values(blocked).filter(Boolean).length} apps are restricted. Stay strong!
              </Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
              </View>
            </GlassCard>

            <Text style={[Typography.caption, styles.sectionLabel]}>BLOCKED</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {APPS.filter((a) => blocked[a.id]).map((app) => (
                <View key={app.id} style={styles.blockedChip}>
                  <Ionicons name={app.icon as any} size={14} color={Colors.positive} />
                  <Text style={[Typography.bodySmall, { color: Colors.positive }]}>{app.name}</Text>
                </View>
              ))}
            </View>

            <NeuralButton title="End Detox Early" onPress={handleDeactivate} variant="danger" style={{ marginTop: 20 }} />
          </>
        )}
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:          { flex: 1, backgroundColor: Colors.background },
  scroll:        { paddingHorizontal: Spacing.lg },
  shieldSection: { alignItems: 'center', paddingVertical: 32 },
  sectionLabel:  { color: Colors.textMuted, marginTop: 16, marginBottom: 10 },
  durationRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  durationBtn:   { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.borderSubtle, backgroundColor: Colors.surface },
  durationSelected: { borderColor: Colors.positive, backgroundColor: Colors.glowGreen },
  appRow:        { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  progressBarBg: { height: 4, backgroundColor: Colors.backgroundAlt, borderRadius: 2, marginTop: 12, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: Colors.positive, borderRadius: 2 },
  blockedChip:   { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.glowGreen, borderWidth: 1, borderColor: Colors.positive, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 6 },
});
