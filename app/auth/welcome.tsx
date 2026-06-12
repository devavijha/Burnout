import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/theme';
import { NeuralBackground } from '@/components/ui/NeuralBackground';
import { NeuralButton }     from '@/components/ui/NeuralButton';
import { PulseRing }        from '@/components/ui/PulseRing';
import { useAuthStore }     from '@/store/authStore';

const { width: W, height: H } = Dimensions.get('window');

type Mode = 'landing' | 'login' | 'register';

export default function WelcomeScreen() {
  const router  = useRouter();
  const { setUser, setToken } = useAuthStore();

  const [mode, setMode]         = useState<Mode>('landing');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [loading, setLoading]   = useState(false);

  // Entrance animations
  const heroOpacity = useSharedValue(0);
  const heroY       = useSharedValue(30);
  const taglineOp   = useSharedValue(0);
  const btnOp       = useSharedValue(0);
  const ringScale   = useSharedValue(0.6);

  useEffect(() => {
    heroOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    heroY.value       = withDelay(300, withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) }));
    taglineOp.value   = withDelay(700, withTiming(1, { duration: 600 }));
    btnOp.value       = withDelay(1000, withTiming(1, { duration: 600 }));
    ringScale.value   = withDelay(200, withTiming(1, { duration: 900, easing: Easing.out(Easing.back(1.2)) }));
  }, []);

  const heroStyle  = useAnimatedStyle(() => ({ opacity: heroOpacity.value, transform: [{ translateY: heroY.value }] }));
  const tagStyle   = useAnimatedStyle(() => ({ opacity: taglineOp.value }));
  const btnStyle   = useAnimatedStyle(() => ({ opacity: btnOp.value }));
  const ringStyle  = useAnimatedStyle(() => ({ transform: [{ scale: ringScale.value }] }));

  const handleAuth = async () => {
    setLoading(true);
    try {
      // Demo: bypass real auth for prototype
      await new Promise((r) => setTimeout(r, 800));
      setToken('demo-token-123');
      setUser({
        id:             'demo-user',
        email:          email || 'user@resetos.app',
        displayName:    name  || 'Neural User',
        role:           'developer',
        timezone:       Intl.DateTimeFormat().resolvedOptions().timeZone,
        joinedAt:       new Date().toISOString(),
        xp:             0,
        level:          1,
        streak:         0,
        longestStreak:  0,
        achievements:   [],
        theme:          'neural',
        accentColor:    Colors.primary,
        notificationsEnabled: true,
        soundEnabled:   true,
      });
      router.replace('/auth/onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <NeuralBackground intensity="medium" />

      {/* Soft top accent */}
      <View style={styles.topGlow} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero ring + logo */}
          <Animated.View style={[styles.heroSection, ringStyle]}>
            <PulseRing size={140} color={Colors.primary} rings={3} speed="slow">
              <View style={styles.logoInner}>
                <Ionicons name="flash-outline" size={36} color={Colors.primary} />
              </View>
            </PulseRing>
          </Animated.View>

          {/* Title */}
          <Animated.View style={[styles.titleBlock, heroStyle]}>
            <Text style={styles.appName}>ResetOS</Text>
            <View style={styles.tagContainer}>
              <Text style={styles.tagVersion}>v1.0 — Neural Edition</Text>
            </View>
          </Animated.View>

          {/* Tagline */}
          <Animated.View style={tagStyle}>
            <Text style={styles.tagline}>
              Reboot your mind.{'\n'}
              <Text style={{ color: Colors.primary }}>Reclaim your focus.</Text>
            </Text>
            <Text style={styles.subtitle}>
              AI-powered digital burnout recovery for the hyper-connected generation.
            </Text>
          </Animated.View>

          {/* Mode selector */}
          {mode !== 'landing' && (
            <View style={styles.modeRow}>
              <TouchableOpacity onPress={() => setMode('login')}>
                <Text style={[styles.modeTab, mode === 'login' && styles.modeTabActive]}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMode('register')}>
                <Text style={[styles.modeTab, mode === 'register' && styles.modeTabActive]}>Create Account</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Form */}
          {mode !== 'landing' && (
            <View style={styles.form}>
              {mode === 'register' && (
                <TextInput
                  style={styles.input}
                  placeholder="Your name"
                  placeholderTextColor={Colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              )}
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <NeuralButton
                title={mode === 'login' ? 'Enter ResetOS' : 'Begin Recovery Journey'}
                onPress={handleAuth}
                loading={loading}
                style={{ marginTop: 8 }}
              />
              <TouchableOpacity onPress={() => setMode('landing')} style={{ marginTop: 16, alignItems: 'center' }}>
                <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>← Back</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* CTA buttons */}
          {mode === 'landing' && (
            <Animated.View style={[styles.ctaBlock, btnStyle]}>
              <NeuralButton
                title="Initialize System"
                onPress={() => setMode('register')}
                variant="primary"
              />
              <NeuralButton
                title="Resume Session"
                onPress={() => setMode('login')}
                variant="ghost"
                style={{ marginTop: 12 }}
              />

              {/* Stats strip */}
              <View style={styles.statsRow}>
                {[['10K+', 'Users'], ['94%', 'Recovery Rate'], ['4.9★', 'Rating']].map(([val, lbl]) => (
                  <View key={lbl} style={styles.statItem}>
                    <Text style={[Typography.h4, { color: Colors.primary }]}>{val}</Text>
                    <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>{lbl}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:  { flex: 1, backgroundColor: Colors.background },
  flex:  { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 48,
    alignItems: 'center',
  },
  topGlow: {
    position:  'absolute',
    top:       -100,
    left:      W * 0.1,
    right:     W * 0.1,
    height:    300,
    borderRadius: 200,
    backgroundColor: Colors.glowCyan,
    opacity:   1,
  },
  heroSection: {
    marginTop:    80,
    marginBottom: 32,
    alignItems:   'center',
  },
  logoInner: {
    width:           80,
    height:          80,
    borderRadius:    40,
    backgroundColor: Colors.glowCyan,
    alignItems:      'center',
    justifyContent:  'center',
  },
  titleBlock: { alignItems: 'center', marginBottom: 20 },
  appName: {
    fontSize:     56,
    fontWeight:   '900',
    letterSpacing: -3,
    color:        Colors.textPrimary,
  },
  tagContainer: {
    backgroundColor: Colors.glowCyan,
    borderWidth:  1,
    borderColor:  Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical:   4,
    marginTop:    8,
  },
  tagVersion: {
    fontSize:   11,
    fontWeight: '600',
    color:      Colors.primary,
    letterSpacing: 1,
  },
  tagline: {
    fontSize:   26,
    fontWeight: '700',
    color:      Colors.textPrimary,
    textAlign:  'center',
    lineHeight: 34,
    marginBottom: 12,
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    color:     Colors.textMuted,
    maxWidth:  280,
    alignSelf: 'center',
    marginBottom: 40,
  },
  ctaBlock: { width: '100%', alignItems: 'stretch' },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop:  28,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  statItem: { alignItems: 'center', gap: 4 },
  modeRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 20,
    marginTop: -20,
  },
  modeTab: {
    ...Typography.label,
    color: Colors.textMuted,
    paddingBottom: 4,
  },
  modeTabActive: {
    color: Colors.primary,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  form: { width: '100%', gap: 12 },
  input: {
    height:           52,
    backgroundColor:  Colors.surface,
    borderRadius:     Radius.md,
    borderWidth:      1,
    borderColor:      Colors.borderSubtle,
    paddingHorizontal: Spacing.md,
    color:            Colors.textPrimary,
    fontSize:         15,
  },
});
