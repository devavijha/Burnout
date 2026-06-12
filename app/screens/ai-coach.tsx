import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { Typography, Spacing, Radius } from '@/constants/theme';
import { NeuralBackground } from '@/components/ui/NeuralBackground';
import { GlassCard }        from '@/components/ui/GlassCard';
import { PulseRing }        from '@/components/ui/PulseRing';
import { useAppStore }      from '@/store/appStore';
import { useBurnoutScore }  from '@/hooks/useBurnoutScore';

const { width: W } = Dimensions.get('window');

const QUICK_PROMPTS = [
  "Why am I feeling burned out?",
  "Give me a focus technique",
  "How to sleep better tonight?",
  "Suggest a morning routine",
  "Help me reduce screen time",
];

const AI_RESPONSES: Record<string, string> = {
  'burned out': `Based on your burnout patterns, here's what's happening:\n\nYour prefrontal cortex is fatigued from constant context switching.\n\n**Immediate actions:**\n1. Take a 5-min breathing break right now\n2. Mute notifications for 2 hours\n3. Do ONE focused task (25 min)\n\nConsistent pattern: you tend to spike after 9 PM. An earlier cutoff would help significantly.`,
  'focus': `**Neural Anchoring Technique:**\n\n1. Write your ONE intention before starting\n2. Phone face-down, notifications silenced\n3. Use resets: 25 min focus, 5 min break\n4. After 4 blocks, take a 20-min break\n\nThis reduces context-switching overhead by ~68%. Want to start a Focus Session now?`,
  'sleep': `Your sleep data shows 6.5h average with 68% quality score.\n\n**Sleep Protocol:**\n- Digital cutoff at 9:30 PM (non-negotiable)\n- Room temp: 65-68F / 18-20C\n- No caffeine after 2 PM\n- Box breathing for 5 mins before bed\n\nImproving sleep quality to 80%+ will reduce tomorrow's burnout score by ~15 points.`,
  'morning': `**Optimal Morning Protocol:**\n\nMinutes 0-30: No screens, hydrate, stretch\nMinutes 30-60: Caffeine + 5-min mindfulness\nMinutes 60-90: Review one goal, deep work begins\n\nAvoid checking email/social in the first 60 minutes — this protects your cortisol rhythm and boosts focus duration.`,
  'screen time': `**7-Day Screen Reduction Plan:**\n\nDay 1-2: Track usage without judgment\nDay 3-4: Add 30-min delay before social apps\nDay 5-6: Greyscale mode on phone evenings\nDay 7: Phone-free morning challenge\n\nActivate Dopamine Detox in the app to automate restrictions!`,
};

function TypingIndicator() {
  return (
    <View style={[msgStyles.bubble, msgStyles.aiMsg, { width: 60 }]}>
      <Text style={{ color: Colors.textMuted, letterSpacing: 3 }}>...</Text>
    </View>
  );
}

