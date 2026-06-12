import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence, Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { Typography, Spacing } from '@/constants/theme';
import { NeuralBackground } from '@/components/ui/NeuralBackground';
import { NeuralButton }     from '@/components/ui/NeuralButton';
import { GlassCard }        from '@/components/ui/GlassCard';

const { width: W } = Dimensions.get('window');

type Phase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out' | 'rest';

const PHASES: Phase[] = ['inhale', 'hold-in', 'exhale', 'hold-out'];
const PHASE_LABELS: Record<Phase, string> = {
  'inhale':   'Inhale',
  'hold-in':  'Hold',
  'exhale':   'Exhale',
  'hold-out': 'Hold',
  'rest':     'Rest',
};
const PHASE_COLORS: Record<Phase, string> = {
  'inhale':   Colors.primary,
  'hold-in':  Colors.positive,
  'exhale':   Colors.secondary,
  'hold-out': Colors.warning,
  'rest':     Colors.textMuted,
};

export default function RecoveryExerciseScreen() {
  const insets  = useSafeAreaInsets();
  const router  = useRouter();
  const params  = useLocalSearchParams<{ type?: string }>();
  const type    = (params.type ?? 'breathing') as 'breathing' | 'eyes' | 'stretch' | 'mindful';

  const [phase,   setPhase]   = useState<Phase>('inhale');
  const [count,   setCount]   = useState(4);
  const [cycles,  setCycles]  = useState(0);
  const [done,    setDone]    = useState(false);
  const TOTAL_CYCLES = 4;

  const circleScale = useSharedValue(1);
  const circleOp    = useSharedValue(0.6);
  const rotation    = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 16000, easing: Easing.linear }),
      -1, false,
    );
  }, []);

  useEffect(() => {
    if (done) return;

    if (phase === 'inhale') {
      circleScale.value = withTiming(1.7, { duration: 4000, easing: Easing.inOut(Easing.sin) });
      circleOp.value    = withTiming(1, { duration: 4000 });
    } else if (phase === 'exhale') {
      circleScale.value = withTiming(1.0, { duration: 4000, easing: Easing.inOut(Easing.sin) });
      circleOp.value    = withTiming(0.5, { duration: 4000 });
    }

    let c = phase === 'hold-in' || phase === 'hold-out' ? 4 : 4;
    setCount(c);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const interval = setInterval(() => {
      c -= 1;
      setCount(c);
      if (c <= 0) {
        clearInterval(interval);
        const idx  = PHASES.indexOf(phase);
        const next = PHASES[(idx + 1) % 4] as Phase;
        if (next === 'inhale') {
          const newCycles = cycles + 1;
          setCycles(newCycles);
          if (newCycles >= TOTAL_CYCLES) {
            setDone(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            return;
          }
        }
        setPhase(next);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, done]);

  const circleStyle  = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
    opacity:   circleOp.value,
  }));

  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const color = PHASE_COLORS[phase];

  if (done) {
    return (
      <View style={styles.root}>
        <NeuralBackground intensity="low" />
        <View style={styles.doneContainer}>
          <Ionicons name="sparkles-outline" size={80} color={Colors.positive} />
          <Text style={[Typography.h1, { textAlign: 'center', marginTop: 24 }]}>
            Recovery Complete
          </Text>
          <Text style={[Typography.body, { color: Colors.textMuted, textAlign: 'center', marginTop: 12, maxWidth: 260 }]}>
            Your nervous system has been reset. You've earned +25 XP and improved your recovery score.
          </Text>
          <GlassCard variant="success" style={{ marginTop: 32, width: W - 64 }} padding={14}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Ionicons name="fitness-outline" size={18} color={Colors.positive} />
              <Text style={[Typography.label, { color: Colors.positive, textAlign: 'center' }]}>
                4 cycles · 4 minutes · Cortisol reduced
              </Text>
            </View>
          </GlassCard>
          <NeuralButton
            title="Back to Recovery Lab"
            onPress={() => router.back()}
            style={{ marginTop: 32, width: W - 64 }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <NeuralBackground intensity="medium" />

      <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[Typography.caption, { color: Colors.textMuted }]}>
            BOX BREATHING · CYCLE {cycles + 1}/{TOTAL_CYCLES}
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>Exit</Text>
          </TouchableOpacity>
        </View>

        {/* Central breathing animation */}
        <View style={styles.breathSection}>
          {/* Rotating outer ring */}
          <Animated.View style={[styles.outerRing, rotationStyle, { borderColor: color }]} />

          {/* Breathing circle */}
          <Animated.View style={[styles.breathCircle, circleStyle, { backgroundColor: color + '15', borderColor: color }]}>
            <View style={styles.centerContent}>
              <Text style={[Typography.metric, { color, lineHeight: 56 }]}>{count}</Text>
              <Text style={[Typography.h4, { color }]}>{PHASE_LABELS[phase]}</Text>
            </View>
          </Animated.View>
        </View>

        {/* Phase guide */}
        <View style={styles.phaseGuide}>
          {PHASES.map((p) => (
            <View key={p} style={styles.phaseItem}>
              <View style={[
                styles.phaseDot,
                { backgroundColor: p === phase ? PHASE_COLORS[p] : Colors.backgroundAlt,
                  borderColor: PHASE_COLORS[p] },
              ]} />
              <Text style={[Typography.caption, {
                color: p === phase ? PHASE_COLORS[p] : Colors.textMuted,
              }]}>
                {PHASE_LABELS[p]}
              </Text>
            </View>
          ))}
        </View>

        {/* Instructions */}
        <GlassCard style={styles.instructions} padding={14}>
          <Text style={[Typography.body, { color: Colors.textMuted, textAlign: 'center' }]}>
            {phase === 'inhale'   ? 'Breathe in slowly through your nose, filling your lungs completely.' :
             phase === 'hold-in'  ? 'Hold your breath comfortably. Feel the pause between breaths.' :
             phase === 'exhale'   ? 'Exhale slowly through your mouth, emptying your lungs fully.' :
                                    'Hold with empty lungs. Rest in this quiet space.'}
          </Text>
        </GlassCard>

        <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 20 }]}>
          4-4-4-4 Box Breathing · Activates parasympathetic nervous system
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: 60,
  },
  header: {
    width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  breathSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 280,
    height: 280,
  },
  outerRing: {
    position: 'absolute',
    width: 280, height: 280, borderRadius: 140,
    borderWidth: 2, borderStyle: 'dashed', opacity: 0.3,
  },
  breathCircle: {
    width: 200, height: 200, borderRadius: 100,
    borderWidth: 3, alignItems: 'center', justifyContent: 'center',
  },
  centerContent: { alignItems: 'center' },
  phaseGuide:    { flexDirection: 'row', gap: 20, marginVertical: 20 },
  phaseItem:     { alignItems: 'center', gap: 6 },
  phaseDot:      { width: 10, height: 10, borderRadius: 5, borderWidth: 1.5 },
  instructions:  { width: '100%' },
  doneContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
});
