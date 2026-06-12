import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { GlassCard }        from '@/components/ui/GlassCard';
import { NeuralButton }     from '@/components/ui/NeuralButton';

const { width: W } = Dimensions.get('window');

const EXERCISES = [
  {
    id: 'breathing',
    title: 'Box Breathing',
    subtitle: '4-4-4-4 pattern',
    iconName: 'cloudy-outline' as const,
    color: Colors.primary,
    duration: '4 min',
    benefit: 'Reduces cortisol and activates calm',
    steps: ['Inhale 4s', 'Hold 4s', 'Exhale 4s', 'Hold 4s'],
  },
  {
    id: 'eyes',
    title: '20-20-20 Eye Rule',
    subtitle: 'Reduce digital eye strain',
    iconName: 'eye-outline' as const,
    color: Colors.positive,
    duration: '2 min',
    benefit: 'Reduces eye fatigue and improves focus',
    steps: ['Look 20ft away', 'Hold for 20s', 'Blink slowly', 'Repeat 6x'],
  },
  {
    id: 'stretch',
    title: 'Desk Stretch',
    subtitle: 'Posture realignment',
    iconName: 'body-outline' as const,
    color: Colors.warning,
    duration: '5 min',
    benefit: 'Relieves tension and improves circulation',
    steps: ['Neck rolls', 'Shoulder stretch', 'Back arch', 'Wrist flexor'],
  },
  {
    id: 'mindful',
    title: 'Mindfulness Burst',
    subtitle: 'Cognitive reset',
    iconName: 'flower-outline' as const,
    color: Colors.secondary,
    duration: '3 min',
    benefit: 'Clears mental clutter and restores attention',
    steps: ['Close eyes', 'Notice 5 sounds', 'Feel your breath', 'Set intention'],
  },
];

type BreathPhase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

