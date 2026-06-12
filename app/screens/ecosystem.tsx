import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay, Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/theme';
import { NeuralBackground } from '@/components/ui/NeuralBackground';
import { GlassCard }        from '@/components/ui/GlassCard';
import { ScreenHeader }     from '@/components/ui/ScreenHeader';
import { useAppStore }      from '@/store/appStore';
import { useFocusStore }    from '@/store/focusStore';

const ECOSYSTEM_NODES = [
  { id: 'cortex',    icon: 'sparkles-outline',       label: 'Neural Cortex',    x: 0.5,  y: 0.15, size: 64, level: 3, color: Colors.primary },
  { id: 'focus',     icon: 'locate-outline',          label: 'Focus Tree',       x: 0.2,  y: 0.35, size: 48, level: 2, color: Colors.positive },
  { id: 'sleep',     icon: 'moon-outline',            label: 'Sleep Crystal',    x: 0.75, y: 0.35, size: 44, level: 2, color: Colors.secondary },
  { id: 'recovery',  icon: 'leaf-outline',            label: 'Recovery Plant',   x: 0.15, y: 0.6,  size: 40, level: 1, color: Colors.positive },
  { id: 'social',    icon: 'people-outline',          label: 'Social Neuron',    x: 0.5,  y: 0.55, size: 36, level: 1, color: Colors.warning },
  { id: 'dopamine',  icon: 'flask-outline',           label: 'Dopamine Lab',     x: 0.8,  y: 0.6,  size: 40, level: 1, color: Colors.danger },
  { id: 'insight',   icon: 'star-outline',            label: 'Wisdom Node',      x: 0.35, y: 0.75, size: 32, level: 1, color: Colors.primary },
  { id: 'habit',     icon: 'link-outline',            label: 'Habit Chain',      x: 0.65, y: 0.75, size: 32, level: 1, color: Colors.secondary },
];

function FloatingNode({ node, width }: { node: typeof ECOSYSTEM_NODES[0]; width: number }) {
  const floatY  = useSharedValue(0);
  const glow    = useSharedValue(0.5);
  const delay   = ECOSYSTEM_NODES.indexOf(node) * 200;

  useEffect(() => {
    floatY.value = withDelay(delay, withRepeat(
      withTiming(-8, { duration: 2000 + Math.random() * 1000, easing: Easing.inOut(Easing.sin) }),
      -1, true,
    ));
    glow.value = withDelay(delay, withRepeat(
      withTiming(1, { duration: 1500 }), -1, true,
    ));
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left:     node.x * width - node.size / 2,
    top:      node.y * 420 + floatY.value,
    width:    node.size,
    height:   node.size,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value * 0.15,
  }));

  return (
    <Animated.View style={style}>
      <Animated.View style={[
        StyleSheet.absoluteFill,
        { borderRadius: node.size / 2, backgroundColor: node.color },
        glowStyle,
      ]} />
      <View style={[styles.nodeInner, {
        width: node.size, height: node.size, borderRadius: node.size / 2,
        backgroundColor: `${node.color}15`, borderColor: node.color,
      }]}>
        <Ionicons name={node.icon as any} size={node.size * 0.42} color={node.color} />
      </View>
    </Animated.View>
  );
}

export default function EcosystemScreen() {
  const insets = useSafeAreaInsets();
  const { streakDays } = useFocusStore();
  const { totalXP, level, achievements } = useAppStore();

  const CANVAS_W = Dimensions.get('window').width - Spacing.lg * 2;

  return (
    <View style={styles.root}>
      <NeuralBackground intensity="high" />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Neural Ecosystem" subtitle="Your digital wellbeing garden" showBack />

        {/* XP banner */}
        <GlassCard variant="primary" style={styles.xpBanner} padding={14}>
          <View style={styles.xpRow}>
            <View>
              <Text style={[Typography.caption, { color: Colors.textMuted }]}>NEURAL LEVEL</Text>
              <Text style={[Typography.h1, { color: Colors.primary }]}>Level {level}</Text>
            </View>
            <View style={styles.xpRight}>
              <Text style={[Typography.metricSm, { color: Colors.primary }]}>{totalXP}</Text>
              <Text style={[Typography.bodySmall, { color: Colors.textMuted }]}>Total XP</Text>
            </View>
          </View>
          <View style={styles.xpBarBg}>
            <View style={[styles.xpBarFill, { width: `${(totalXP % 500) / 5}%` }]} />
          </View>
          <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 4 }]}>
            {500 - (totalXP % 500)} XP until Level {level + 1}
          </Text>
        </GlassCard>

        {/* Ecosystem canvas */}
        <GlassCard style={styles.ecosystemCanvas} padding={0}>
          <View style={{ height: 440, position: 'relative', overflow: 'hidden', borderRadius: 16, backgroundColor: Colors.backgroundAlt }}>
            {ECOSYSTEM_NODES.map((node) => (
              <FloatingNode key={node.id} node={node} width={CANVAS_W - 32} />
            ))}
          </View>
        </GlassCard>

        {/* Nodes legend */}
        <Text style={[Typography.caption, styles.sectionLabel]}>ECOSYSTEM NODES</Text>
        <View style={styles.nodeList}>
          {ECOSYSTEM_NODES.map((n) => (
            <GlassCard key={n.id} style={styles.nodeCard} padding={12} glowAccent accentColor={n.color}>
              <View style={styles.nodeRow}>
                <Ionicons name={n.icon as any} size={22} color={n.color} />
                <View style={{ flex: 1 }}>
                  <Text style={[Typography.label, { color: Colors.textPrimary }]}>{n.label}</Text>
                  <Text style={[Typography.caption, { color: Colors.textMuted }]}>Level {n.level} · Growing</Text>
                </View>
                <View style={styles.nodeLevelPill}>
                  <Text style={[Typography.caption, { color: n.color }]}>{n.level}</Text>
                </View>
              </View>
            </GlassCard>
          ))}
        </View>

        {/* How to grow */}
        <GlassCard variant="secondary" style={styles.growCard} padding={14}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Ionicons name="leaf-outline" size={20} color={Colors.positive} />
            <Text style={[Typography.h4]}>How to Grow Your Ecosystem</Text>
          </View>
          {[
            'Complete focus sessions to grow the Focus Tree',
            'Log sleep to power the Sleep Crystal',
            'Recover daily to bloom the Recovery Plant',
            'Maintain streaks to strengthen all nodes',
          ].map((tip, i) => (
            <Text key={i} style={[Typography.bodySmall, { color: Colors.textMuted, marginBottom: 4 }]}>
              · {tip}
            </Text>
          ))}
        </GlassCard>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:           { flex: 1, backgroundColor: Colors.background },
  scroll:         { paddingHorizontal: Spacing.lg },
  xpBanner:       { marginBottom: 16 },
  xpRow:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xpRight:        { alignItems: 'flex-end' },
  xpBarBg:        { height: 4, backgroundColor: Colors.backgroundAlt, borderRadius: 2, marginTop: 10, overflow: 'hidden' },
  xpBarFill:      { height: '100%', backgroundColor: Colors.primary, borderRadius: 2 },
  ecosystemCanvas: { marginBottom: 16, overflow: 'hidden' },
  sectionLabel:   { color: Colors.textMuted, marginBottom: 10 },
  nodeList:       { gap: 8, marginBottom: 16 },
  nodeCard:       {},
  nodeRow:        { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nodeLevelPill: {
    backgroundColor: Colors.backgroundAlt, borderRadius: Radius.full,
    width: 28, height: 28, alignItems: 'center', justifyContent: 'center',
  },
  nodeInner: { alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  growCard:  {},
});