export default function AICoachScreen() {
  const safeInsets = useSafeAreaInsets();
  const { chatMessages, addChatMessage, isAITyping, setAITyping, clearChat } = useAppStore();
  const { score, level } = useBurnoutScore();
  const [input, setInput] = useState('');
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    if (chatMessages.length === 0) {
      addChatMessage({
        id:        'welcome',
        role:      'assistant',
        content:   `Hello! I'm NeuroAI, your personal Brain Coach.\n\nI can see your burnout score is **${score}** (${level}). I'm here to help you recover, focus, and build healthier digital habits.\n\nWhat would you like to work on today?`,
        timestamp: new Date().toISOString(),
      });
    }
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInput('');
    addChatMessage({ id: Date.now().toString(), role: 'user', content: text.trim(), timestamp: new Date().toISOString() });
    setAITyping(true);

    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 800));

    const lower = text.toLowerCase();
    let response = 'Great question! Based on your neural patterns, I recommend focusing on one habit at a time — small consistent changes create lasting neural rewiring. What area would you like to improve first: focus, sleep, or social media habits?';
    for (const [key, val] of Object.entries(AI_RESPONSES)) {
      if (lower.includes(key)) { response = val; break; }
    }

    setAITyping(false);
    addChatMessage({ id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date().toISOString() });
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }: { item: typeof chatMessages[0] }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[msgStyles.row, isUser ? msgStyles.userRow : msgStyles.aiRow]}>
        {!isUser && (
          <View style={msgStyles.avatar}>
            <Ionicons name="hardware-chip-outline" size={16} color={Colors.secondary} />
          </View>
        )}
        <View style={[msgStyles.bubble, isUser ? msgStyles.userMsg : msgStyles.aiMsg]}>
          <Text style={[Typography.body, { color: Colors.textPrimary }]}>{item.content}</Text>
          <Text style={[Typography.caption, { color: Colors.textMuted, marginTop: 4 }]}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <NeuralBackground intensity="low" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <View style={[styles.chatHeader, { paddingTop: safeInsets.top + 8 }]}>
          <View style={styles.coachInfo}>
            <PulseRing size={40} color={Colors.secondary} rings={1} speed="slow">
              <View style={[styles.coachAvatar]}>
                <Ionicons name="hardware-chip-outline" size={20} color={Colors.secondary} />
              </View>
            </PulseRing>
            <View>
              <Text style={[Typography.h4]}>NeuroAI</Text>
              <Text style={[Typography.bodySmall, { color: Colors.secondary }]}>Your Brain Coach</Text>
            </View>
          </View>
          <TouchableOpacity onPress={clearChat} style={styles.clearBtn}>
            <Ionicons name="refresh-outline" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        <GlassCard variant="secondary" style={styles.contextStrip} padding={8}>
          <Text style={[Typography.caption, { color: Colors.secondary }]}>
            CONTEXT: Burnout {score} · {level} · Patterns analyzed
          </Text>
        </GlassCard>

        {/* Messages */}
        <FlatList
          ref={flatRef}
          data={chatMessages}
          keyExtractor={(i) => i.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={isAITyping ? <View style={msgStyles.aiRow}><View style={msgStyles.avatar}><Ionicons name="hardware-chip-outline" size={14} color={Colors.secondary} /></View><TypingIndicator /></View> : null}
        />

        {/* Quick prompts */}
        {chatMessages.length <= 1 && (
          <View style={styles.quickPrompts}>
            {QUICK_PROMPTS.map((p) => (
              <TouchableOpacity key={p} onPress={() => sendMessage(p)} style={styles.promptChip}>
                <Text style={[Typography.bodySmall, { color: Colors.primary }]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Input */}
        <View style={[styles.inputArea, { paddingBottom: safeInsets.bottom + 8 }]}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask your Brain Coach..."
            placeholderTextColor={Colors.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || isAITyping}
            style={[styles.sendBtn, { opacity: !input.trim() || isAITyping ? 0.4 : 1 }]}
          >
            <View style={[StyleSheet.absoluteFill, { borderRadius: 22, backgroundColor: Colors.primary }]} />
            <Ionicons name="send" size={18} color={Colors.textInverse} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  chatHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.borderSubtle,
  },
  coachInfo:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
  coachAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.glowPurple, alignItems: 'center', justifyContent: 'center' },
  clearBtn:    { padding: 8 },
  contextStrip: { marginHorizontal: Spacing.lg, marginVertical: 8 },
  messageList:  { paddingHorizontal: Spacing.lg, paddingTop: 8, paddingBottom: 16 },
  quickPrompts: { paddingHorizontal: Spacing.lg, paddingBottom: 8 },
  promptChip: {
    borderWidth: 1, borderColor: Colors.primary, borderRadius: Radius.full,
    paddingHorizontal: 14, paddingVertical: 6, marginBottom: 6,
    backgroundColor: Colors.glowCyan,
  },
  inputArea: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    paddingHorizontal: Spacing.lg, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: Colors.borderSubtle,
    backgroundColor: Colors.background,
  },
  textInput: {
    flex: 1, minHeight: 44, maxHeight: 100,
    backgroundColor: Colors.backgroundAlt, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.borderSubtle,
    paddingHorizontal: 16, paddingVertical: 10,
    color: Colors.textPrimary, fontSize: 15,
  },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});

const msgStyles = StyleSheet.create({
  row:     { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end', gap: 8 },
  aiRow:   { justifyContent: 'flex-start' },
  userRow: { justifyContent: 'flex-end' },
  avatar:  { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.glowPurple, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bubble:  { maxWidth: W * 0.76, paddingHorizontal: 14, paddingVertical: 10, borderRadius: Radius.lg, overflow: 'hidden', position: 'relative' },
  aiMsg:   { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.borderSubtle },
  userMsg: { backgroundColor: Colors.glowCyan, borderWidth: 1, borderColor: Colors.primary },
});
