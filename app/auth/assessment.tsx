import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/theme';
import { NeuralBackground } from '@/components/ui/NeuralBackground';
import { NeuralButton }     from '@/components/ui/NeuralButton';
import { GlassCard }        from '@/components/ui/GlassCard';
import { EnergyRing }       from '@/components/ui/EnergyRing';
import { useBurnoutStore }  from '@/store/burnoutStore';
import { useAuthStore }     from '@/store/authStore';
import { XP_REWARDS }       from '@/constants/config';

const { width: W } = Dimensions.get('window');

const QUESTIONS = [
  {
    id: 'q1',
    text: 'How many hours do you spend on screens daily (outside work)?',
    dimension: 'screenTime',
    options: [
      { label: '< 2 hours',  value: 10 },
      { label: '2–4 hours',  value: 35 },
      { label: '4–6 hours',  value: 60 },
      { label: '6–8 hours',  value: 80 },
      { label: '8+ hours',   value: 100 },
    ],
  },
  {
    id: 'q2',
    text: 'How often do you check your phone against your will?',
    dimension: 'compulsion',
    options: [
      { label: 'Rarely',          value: 5  },
      { label: 'A few times/day', value: 25 },
      { label: 'Every hour',      value: 55 },
      { label: 'Every 30 mins',   value: 75 },
      { label: 'Constantly',      value: 100 },
    ],
  },
  {
    id: 'q3',
    text: 'How do you feel after a long day of screen use?',
    dimension: 'mentalFatigue',
    options: [
      { label: 'Energized',     value: 5  },
      { label: 'Fine',          value: 20 },
      { label: 'Slightly tired', value: 45 },
      { label: 'Mentally drained', value: 70 },
      { label: 'Exhausted',     value: 95 },
    ],
  },
  {
    id: 'q4',
    text: 'How often do you use screens after 10pm?',
    dimension: 'lateNight',
    options: [
      { label: 'Never',         value: 0  },
      { label: 'Occasionally',  value: 20 },
      { label: '2–3× per week', value: 45 },
      { label: 'Most nights',   value: 70 },
      { label: 'Every night',   value: 100 },
    ],
  },
  {
    id: 'q5',
    text: 'Can you focus on a single task for 25+ minutes uninterrupted?',
    dimension: 'focusCapacity',
    options: [
      { label: 'Yes, easily',       value: 5  },
      { label: 'Usually',           value: 20 },
      { label: 'With effort',       value: 50 },
      { label: 'Rarely',            value: 75 },
      { label: 'Almost impossible', value: 100 },
    ],
  },
  {
    id: 'q6',
    text: 'How many app/tab switches do you make per hour when working?',
    dimension: 'appSwitching',
    options: [
      { label: '< 5 switches',  value: 10 },
      { label: '5–15 switches', value: 35 },
      { label: '15–30 switches', value: 60 },
      { label: '30–50 switches', value: 80 },
      { label: '50+',           value: 100 },
    ],
  },
];

