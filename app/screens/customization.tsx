import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/theme';
import { NeuralBackground } from '@/components/ui/NeuralBackground';
import { GlassCard }        from '@/components/ui/GlassCard';
import { NeuralButton }     from '@/components/ui/NeuralButton';
import { ScreenHeader }     from '@/components/ui/ScreenHeader';
import { useAuthStore }     from '@/store/authStore';

const ACCENT_COLORS = [
  { label: 'Teal',    value: '#2DB5A3' },
  { label: 'Lavender', value: '#7C6BF0' },
  { label: 'Green',   value: '#34C585' },
  { label: 'Orange',  value: '#EF8B5A' },
  { label: 'Rose',    value: '#E85D6F' },
  { label: 'Amber',   value: '#F0A949' },
];

const RING_STYLES = ['default', 'neon', 'holographic', 'minimal'] as const;

const WIDGET_OPTIONS = ['Burnout Score', 'Focus Timer', 'Energy Ring', 'Streak Counter', 'AI Insight', 'Quick Action'];

export default function CustomizationScreen() {
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useAuthStore();

  const [selectedAccent,    setSelectedAccent]    = useState(user?.accentColor ?? Colors.primary);
  const [selectedRingStyle, setSelectedRingStyle] = useState<typeof RING_STYLES[number]>('default');
  const [selectedWidgets,   setSelectedWidgets]   = useState(['Burnout Score', 'Focus Timer', 'Energy Ring']);

  const toggleWidget = (w: string) => {
    setSelectedWidgets((prev) =>
      prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w].slice(0, 4),
    );
  };

  const handleSave = () => {
    updateUser({ accentColor: selectedAccent });
  };

  return (
    <View style={styles.root}>
      <NeuralBackground intensity="low" />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Customization" subtitle="Personalize your neural UI" showBack accentColor={selectedAccent} />

        {/* Preview card */}
        <GlassCard variant="primary" style={styles.previewCard} padding={20}>
          <Text style={[Typography.caption, { color: Colors.textMuted, marginBottom: 12 }]}>LIVE PREVIEW</Text>
          <View style={styles.previewHeader}>
            <View style={[styles.previewAvatar, { borderColor: selectedAccent }]}>
              <Ionicons name="sparkles-outline" size={24} color={selectedAccent} />
            </View>
            <View>
              <Text style={[Typography.h3, { color: Colors.textPrimary }]}>ResetOS</Text>
              <Text style={[Typography.bodySmall, { color: selectedAccent }]}>Neural Edition</Text>
            </View>
          </View>
          <View style={[styles.previewBar, { backgroundColor: selectedAccent + '20' }]}>
            <View style={[styles.previewFill, { backgroundColor: selectedAccent, width: '68%' }]} />
          </View>
          <Text style={[Typography.caption, { color: selectedAccent, marginTop: 6 }]}>
            Burnout Score: 42 · Optimal
          </Text>
        </GlassCard>

        {/* Accent color */}
        <Text style={[Typography.caption, styles.sectionLabel]}>ACCENT COLOR</Text>
        <View style={styles.colorGrid}>
          {ACCENT_COLORS.map((c) => (
            <TouchableOpacity
              key={c.value}
              onPress={() => setSelectedAccent(c.value)}
              style={[
                styles.colorSwatch,
                { backgroundColor: c.value },
                selectedAccent === c.value && styles.swatchSelected,
              ]}
            >
              {selectedAccent === c.value && (
                <Ionicons name="checkmark" size={18} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Ring style */}
        <Text style={[Typography.caption, styles.sectionLabel]}>ENERGY RING STYLE</Text>
        <View style={styles.ringStyleRow}>
          {RING_STYLES.map((style) => (
            <TouchableOpacity
              key={style}
              onPress={() => setSelectedRingStyle(style)}
              style={[
                styles.styleBtn,
                selectedRingStyle === style && { borderColor: selectedAccent, backgroundColor: selectedAccent + '15' },
              ]}
            >
              <Text style={[Typography.label, {
                color: selectedRingStyle === style ? selectedAccent : Colors.textMuted,
              }]}>
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dashboard widgets */}
        <Text style={[Typography.caption, styles.sectionLabel]}>DASHBOARD WIDGETS (max 4)</Text>
        <View style={styles.widgetGrid}>
          {WIDGET_OPTIONS.map((w) => {
            const isSelected = selectedWidgets.includes(w);
            return (
              <TouchableOpacity
                key={w}
                onPress={() => toggleWidget(w)}
                style={[
                  styles.widgetBtn,
                  isSelected && { borderColor: selectedAccent, backgroundColor: selectedAccent + '15' },
                ]}
              >
                <Text style={[Typography.label, {
                  color: isSelected ? selectedAccent : Colors.textMuted,
                }]}>
                  {w}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Neural background intensity */}
        <Text style={[Typography.caption, styles.sectionLabel]}>NEURAL BACKGROUND</Text>
        <GlassCard style={styles.intensityCard}>
          <View style={styles.intensityRow}>
            {(['off', 'low', 'medium', 'high'] as const).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.intensityBtn,
                  level === 'medium' && { borderColor: selectedAccent, backgroundColor: selectedAccent + '15' },
                ]}
              >
                <Text style={[Typography.label, { color: level === 'medium' ? selectedAccent : Colors.textMuted }]}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        <NeuralButton
          title="Save Customization"
          onPress={handleSave}
          style={{ marginTop: 24 }}
        />

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg },
  previewCard: { marginBottom: 8, marginTop: 4 },
  previewHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  previewAvatar: {
    width: 52, height: 52, borderRadius: 26, borderWidth: 2,
    backgroundColor: Colors.backgroundAlt, alignItems: 'center', justifyContent: 'center',
  },
  previewBar:  { height: 4, backgroundColor: Colors.backgroundAlt, borderRadius: 2, overflow: 'hidden' },
  previewFill: { height: '100%', borderRadius: 2 },
  sectionLabel: { color: Colors.textMuted, marginTop: 16, marginBottom: 10 },
  colorGrid:   { flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginBottom: 4 },
  colorSwatch: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  swatchSelected: { transform: [{ scale: 1.2 }], elevation: 8 },
  ringStyleRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  styleBtn:    { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.borderSubtle, backgroundColor: Colors.surface },
  widgetGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  widgetBtn:   { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.borderSubtle, backgroundColor: Colors.surface },
  intensityCard: {},
  intensityRow:  { flexDirection: 'row', gap: 8 },
  intensityBtn:  { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.borderSubtle, backgroundColor: Colors.surface },
});
