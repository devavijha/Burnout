import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/theme';
import { NeuralBackground } from '@/components/ui/NeuralBackground';
import { NeuralButton }     from '@/components/ui/NeuralButton';
import { GlassCard }        from '@/components/ui/GlassCard';
import { useAuthStore }     from '@/store/authStore';

const { width: W } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'sparkles-outline' as const,
    title: 'Your Brain Has Limits',
    body: 'Digital overload silently erodes focus, creativity, and emotional resilience. ResetOS monitors the signals you miss.',
    color: Colors.primary,
  },
  {
    id: '2',
    icon: 'bar-chart-outline' as const,
    title: 'AI Burnout Detection',
    body: 'Our neural engine analyzes screen time patterns, late-night usage, and app switching to calculate your real-time Burnout Score.',
    color: Colors.secondary,
  },
  {
    id: '3',
    icon: 'flash-outline' as const,
    title: 'Focus Like a Machine',
    body: 'Deep work sessions with ambient sound, app blocking, and focus animations to keep you in the zone.',
    color: Colors.positive,
  },
  {
    id: '4',
    icon: 'leaf-outline' as const,
    title: 'Grow Your Neural Ecosystem',
    body: 'Every healthy habit grows your virtual neural garden. Watch your digital wellbeing come alive.',
    color: Colors.warning,
  },
  {
    id: '5',
    icon: 'compass-outline' as const,
    title: "What's Your Role?",
    body: 'Tell us about yourself so our AI can personalize your recovery plan.',
    color: Colors.primary,
    isRoleSelect: true,
  },
];

const ROLES = [
  { id: 'student',       label: 'Student',       icon: 'book-outline' as const },
  { id: 'developer',     label: 'Developer',     icon: 'laptop-outline' as const },
  { id: 'remote-worker', label: 'Remote Worker', icon: 'home-outline' as const },
  { id: 'creator',       label: 'Creator',       icon: 'color-palette-outline' as const },
  { id: 'other',         label: 'Other',         icon: 'star-outline' as const },
];

export default function OnboardingScreen() {
  const router             = useRouter();
  const { updateUser, setOnboarded } = useAuthStore();
  const scrollRef          = useRef<ScrollView>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const scrollX            = useSharedValue(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    scrollX.value = x;
    setCurrentSlide(Math.round(x / W));
  };

  const goNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: (currentSlide + 1) * W, animated: true });
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    if (selectedRole) updateUser({ role: selectedRole as any });
    setOnboarded(true);
    router.replace('/auth/assessment');
  };

  const isLast = currentSlide === SLIDES.length - 1;

  return (
    <View style={styles.root}>
      <NeuralBackground intensity="low" />

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.flex}
      >
        {SLIDES.map((slide, i) => (
          <View key={slide.id} style={[styles.slide]}>
            {/* Icon disc */}
            <View style={[styles.iconDisc, { backgroundColor: `${slide.color}22`, borderColor: slide.color }]}>
              <Ionicons name={slide.icon as any} size={48} color={slide.color} />
            </View>

            <Text style={[Typography.h1, styles.slideTitle]}>{slide.title}</Text>
            <Text style={[Typography.bodyLarge, styles.slideBody]}>{slide.body}</Text>

            {/* Role selector on last slide */}
            {slide.isRoleSelect && (
              <View style={styles.roleGrid}>
                {ROLES.map((r) => (
                  <TouchableOpacity
                    key={r.id}
                    onPress={() => setSelectedRole(r.id)}
                    style={[
                      styles.roleBtn,
                      selectedRole === r.id && { borderColor: Colors.primary, backgroundColor: Colors.glowCyan },
                    ]}
                  >
                    <Ionicons name={r.icon as any} size={28} color={selectedRole === r.id ? Colors.primary : Colors.textSecondary} />
                    <Text style={[Typography.label, { color: selectedRole === r.id ? Colors.primary : Colors.textSecondary }]}>
                      {r.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Bottom controls */}
      <View style={styles.bottom}>
        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentSlide && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.btnRow}>
          {currentSlide > 0 && (
            <TouchableOpacity
              onPress={() => scrollRef.current?.scrollTo({ x: (currentSlide - 1) * W, animated: true })}
              style={styles.skipBtn}
            >
              <Text style={[Typography.label, { color: Colors.textMuted }]}>Back</Text>
            </TouchableOpacity>
          )}

          <View style={styles.nextWrap}>
            <NeuralButton
              title={isLast ? (selectedRole ? 'Begin Assessment' : 'Select a Role') : 'Next'}
              onPress={goNext}
              disabled={isLast && !selectedRole}
              style={{ flex: 1 }}
            />
          </View>
        </View>

        {!isLast && (
          <TouchableOpacity onPress={handleFinish} style={styles.skipLink}>
            <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>Skip introduction</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:  { flex: 1, backgroundColor: Colors.background },
  flex:  { flex: 1 },
  slide: {
    width:          W,
    paddingHorizontal: Spacing.xl,
    paddingTop:     80,
    alignItems:     'center',
  },
  iconDisc: {
    width:        120,
    height:       120,
    borderRadius: 60,
    borderWidth:  1.5,
    alignItems:   'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  slideTitle: { textAlign: 'center', marginBottom: 16 },
  slideBody:  { textAlign: 'center', color: Colors.textMuted, maxWidth: 300 },
  roleGrid: {
    flexDirection: 'row',
    flexWrap:     'wrap',
    justifyContent: 'center',
    gap:          10,
    marginTop:    28,
  },
  roleBtn: {
    width:            130,
    paddingVertical:  14,
    gap:              6,
    alignItems:       'center',
    borderRadius:     Radius.lg,
    borderWidth:      1,
    borderColor:      Colors.borderSubtle,
    backgroundColor:  Colors.surface,
  },
  bottom: {
    paddingHorizontal: Spacing.xl,
    paddingBottom:     40,
    gap:               16,
  },
  dots: {
    flexDirection:  'row',
    justifyContent: 'center',
    gap:            6,
    marginBottom:   8,
  },
  dot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.borderSubtle },
  dotActive: { width: 20, backgroundColor: Colors.primary },
  btnRow:    { flexDirection: 'row', gap: 12, alignItems: 'center' },
  skipBtn: {
    paddingHorizontal: 16,
    height:            48,
    justifyContent:    'center',
  },
  nextWrap:  { flex: 1 },
  skipLink:  { alignItems: 'center' },
});