export default function AssessmentScreen() {
  const router  = useRouter();
  const { setScore, setDimensions } = useBurnoutStore();
  const { addXP } = useAuthStore();

  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const progress = useSharedValue(0);

  const handleAnswer = (value: number) => {
    const q       = QUESTIONS[step];
    const newAnswers = { ...answers, [q.dimension]: value };
    setAnswers(newAnswers);

    const nextStep  = step + 1;
    progress.value  = withTiming(nextStep / QUESTIONS.length, { duration: 400 });

    if (nextStep >= QUESTIONS.length) {
      // Calculate burnout score
      const raw    = Object.values(newAnswers);
      const score  = Math.round(raw.reduce((a, b) => a + b, 0) / raw.length);

      const dims = QUESTIONS.map((q) => ({
        label:  q.dimension,
        value:  newAnswers[q.dimension] ?? 0,
        weight: 1 / QUESTIONS.length,
      }));

      setScore(score);
      setDimensions(dims);
      setFinalScore(score);
      addXP(XP_REWARDS.assessmentComplete);
      setShowResult(true);
    } else {
      setStep(nextStep);
    }
  };

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%` as any,
  }));

  if (showResult) {
    return (
      <View style={styles.root}>
        <NeuralBackground intensity="high" />
        <ScrollView contentContainerStyle={styles.resultScroll}>
          <Text style={[Typography.caption, { color: Colors.textMuted, marginBottom: 12, marginTop: 16 }]}>
            INITIAL ASSESSMENT COMPLETE
          </Text>
          <Text style={[Typography.h1, { textAlign: 'center', marginBottom: 32 }]}>
            Your Burnout Score
          </Text>

          <EnergyRing
            value={finalScore}
            size={220}
            label="BURNOUT RISK"
            sublabel="initial scan"
            animate
          />

          <GlassCard style={{ marginTop: 32, width: W - Spacing.xl * 2 }} variant="primary">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Ionicons
                name="ellipse"
                size={14}
                color={
                  finalScore <= 30 ? Colors.positive :
                  finalScore <= 60 ? Colors.warning :
                  finalScore <= 80 ? Colors.energy : Colors.danger
                }
              />
              <Text style={[Typography.h3]}>
                {finalScore <= 30 ? 'Optimal Brain State' :
                 finalScore <= 60 ? 'Moderate Digital Fatigue' :
                 finalScore <= 80 ? 'High Burnout Risk' : 'Critical — Reset Needed'}
              </Text>
            </View>
            <Text style={[Typography.body, { color: Colors.textMuted }]}>
              {finalScore <= 30
                ? "Your digital habits are healthy. ResetOS will help you maintain this state."
                : finalScore <= 60
                ? "You're showing signs of digital fatigue. Let's build better recovery habits."
                : finalScore <= 80
                ? "Your brain is under significant digital stress. Immediate recovery protocol recommended."
                : "Critical burnout detected. ResetOS has prepared an emergency recovery plan for you."}
            </Text>
          </GlassCard>

          <View style={{ width: W - Spacing.xl * 2, marginTop: 24, gap: 10 }}>
            {QUESTIONS.map((q) => (
              <View key={q.id} style={styles.dimRow}>
                <Text style={[Typography.label, { color: Colors.textSecondary, flex: 1 }]}>
                  {q.dimension.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                </Text>
                <View style={styles.dimBar}>
                  <View
                    style={[
                      styles.dimFill,
                      {
                        width: `${answers[q.dimension] ?? 0}%`,
                        backgroundColor:
                          (answers[q.dimension] ?? 0) > 70 ? Colors.danger :
                          (answers[q.dimension] ?? 0) > 45 ? Colors.warning : Colors.positive,
                      },
                    ]}
                  />
                </View>
                <Text style={[Typography.label, { color: Colors.primary, width: 32, textAlign: 'right' }]}>
                  {answers[q.dimension] ?? 0}
                </Text>
              </View>
            ))}
          </View>

          <NeuralButton
            title="Enter ResetOS"
            onPress={() => router.replace('/auth/permissions')}
            style={[{ width: W - Spacing.xl * 2, marginTop: 32, marginBottom: 40 }]}
          />
        </ScrollView>
      </View>
    );
  }

  const q = QUESTIONS[step];

  return (
    <View style={styles.root}>
      <NeuralBackground intensity="low" />

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, progressStyle]} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 20, marginBottom: 8 }]}>
          QUESTION {step + 1} OF {QUESTIONS.length}
        </Text>

        <Text style={[Typography.h2, { marginBottom: 8 }]}>Burnout Assessment</Text>
        <Text style={[Typography.body, { color: Colors.textMuted, marginBottom: 40 }]}>
          Honest answers lead to accurate results
        </Text>

        <GlassCard variant="primary" style={{ marginBottom: 32 }}>
          <Text style={[Typography.h3, { color: Colors.textPrimary }]}>{q.text}</Text>
        </GlassCard>

        <View style={styles.options}>
          {q.options.map((opt, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => handleAnswer(opt.value)}
              style={styles.optionBtn}
            >
              <View style={[styles.optionDot, { backgroundColor: Colors.glowCyan, borderColor: Colors.primary }]} />
              <Text style={[Typography.bodyLarge, { color: Colors.textPrimary, flex: 1 }]}>{opt.label}</Text>
              <View
                style={[
                  styles.severity,
                  {
                    backgroundColor:
                      opt.value > 70 ? Colors.glowDanger :
                      opt.value > 40 ? 'rgba(240, 169, 73, 0.10)' : Colors.glowGreen,
                  },
                ]}
              >
                <View
                  style={[
                    styles.severityDot,
                    {
                      backgroundColor:
                        opt.value > 70 ? Colors.danger :
                        opt.value > 40 ? Colors.warning : Colors.positive,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:          { flex: 1, backgroundColor: Colors.background },
  progressTrack: { height: 3, backgroundColor: Colors.backgroundAlt },
  progressFill:  { height: 3, backgroundColor: Colors.primary, borderRadius: 2 },
  scroll: {
    padding:    Spacing.xl,
    paddingTop: 16,
    paddingBottom: 60,
    alignItems: 'center',
  },
  resultScroll: {
    padding:    Spacing.xl,
    alignItems: 'center',
  },
  options: { width: '100%', gap: 12 },
  optionBtn: {
    flexDirection:   'row',
    alignItems:      'center',
    padding:         16,
    borderRadius:    Radius.lg,
    borderWidth:     1,
    borderColor:     Colors.borderSubtle,
    backgroundColor: Colors.surface,
    overflow:        'hidden',
    gap:             12,
  },
  optionDot:   { width: 8, height: 8, borderRadius: 4, borderWidth: 1.5 },
  severity:    { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  severityDot: { width: 10, height: 10, borderRadius: 5 },
  dimRow:      { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  dimBar:      { flex: 1, height: 4, backgroundColor: Colors.backgroundAlt, borderRadius: 2, overflow: 'hidden' },
  dimFill:     { height: '100%', borderRadius: 2 },
});
