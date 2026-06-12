import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius, Shadow } from '@/constants/theme';
import { GlassCard }        from '@/components/ui/GlassCard';
import { useAuthStore }     from '@/store/authStore';
import { useBurnoutStore }  from '@/store/burnoutStore';
import { useFocusStore }    from '@/store/focusStore';
import { useAppStore }      from '@/store/appStore';

const { width: W } = Dimensions.get('window');

const MENU_ITEMS = [
  { iconName: 'trophy-outline' as const,       label: 'Achievements',        route: '/screens/achievements',     color: Colors.warning },
  { iconName: 'leaf-outline' as const,          label: 'Virtual Ecosystem',   route: '/screens/ecosystem',        color: Colors.positive },
  { iconName: 'trending-up-outline' as const,   label: 'Progress Dashboard',  route: '/screens/progress',         color: Colors.primary },
  { iconName: 'moon-outline' as const,          label: 'Sleep Analysis',      route: '/screens/sleep-analysis',   color: Colors.secondary },
  { iconName: 'checkbox-outline' as const,      label: 'Habit Tracker',       route: '/screens/habit-tracker',    color: Colors.positive },
  { iconName: 'flag-outline' as const,          label: 'Challenges',          route: '/screens/challenges',       color: Colors.primary },
  { iconName: 'notifications-outline' as const, label: 'Notifications',       route: '/screens/notifications',    color: Colors.warning },
  { iconName: 'color-palette-outline' as const, label: 'Customization',       route: '/screens/customization',    color: Colors.secondary },
  { iconName: 'shield-outline' as const,        label: 'Data Privacy',        route: '/screens/privacy',          color: Colors.textMuted },
  { iconName: 'settings-outline' as const,      label: 'Settings',            route: '/screens/settings',         color: Colors.textMuted },
  { iconName: 'log-out-outline' as const,       label: 'Logout',              route: '/screens/logout',           color: Colors.danger },
];

const ROLE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  developer: 'code-slash-outline',
  student:   'school-outline',
  creator:   'color-palette-outline',
};

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { currentScore } = useBurnoutStore();
  const { totalFocusToday, streakDays } = useFocusStore();
  const { achievements, totalXP, level } = useAppStore();

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const xpToNextLevel = 500 - (totalXP % 500);
  const levelProgress  = ((totalXP % 500) / 500) * 100;

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 12 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile hero */}
        <View style={styles.heroCard}>
          <View style={styles.avatarRing}>
            <Ionicons name="person" size={28} color={Colors.primary} />
          </View>
          <Text style={[Typography.h2, { marginTop: 16 }]}>
            {user?.displayName ?? 'User'}
          </Text>
          <Text style={[Typography.body, { color: Colors.textMuted, marginTop: 2 }]}>
            {user?.email ?? 'user@resetos.app'}
          </Text>

          {/* Level badge */}
          <View style={styles.levelBadge}>
            <Ionicons name="star" size={12} color={Colors.secondary} />
            <Text style={[Typography.caption, { color: Colors.secondary, marginLeft: 4 }]}>
              LEVEL {level}
            </Text>
          </View>

          {/* XP bar */}
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: `${levelProgress}%` }]} />
          </View>
          <Text style={[Typography.bodySmall, { color: Colors.textMuted, marginTop: 6 }]}>
            {totalXP} XP — {xpToNextLevel} to Level {level + 1}
          </Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Focus', value: `${totalFocusToday}m`, color: Colors.primary },
            { label: 'Streak', value: `${streakDays}d`, color: Colors.positive },
            { label: 'Score', value: `${currentScore}`, color: currentScore > 60 ? Colors.danger : Colors.positive },
            { label: 'Badges', value: `${unlockedCount}`, color: Colors.warning },
          ].map((s) => (
            <GlassCard key={s.label} style={styles.statCard} padding={12}>
              <Text style={[Typography.metricSm, { color: s.color }]}>{s.value}</Text>
              <Text style={[Typography.bodySmall, { color: Colors.textMuted, marginTop: 2, fontSize: 11 }]}>
                {s.label}
              </Text>
            </GlassCard>
          ))}
        </View>

        {/* Role chip */}
        <View style={styles.roleSection}>
          <View style={styles.roleChip}>
            <Ionicons
              name={ROLE_ICONS[user?.role ?? ''] || 'sparkles-outline'}
              size={14}
              color={Colors.textSecondary}
            />
            <Text style={[Typography.label, { color: Colors.textSecondary, marginLeft: 6 }]}>
              {user?.role ?? 'User'}
            </Text>
          </View>
        </View>

        {/* Menu */}
        <Text style={[Typography.caption, styles.sectionLabel]}>SETTINGS</Text>
        <GlassCard style={styles.menuCard} padding={0}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item.route}
              onPress={() => router.push(item.route as any)}
              style={[
                styles.menuItem,
                i < MENU_ITEMS.length - 1 && { borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle },
              ]}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}10` }]}>
                <Ionicons name={item.iconName} size={18} color={item.color} />
              </View>
              <Text style={[Typography.bodyLarge, {
                flex: 1,
                color: item.label === 'Logout' ? Colors.danger : Colors.textPrimary,
              }]}>
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </GlassCard>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg },
  heroCard: {
    alignItems:      'center',
    paddingVertical:  32,
    paddingHorizontal: 24,
    borderRadius:    Radius.xl,
    backgroundColor: Colors.surface,
    borderWidth:     1,
    borderColor:     Colors.borderSubtle,
    marginBottom:    16,
    ...Shadow.sm,
  },
  avatarRing: {
    width:           72,
    height:          72,
    borderRadius:    20,
    backgroundColor: Colors.glowCyan,
    alignItems:      'center',
    justifyContent:  'center',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth:  1,
    borderColor:  `${Colors.secondary}30`,
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical:    4,
    marginTop:    12,
    backgroundColor: `${Colors.secondary}08`,
  },
  xpBar: {
    width:           W - Spacing.lg * 2 - 64,
    height:          4,
    backgroundColor: Colors.backgroundAlt,
    borderRadius:    2,
    marginTop:       12,
    overflow:        'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 2,
  },
  statsRow: {
    flexDirection:  'row',
    gap:            8,
    marginBottom:   16,
  },
  statCard: { flex: 1, alignItems: 'center' },
  roleSection: { alignItems: 'flex-start', marginBottom: 16 },
  roleChip: {
    flexDirection: 'row',
    alignItems:    'center',
    backgroundColor: Colors.backgroundAlt,
    borderRadius:    Radius.full,
    paddingHorizontal: 14,
    paddingVertical:    8,
    borderWidth:     1,
    borderColor:     Colors.borderSubtle,
  },
  sectionLabel: { color: Colors.textMuted, marginBottom: 12 },
  menuCard:     { overflow: 'hidden' },
  menuItem: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingHorizontal: 16,
    paddingVertical:   14,
    gap:            12,
  },
  menuIcon: {
    width:         36,
    height:        36,
    borderRadius:  10,
    alignItems:    'center',
    justifyContent: 'center',
  },
});