function BreathingExercise({ onDone }: { onDone: () => void }) {
  const [phase, setPhase]   = useState<BreathPhase>('inhale');
  const [count, setCount]   = useState(4);
  const [cycle, setCycle]   = useState(0);
  const TOTAL_CYCLES         = 4;

  const scale   = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  const PHASES: BreathPhase[] = ['inhale', 'hold-in', 'exhale', 'hold-out'];
  const PHASE_LABELS: Record<BreathPhase, string> = {
    'inhale':   'Inhale',
    'hold-in':  'Hold',
    'exhale':   'Exhale',
    'hold-out': 'Hold',
  };
  const PHASE_COLORS: Record<BreathPhase, string> = {
    'inhale':   Colors.primary,
    'hold-in':  Colors.positive,
    'exhale':   Colors.secondary,
    'hold-out': Colors.warning,
  };

  useEffect(() => {
    if (phase === 'inhale') {
      scale.value   = withTiming(1.5, { duration: 4000, easing: Easing.inOut(Easing.sin) });
      opacity.value = withTiming(1, { duration: 4000 });
    } else if (phase === 'exhale') {
      scale.value   = withTiming(1.0, { duration: 4000, easing: Easing.inOut(Easing.sin) });
      opacity.value = withTiming(0.5, { duration: 4000 });
    }

    let countdown = 4;
    setCount(countdown);
    const interval = setInterval(() => {
      countdown -= 1;
      setCount(countdown);
      if (countdown <= 0) {
        clearInterval(interval);
        const currentPhaseIdx = PHASES.indexOf(phase);
        const nextPhase = PHASES[(currentPhaseIdx + 1) % 4] as BreathPhase;
        if (nextPhase === 'inhale') {
          const nextCycle = cycle + 1;
          if (nextCycle >= TOTAL_CYCLES) {
            onDone();
            return;
          }
          setCycle(nextCycle);
        }
        setPhase(nextPhase);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity:   opacity.value,
  }));

  const currentColor = PHASE_COLORS[phase];

  return (
    <View style={breath.container}>
      <Text style={[Typography.caption, { color: Colors.textMuted }]}>
        CYCLE {cycle + 1} OF {TOTAL_CYCLES}
      </Text>

      <View style={breath.ringWrap}>
        <Animated.View style={[breath.outerRing, { borderColor: currentColor }, circleStyle]} />
        <View style={[breath.innerCircle, { backgroundColor: `${currentColor}10` }]}>
          <Text style={[Typography.metric, { color: currentColor }]}>{count}</Text>
          <Text style={[Typography.label, { color: currentColor }]}>{PHASE_LABELS[phase]}</Text>
        </View>
      </View>

      <NeuralButton title="End Early" onPress={onDone} variant="ghost" style={{ marginTop: 32 }} />
    </View>
  );
}

export default function RecoveryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);

  const handleStart = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActiveExercise(id);
  };

  const handleDone = (id: string) => {
    setActiveExercise(null);
    setCompleted((prev) => [...prev, id]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  if (activeExercise === 'breathing') {
    return (
      <View style={styles.root}>
        <BreathingExercise onDone={() => handleDone('breathing')} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 12 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={[Typography.h1, { marginBottom: 4 }]}>Recovery</Text>
        <Text style={[Typography.body, { color: Colors.textMuted, marginBottom: 24 }]}>
          Micro-breaks that restore your energy
        </Text>

        {/* Recovery progress */}
        <GlassCard variant="success" style={styles.progressCard}>
          <Text style={[Typography.caption, { color: Colors.positive, marginBottom: 8 }]}>
            TODAY'S RECOVERY
          </Text>
          <View style={styles.progressRow}>
            <Text style={[Typography.metricSm, { color: Colors.positive }]}>
              {completed.length}/{EXERCISES.length}
            </Text>
            <Text style={[Typography.body, { color: Colors.textMuted, marginLeft: 8 }]}>
              exercises complete
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(completed.length / EXERCISES.length) * 100}%` },
              ]}
            />
          </View>
        </GlassCard>

        {/* Exercise cards */}
        <Text style={[Typography.caption, styles.sectionLabel]}>RECOVERY EXERCISES</Text>
        {EXERCISES.map((ex) => {
          const isDone = completed.includes(ex.id);
          return (
            <TouchableOpacity
              key={ex.id}
              onPress={() => !isDone && handleStart(ex.id)}
              activeOpacity={0.85}
              style={styles.exerciseCard}
            >
              <GlassCard padding={16}>
                <View style={styles.exerciseRow}>
                  <View style={[styles.exIcon, { backgroundColor: isDone ? `${Colors.positive}10` : `${ex.color}10` }]}>
                    <Ionicons
                      name={isDone ? 'checkmark' : ex.iconName}
                      size={22}
                      color={isDone ? Colors.positive : ex.color}
                    />
                  </View>

                  <View style={styles.exText}>
                    <View style={styles.exTitleRow}>
                      <Text style={[Typography.h4]}>{ex.title}</Text>
                      {isDone && (
                        <View style={styles.doneBadge}>
                          <Text style={{ fontSize: 11, fontWeight: '600', color: Colors.positive }}>Done</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[Typography.bodySmall, { color: Colors.textMuted, marginTop: 2 }]}>
                      {ex.benefit}
                    </Text>
                  </View>

                  <View style={styles.exMeta}>
                    <Text style={[Typography.bodySmall, { color: ex.color, fontWeight: '600' }]}>{ex.duration}</Text>
                  </View>
                </View>

                <View style={styles.stepsRow}>
                  {ex.steps.map((s, i) => (
                    <View key={i} style={[styles.stepPill, { backgroundColor: `${ex.color}08` }]}>
                      <Text style={{ fontSize: 11, color: Colors.textMuted }}>{s}</Text>
                    </View>
                  ))}
                </View>
              </GlassCard>
            </TouchableOpacity>
          );
        })}

        {/* Dopamine detox shortcut */}
        <TouchableOpacity onPress={() => router.push('/screens/dopamine-detox')} activeOpacity={0.85}>
          <GlassCard variant="secondary" style={styles.detoxBanner}>
            <View style={styles.detoxRow}>
              <View style={styles.detoxIcon}>
                <Ionicons name="phone-portrait-outline" size={22} color={Colors.secondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.h4]}>Dopamine Detox</Text>
                <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>
                  Temporary social media restrictions for deep recovery
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </View>
          </GlassCard>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg },
  progressCard: { marginBottom: 12 },
  progressRow:  { flexDirection: 'row', alignItems: 'baseline' },
  progressBar:  { height: 6, backgroundColor: Colors.backgroundAlt, borderRadius: 3, marginTop: 12, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.positive, borderRadius: 3 },
  sectionLabel: { color: Colors.textMuted, marginTop: 20, marginBottom: 12 },
  exerciseCard: { marginBottom: 12 },
  exerciseRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  exIcon: {
    width:         48,
    height:        48,
    borderRadius:  14,
    alignItems:    'center',
    justifyContent: 'center',
    flexShrink:    0,
  },
  exText:     { flex: 1 },
  exTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  exMeta:     { alignItems: 'center' },
  doneBadge: {
    paddingHorizontal: 8,
    paddingVertical:   2,
    borderRadius:      Radius.full,
    backgroundColor:   `${Colors.positive}10`,
  },
  stepsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  stepPill: {
    borderRadius:    Radius.full,
    paddingHorizontal: 10,
    paddingVertical:   4,
  },
  detoxBanner: { marginTop: 8 },
  detoxRow:    { flexDirection: 'row', alignItems: 'center', gap: 14 },
  detoxIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${Colors.secondary}10`,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const breath = StyleSheet.create({
  container: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: Colors.background,
  },
  ringWrap: {
    width:          220,
    height:         220,
    alignItems:     'center',
    justifyContent: 'center',
    marginTop:      40,
    marginBottom:   16,
    position:       'relative',
  },
  outerRing: {
    position:     'absolute',
    width:        220,
    height:       220,
    borderRadius: 110,
    borderWidth:  2,
  },
  innerCircle: {
    width:          130,
    height:         130,
    borderRadius:   65,
    alignItems:     'center',
    justifyContent: 'center',
  },
});
