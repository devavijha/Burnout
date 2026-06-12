import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Alert,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/theme';
import { NeuralBackground } from '@/components/ui/NeuralBackground';
import { GlassCard }        from '@/components/ui/GlassCard';
import { NeuralButton }     from '@/components/ui/NeuralButton';
import { useAuthStore }     from '@/store/authStore';

const { width: W, height: H } = Dimensions.get('window');

export default function LogoutScreen() {
  const router  = useRouter();
  const { logout, user } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const scaleV = useSharedValue(1);

  React.useEffect(() => {
    scaleV.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.0,  { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      ), -1, false,
    );
  }, []);

  const iconStyle  = useAnimatedStyle(() => ({ transform: [{ scale: scaleV.value }] }));

  const handleLogout = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Sign Out?',
      'Your recovery progress and data are safely stored. See you on the other side.',
      [
        { text: 'Stay Connected', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            await new Promise((r) => setTimeout(r, 500));
            await logout();
            router.replace('/auth/welcome');
          },
        },
      ],
    );
  };

  return (
    <View style={styles.root}>
      <NeuralBackground intensity="medium" />

      <View style={styles.container}>
        {/* Animated icon */}
        <Animated.View style={[styles.iconWrap, iconStyle]}>
          <View style={styles.iconCircle}>
            <Ionicons name="power-outline" size={56} color={Colors.danger} />
          </View>
        </Animated.View>

        <Text style={[Typography.h1, styles.title]}>
          Disconnect Neural Link?
        </Text>
        <Text style={[Typography.body, styles.subtitle]}>
          Signing out will pause your recovery tracking. Your progress, ecosystem, and achievements are safely preserved.
        </Text>

        {/* Session stats */}
        <GlassCard variant="danger" style={styles.statsCard} padding={16}>
          <Text style={[Typography.caption, { color: Colors.danger, marginBottom: 10 }]}>
            YOUR CURRENT SESSION
          </Text>
          <View style={styles.statsRow}>
            {[
              { label: 'XP Earned',    value: `${user?.xp ?? 0}` },
              { label: 'Level',        value: `${user?.level ?? 1}` },
              { label: 'Streak',       value: `${user?.streak ?? 0} days` },
            ].map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Text style={[Typography.metricSm, { color: Colors.textPrimary }]}>{s.value}</Text>
                <Text style={[Typography.caption, { color: Colors.textMuted }]}>{s.label}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Buttons */}
        <View style={styles.btnStack}>
          <NeuralButton
            title="Sign Out"
            onPress={handleLogout}
            variant="danger"
            loading={isLoggingOut}
          />
          <NeuralButton
            title="Stay Connected"
            onPress={() => router.back()}
            variant="ghost"
          />
        </View>

        <Text style={[Typography.bodySmall, { color: Colors.textMuted, textAlign: 'center', marginTop: 24 }]}>
          Version 1.0.0 · Neural Edition · ResetOS
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: {
    flex:    1,
    alignItems:     'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom:  40,
  },
  iconWrap:  { marginBottom: 28 },
  iconCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: Colors.glowDanger,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.danger + '30',
  },
  title:     { textAlign: 'center', marginBottom: 14 },
  subtitle: {
    textAlign: 'center', color: Colors.textMuted,
    marginBottom: 28, maxWidth: 300,
  },
  statsCard: { width: '100%', marginBottom: 32 },
  statsRow:  { flexDirection: 'row', justifyContent: 'space-around' },
  statItem:  { alignItems: 'center', gap: 4 },
  btnStack:  { width: '100%', gap: 12 },
});
