import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { PulseRing }        from '@/components/ui/PulseRing';
import { GlassCard }        from '@/components/ui/GlassCard';
import { NeuralButton }     from '@/components/ui/NeuralButton';
import { useFocusStore }    from '@/store/focusStore';
import { useFocusTimer, formatTime, sessionProgress } from '@/hooks/useFocusTimer';
import { FOCUS_PRESETS }    from '@/constants/config';

const { width: W } = Dimensions.get('window');

const SOUNDS = [
  { id: 'none',       label: 'Silent',      iconName: 'volume-mute-outline' as const },
  { id: 'rain',       label: 'Rain',        iconName: 'rainy-outline' as const },
  { id: 'forest',     label: 'Forest',      iconName: 'leaf-outline' as const },
  { id: 'whitenoise', label: 'White Noise', iconName: 'water-outline' as const },
  { id: 'space',      label: 'Space',       iconName: 'planet-outline' as const },
] as const;

const PRESET_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  'flash':    'flash-outline',
  'brain':    'bulb-outline',
  'infinite': 'infinite-outline',
};

export default function FocusScreen() {
  useFocusTimer();
  const insets = useSafeAreaInsets();

  const {
    isActive, isPaused, currentSession,
    secondsRemaining, targetSeconds,
    startSession, pauseSession, resumeSession, endSession,
    ambientSound, setAmbientSound, appBlockEnabled, toggleAppBlock,
  } = useFocusStore();

  const [selectedPreset, setSelectedPreset] = useState(1);

  const breathScale   = useSharedValue(1);
  const breathOpacity = useSharedValue(0.6);
  const activePulse   = useSharedValue(1);

  useEffect(() => {
    if (!isActive) {
      breathScale.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
          withTiming(1.0,  { duration: 4000, easing: Easing.inOut(Easing.sin) }),
        ),
        -1, false,
      );
      breathOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 4000 }),
          withTiming(0.5, { duration: 4000 }),
        ),
        -1, false,
      );
    } else {
      activePulse.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 1000 }),
          withTiming(1.0,  { duration: 1000 }),
        ),
        -1, false,
      );
    }
  }, [isActive]);

  const breathStyle = useAnimatedStyle(() => ({
    transform:  [{ scale: breathScale.value }],
    opacity:    breathOpacity.value,
  }));

  const activeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: activePulse.value }],
  }));

  const progress = sessionProgress(targetSeconds, secondsRemaining);

  const handleStart = () => {
    const preset = FOCUS_PRESETS[selectedPreset];
    const mins   = preset.minutes || 30;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    startSession(mins, preset.label.toLowerCase().replace(' ', '') as any);
  };

  const handlePauseResume = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    isPaused ? resumeSession() : pauseSession();
  };

  const handleStop = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    endSession(false);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 12 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[Typography.h1]}>Focus</Text>
          <View style={[styles.statusPill, {
            backgroundColor: isActive ? `${Colors.positive}10` : Colors.backgroundAlt,
            borderColor: isActive ? `${Colors.positive}30` : Colors.borderSubtle,
          }]}>
            <View style={[styles.statusDot, { backgroundColor: isActive ? Colors.positive : Colors.textMuted }]} />
            <Text style={[Typography.bodySmall, {
              color: isActive ? Colors.positive : Colors.textMuted,
              fontWeight: '500',
            }]}>
              {isActive ? (isPaused ? 'Paused' : 'Active') : 'Idle'}
            </Text>
          </View>
        </View>

        {/* Central timer */}
        <View style={styles.timerSection}>
          {!isActive ? (
            <Animated.View style={breathStyle}>
              <PulseRing size={180} color={Colors.primary} rings={2} speed="slow">
                <View style={styles.idleInner}>
                  <Ionicons name="timer-outline" size={40} color={Colors.primary} />
                  <Text style={[Typography.label, { color: Colors.textMuted, marginTop: 8 }]}>
                    Ready
                  </Text>
                </View>
              </PulseRing>
            </Animated.View>
          ) : (
            <Animated.View style={activeStyle}>
              <View style={styles.timerRing}>
                <View
                  style={[
                    styles.progressRingOuter,
                    { borderColor: isPaused ? Colors.warning : Colors.primary },
                  ]}
                />
                <View style={styles.timerCenter}>
                  <Text style={[Typography.caption, { color: Colors.textMuted }]}>
                    {isPaused ? 'PAUSED' : 'FOCUS'}
                  </Text>
                  <Text style={[Typography.metric, { color: isPaused ? Colors.warning : Colors.primary }]}>
                    {formatTime(secondsRemaining)}
                  </Text>
                  <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>
                    {Math.round(progress * 100)}% complete
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}
        </View>

        {/* Preset selector */}
        {!isActive && (
          <>
            <Text style={[Typography.caption, styles.sectionLabel]}>SESSION TYPE</Text>
            <View style={styles.presets}>
              {FOCUS_PRESETS.map((p, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setSelectedPreset(i)}
                  style={[
                    styles.presetBtn,
                    selectedPreset === i && styles.presetSelected,
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={PRESET_ICONS[p.icon] || 'settings-outline'}
                    size={18}
                    color={selectedPreset === i ? Colors.primary : Colors.textMuted}
                  />
                  <Text style={[Typography.label, {
                    color: selectedPreset === i ? Colors.primary : Colors.textMuted,
                  }]}>
                    {p.label}
                  </Text>
                  {p.minutes > 0 && (
                    <Text style={[Typography.bodySmall, {
                      color: selectedPreset === i ? Colors.primary : Colors.textMuted,
                    }]}>
                      {p.minutes}m
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Ambient sound */}
            <Text style={[Typography.caption, styles.sectionLabel]}>AMBIENT SOUND</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.soundRow}>
              {SOUNDS.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  onPress={() => setAmbientSound(s.id)}
                  style={[
                    styles.soundBtn,
                    ambientSound === s.id && styles.soundSelected,
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={s.iconName as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={ambientSound === s.id ? Colors.primary : Colors.textMuted}
                  />
                  <Text style={[Typography.bodySmall, {
                    color: ambientSound === s.id ? Colors.primary : Colors.textMuted,
                    marginTop: 4,
                  }]}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* App blocking toggle */}
            <GlassCard style={styles.blockCard} padding={16}>
              <View style={styles.blockRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.h4]}>App Blocker</Text>
                  <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>
                    Block distracting apps during focus
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={toggleAppBlock}
                  style={[
                    styles.toggle,
                    { backgroundColor: appBlockEnabled ? Colors.primary : Colors.backgroundAlt },
                  ]}
                >
                  <View style={[
                    styles.toggleThumb,
                    {
                      transform: [{ translateX: appBlockEnabled ? 22 : 2 }],
                      backgroundColor: appBlockEnabled ? Colors.textInverse : Colors.textMuted,
                    },
                  ]} />
                </TouchableOpacity>
              </View>
            </GlassCard>
          </>
        )}

        {/* Action buttons */}
        <View style={styles.actions}>
          {!isActive ? (
            <NeuralButton
              title="Start Focus Session"
              onPress={handleStart}
              variant="primary"
              size="lg"
            />
          ) : (
            <View style={styles.activeActions}>
              <TouchableOpacity onPress={handleStop} style={styles.stopBtn}>
                <Ionicons name="stop" size={22} color={Colors.danger} />
              </TouchableOpacity>
              <NeuralButton
                title={isPaused ? 'Resume' : 'Pause'}
                onPress={handlePauseResume}
                variant={isPaused ? 'success' : 'ghost'}
                style={styles.pauseBtn}
                fullWidth={false}
              />
            </View>
          )}
        </View>

        {/* Recent sessions */}
        {!isActive && (
          <>
            <Text style={[Typography.caption, styles.sectionLabel]}>RECENT SESSIONS</Text>
            <GlassCard>
              {[
                { type: 'Deep Work', duration: 25, time: '2h ago',   status: 'completed' },
                { type: 'Quick Focus', duration: 15, time: '5h ago', status: 'completed' },
                { type: 'Flow State', duration: 50, time: 'yesterday', status: 'interrupted' },
              ].map((s, i) => (
                <View
                  key={i}
                  style={[styles.sessionRow, i < 2 && { borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle }]}
                >
                  <View style={[styles.sessionDot, {
                    backgroundColor: s.status === 'completed' ? Colors.positive : Colors.warning,
                  }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[Typography.label, { color: Colors.textPrimary }]}>{s.type}</Text>
                    <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>{s.time}</Text>
                  </View>
                  <Text style={[Typography.label, { color: Colors.textMuted }]}>{s.duration}m</Text>
                </View>
              ))}
            </GlassCard>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:  { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg },
  header: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingVertical: 16,
    marginBottom:   8,
  },
  statusPill: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             6,
    borderWidth:     1,
    borderRadius:    Radius.full,
    paddingHorizontal: 12,
    paddingVertical:   6,
  },
  statusDot:    { width: 7, height: 7, borderRadius: 4 },
  timerSection: { alignItems: 'center', paddingVertical: 24 },
  idleInner:    { alignItems: 'center' },
  timerRing: {
    width:         200,
    height:        200,
    borderRadius:  100,
    alignItems:    'center',
    justifyContent: 'center',
    position:      'relative',
    backgroundColor: Colors.surface,
    ...Shadow.md,
  },
  progressRingOuter: {
    position:     'absolute',
    inset:        0,
    borderRadius: 100,
    borderWidth:  4,
    opacity:      0.4,
  },
  timerCenter: { alignItems: 'center' },
  sectionLabel: {
    color:        Colors.textMuted,
    marginBottom: 12,
    marginTop:    20,
  },
  presets: {
    flexDirection:  'row',
    gap:            8,
    marginBottom:   8,
    flexWrap:       'wrap',
  },
  presetBtn: {
    paddingHorizontal: 16,
    paddingVertical:    12,
    borderRadius:       Radius.lg,
    borderWidth:        1,
    borderColor:        Colors.borderSubtle,
    backgroundColor:    Colors.surface,
    alignItems:         'center',
    minWidth:           72,
    gap:                4,
    ...Shadow.sm,
  },
  presetSelected: {
    borderColor:     Colors.primary,
    backgroundColor: Colors.glowCyan,
  },
  soundRow:    { marginBottom: 8 },
  soundBtn:    {
    paddingHorizontal: 16,
    paddingVertical:    14,
    borderRadius:       Radius.lg,
    borderWidth:        1,
    borderColor:        Colors.borderSubtle,
    backgroundColor:    Colors.surface,
    alignItems:         'center',
    marginRight:        8,
    gap:                4,
    minWidth:           72,
    ...Shadow.sm,
  },
  soundSelected: {
    borderColor:     Colors.primary,
    backgroundColor: Colors.glowCyan,
  },
  blockCard: { marginVertical: 12 },
  blockRow:  {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  toggle: {
    width:          50,
    height:         28,
    borderRadius:   14,
    justifyContent: 'center',
  },
  toggleThumb: {
    width:            24,
    height:           24,
    borderRadius:     12,
  },
  actions:       { marginTop: 12 },
  activeActions: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  stopBtn: {
    width:           52,
    height:          52,
    borderRadius:    16,
    borderWidth:     1.5,
    borderColor:     Colors.danger,
    backgroundColor: `${Colors.danger}08`,
    alignItems:      'center',
    justifyContent:  'center',
  },
  pauseBtn:   { flex: 1 },
  sessionRow: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingVertical: 14,
    gap:            12,
  },
  sessionDot: { width: 8, height: 8, borderRadius: 4 },
});
