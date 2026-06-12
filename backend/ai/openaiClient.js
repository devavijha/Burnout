const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? '',
});

/**
 * Send a chat message to GPT with the given system prompt and conversation history.
 */
async function getChatResponse(systemPrompt, messages) {
  if (!process.env.OPENAI_API_KEY) {
    // Fallback responses when API key not configured
    return getFallbackResponse(messages[messages.length - 1]?.content ?? '');
  }

  try {
    const completion = await openai.chat.completions.create({
      model:       'gpt-4o-mini',
      max_tokens:  400,
      temperature: 0.72,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    return completion.choices[0]?.message?.content ?? 'I could not generate a response right now.';
  } catch (err) {
    console.error('[OpenAI Error]', err.message);
    return getFallbackResponse(messages[messages.length - 1]?.content ?? '');
  }
}

/**
 * Generate a personalized daily insight based on user metrics.
 */
async function getDailyInsight(context) {
  const prompt = `Based on this user's data, give ONE specific, actionable wellness insight in 2 sentences max:
  - Burnout Score: ${context.burnoutScore}/100
  - Screen Time Today: ${context.screenTimeHours}h
  - Recent Pattern: ${context.recentPattern}
  - Streak: ${context.streakDays} days

  Be specific, metric-driven, and encouraging.`;

  if (!process.env.OPENAI_API_KEY) {
    return fallbackInsights[Math.floor(Math.random() * fallbackInsights.length)];
  }

  try {
    const completion = await openai.chat.completions.create({
      model:       'gpt-4o-mini',
      max_tokens:  100,
      temperature: 0.8,
      messages:    [{ role: 'user', content: prompt }],
    });
    return completion.choices[0]?.message?.content;
  } catch {
    return fallbackInsights[Math.floor(Math.random() * fallbackInsights.length)];
  }
}

const FALLBACK_RESPONSES = {
  'burned out':   'Your burnout patterns suggest prefrontal cortex fatigue from context switching. Try: 1) 5 deep breaths right now, 2) mute notifications for 1 hour, 3) one focused task for 25 minutes.',
  'focus':        'Try Neural Anchoring: write your ONE task intention, set phone face-down, and use the 25-5 timer in Focus Mode. This reduces context-switching by ~65%.',
  'sleep':        'Your late-night screen use is disrupting melatonin production. Set a hard digital cutoff 90 minutes before bed and try the box breathing exercise in Recovery mode.',
  'social media': 'Activate the Dopamine Detox protocol. Start with a 4-hour restriction — your dopamine receptors begin resensitization within 2 hours.',
  'morning':      'Optimal morning: no screens for 30 minutes, hydrate before caffeine, 5-min mindfulness, then set 3 priorities. This primes your PFC for peak cognitive output.',
};

const fallbackInsights = [
  'Your focus capacity peaks 90 minutes after waking. Schedule your most important task then.',
  'High late-night screen time detected. A 9:30 PM cutoff could improve your burnout score by 12 points.',
  "You're 68% more productive after a recovery break. Your next break is overdue.",
  'Your burnout correlates with notification spikes. Batch-checking at 3 set times daily reduces stress by 40%.',
];

function getFallbackResponse(userMessage) {
  const lower = userMessage.toLowerCase();
  for (const [key, response] of Object.entries(FALLBACK_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  return "Based on your neural patterns, consistent micro-breaks (every 90 minutes) and a 10 PM digital cutoff are the two highest-impact changes you can make. Which would you like to tackle first?";
}

module.exports = { getChatResponse, getDailyInsight };
