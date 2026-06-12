import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { EnergyRing }       from '@/components/ui/EnergyRing';
import { GlassCard }        from '@/components/ui/GlassCard';
import { MetricCard }       from '@/components/ui/MetricCard';
import { NeuralButton }     from '@/components/ui/NeuralButton';
import { useBurnoutStore }  from '@/store/burnoutStore';
import { useAuthStore }     from '@/store/authStore';
import { useFocusStore }    from '@/store/focusStore';
import { useAppStore }      from '@/store/appStore';
import { useBurnoutScore }  from '@/hooks/useBurnoutScore';

const { width: W } = Dimensions.get('window');

function QuickActionBtn({
  iconName, label, color, onPress,
}: { iconName: keyof typeof Ionicons.glyphMap; label: string; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.qaBtn} activeOpacity={0.7}>
      <View style={[styles.qaIcon, { backgroundColor: `${color}10` }]}>
        <Ionicons name={iconName} size={20} color={color} />
      </View>
      <Text style={[Typography.bodySmall, { color: Colors.textMuted, marginTop: 6, textAlign: 'center', fontSize: 11 }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function DashboardScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { score, delta, level, color, trend, dimensions } = useBurnoutScore();
  const { totalFocusToday, streakDays } = useFocusStore();
  const { sleepHours, sleepQuality } = useAppStore();

  const [refreshing, setRefreshing] = React.useState(false);

  const headerOp  = useSharedValue(0);
  const ringOp    = useSharedValue(0);
  const cardsOp   = useSharedValue(0);

  useEffect(() => {
    headerOp.value = withTiming(1, { duration: 500 });
    ringOp.value   = withDelay(150, withTiming(1, { duration: 500 }));
    cardsOp.value  = withDelay(300, withTiming(1, { duration: 500 }));
  }, []);

  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOp.value, transform: [{ translateY: (1 - headerOp.value) * 10 }] }));
  const ringStyle   = useAnimatedStyle(() => ({ opacity: ringOp.value, transform: [{ translateY: (1 - ringOp.value) * 10 }] }));
  const cardsStyle  = useAnimatedStyle(() => ({ opacity: cardsOp.value, transform: [{ translateY: (1 - cardsOp.value) * 10 }] }));

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setRefreshing(false);
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const aiInsight = score > 70
    ? "High stress detected. Consider a 5-min breathing break before your next task."
    : score > 40
    ? "You're in moderate fatigue. A short focus session could boost your productivity."
    : "Your state is optimal. Great time for deep work.";

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 8 }]}
      >
        {/* Header */}
        <Animated.View style={[styles.header, headerStyle]}>
          <View>
            <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>{getGreeting()},</Text>
            <Text style={[Typography.h1, { marginTop: 2 }]}>
              {user?.displayName?.split(' ')[0] ?? 'User'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => router.push('/screens/notifications')}
              style={styles.notifBtn}
            >
              <Ionicons name="notifications-outline" size={22} color={Colors.textSecondary} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/tabs/profile')}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={18} color={Colors.primary} />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Wellbeing Score Ring */}
        <Animated.View style={[styles.ringSection, ringStyle]}>
          <EnergyRing
            value={score}
            size={200}
            label="WELLBEING SCORE"
            sublabel={level}
            animate
          />

          <View style={[styles.trendPill, { backgroundColor: `${color}10`, borderColor: `${color}25` }]}>
            <Ionicons
              name={trend === 'improving' ? 'trending-down' : trend === 'worsening' ? 'trending-up' : 'remove'}
              size={14}
              color={color}
            />
            <Text style={[Typography.bodySmall, { color, marginLeft: 4, fontWeight: '600' }]}>
              {trend === 'improving' ? 'Improving' :
               trend === 'worsening' ? 'Rising' : 'Stable'}
            </Text>
            {delta !== 0 && (
              <Text style={[Typography.bodySmall, { color: Colors.textMuted, marginLeft: 6 }]}>
                {Math.abs(delta)} pts vs yesterday
              </Text>
            )}
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View style={cardsStyle}>
          <Text style={[Typography.caption, styles.sectionLabel]}>QUICK ACTIONS</Text>
          <View style={styles.qaRow}>
            <QuickActionBtn iconName="timer-outline" label="Focus" color={Colors.primary}
              onPress={() => router.push('/tabs/focus')} />
            <QuickActionBtn iconName="heart-outline" label="Recover" color={Colors.positive}
              onPress={() => router.push('/tabs/recovery')} />
            <QuickActionBtn iconName="chatbubble-ellipses-outline" label="Coach" color={Colors.secondary}
              onPress={() => router.push('/screens/ai-coach')} />
            <QuickActionBtn iconName="phone-portrait-outline" label="Detox" color={Colors.warning}
              onPress={() => router.push('/screens/dopamine-detox')} />
          </View>

          {/* AI Insight Card */}
          <TouchableOpacity
            onPress={() => router.push('/screens/ai-coach')}
            activeOpacity={0.85}
          >
            <GlassCard variant="primary" glowAccent style={styles.insightCard}>
              <View style={styles.insightRow}>
                <View style={styles.aiIcon}>
                  <Ionicons name="sparkles" size={20} color={Colors.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.caption, { color: Colors.secondary, marginBottom: 4 }]}>
                    AI INSIGHT
                  </Text>
                  <Text style={[Typography.body, { color: Colors.textPrimary }]}>
                    {aiInsight}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              </View>
            </GlassCard>
          </TouchableOpacity>

          {/* Metric Cards Grid */}
          <Text style={[Typography.caption, styles.sectionLabel]}>TODAY'S METRICS</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              label="Focus Time"
              value={totalFocusToday}
              unit="min"
              trend={12}
              subtitle="today"
              accentColor={Colors.primary}
              style={styles.metricHalf}
            />
            <MetricCard
              label="Streak"
              value={streakDays}
              unit="days"
              subtitle="active"
              accentColor={Colors.secondary}
              style={styles.metricHalf}
            />
            <MetricCard
              label="Sleep"
              value={sleepHours}
              unit="hrs"
              trend={-8}
              subtitle="last night"
              accentColor={Colors.positive}
              style={styles.metricHalf}
            />
            <MetricCard
              label="Sleep Quality"
              value={sleepQuality}
              unit="%"
              trend={5}
              subtitle="vs avg"
              accentColor={Colors.warning}
              style={styles.metricHalf}
            />
          </View>

          {/* Burnout Dimensions */}
          <Text style={[Typography.caption, styles.sectionLabel]}>WELLNESS SIGNALS</Text>
          <GlassCard style={styles.dimsCard}>
            {dimensions.map((d, i) => (
              <View key={i} style={[styles.dimRow, i < dimensions.length - 1 && styles.dimBorder]}>
                <Text style={[Typography.label, { color: Colors.textSecondary, width: 110 }]}>
                  {d.label}
                </Text>
                <View style={styles.dimBarWrap}>
                  <View
                    style={[
                      styles.dimFill,
                      {
                        width: `${d.value}%`,
                        backgroundColor:
                          d.value > 70 ? Colors.danger :
                          d.value > 45 ? Colors.warning : Colors.positive,
                      },
                    ]}
                  />
                </View>
                <Text style={[Typography.label, { color: Colors.textMuted, width: 28, textAlign: 'right' }]}>
                  {d.value}
                </Text>
              </View>
            ))}
          </GlassCard>

          {/* CTA row */}
          <View style={styles.ctaRow}>
            <TouchableOpacity
              onPress={() => router.push('/screens/energy-ring')}
              style={styles.ctaCard}
              activeOpacity={0.85}
            >
              <GlassCard variant="primary" style={{ flex: 1 }}>
                <Ionicons name="flash-outline" size={24} color={Colors.primary} style={{ marginBottom: 8 }} />
                <Text style={[Typography.h4, { color: Colors.textPrimary }]}>Energy Ring</Text>
                <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>Deep dive</Text>
              </GlassCard>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/tabs/analytics')}
              style={styles.ctaCard}
              activeOpacity={0.85}
            >
              <GlassCard variant="secondary" style={{ flex: 1 }}>
                <Ionicons name="stats-chart-outline" size={24} color={Colors.secondary} style={{ marginBottom: 8 }} />
                <Text style={[Typography.h4, { color: Colors.textPrimary }]}>Analytics</Text>
                <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>Weekly report</Text>
              </GlassCard>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg },
  header: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingVertical: 16,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifBtn: {
    width:  40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems:    'center',
    justifyContent: 'center',
    position: 'relative',
    ...Shadow.sm,
  },
  notifDot: {
    position:     'absolute',
    top:          8,
    right:        8,
    width:        7,
    height:       7,
    borderRadius: 4,
    backgroundColor: Colors.danger,
  },
  avatar: {
    width:           40,
    height:          40,
    borderRadius:    12,
    backgroundColor: Colors.glowCyan,
    alignItems:      'center',
    justifyContent:  'center',
    ...Shadow.sm,
  },
  ringSection: { alignItems: 'center', paddingVertical: 16 },
  trendPill: {
    flexDirection:   'row',
    alignItems:      'center',
    borderWidth:     1,
    borderRadius:    Radius.full,
    paddingHorizontal: 14,
    paddingVertical:   6,
    marginTop:       16,
  },
  sectionLabel: {
    color:        Colors.textMuted,
    marginTop:    24,
    marginBottom: 12,
  },
  qaRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginBottom:   20,
  },
  qaBtn: { alignItems: 'center', width: (W - Spacing.lg * 2 - 24) / 4 },
  qaIcon: {
    width:         48,
    height:        48,
    borderRadius:  14,
    alignItems:    'center',
    justifyContent: 'center',
  },
  insightCard: { marginBottom: 8 },
  insightRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  aiIcon: {
    width:        40,
    height:       40,
    borderRadius: 12,
    backgroundColor: 'rgba(124, 107, 240, 0.08)',
    alignItems:   'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  metricsGrid: {
    flexDirection:  'row',
    flexWrap:       'wrap',
    gap:            12,
    marginBottom:   8,
  },
  metricHalf: { width: (W - Spacing.lg * 2 - 12) / 2 },
  dimsCard:   { marginBottom: 8 },
  dimRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  dimBorder:  { borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle },
  dimBarWrap: { flex: 1, height: 6, backgroundColor: Colors.backgroundAlt, borderRadius: 3, marginHorizontal: 12, overflow: 'hidden' },
  dimFill:    { height: '100%', borderRadius: 3, minWidth: 4 },
  ctaRow:     { flexDirection: 'row', gap: 12, marginTop: 20 },
  ctaCard:    { flex: 1 },
});
