const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { getChatResponse, getDailyInsight } = require('../ai/openaiClient');
const { calculateBurnoutScore } = require('../ai/burnoutEngine');

// POST /api/ai/chat
router.post('/chat', authenticate, async (req, res, next) => {
  try {
    const { messages, context } = req.body;
    if (!messages?.length) {
      return res.status(400).json({ error: 'messages array required' });
    }

    const systemPrompt = buildSystemPrompt(context);
    const response     = await getChatResponse(systemPrompt, messages);

    res.json({
      message:   response,
      timestamp: new Date().toISOString(),
      model:     'gpt-4o-mini',
    });
  } catch (err) { next(err); }
});

// GET /api/ai/daily-insight
router.get('/daily-insight', authenticate, async (req, res, next) => {
  try {
    // In production: fetch user context from Firestore
    const mockContext = {
      burnoutScore:    54,
      screenTimeHours: 4.5,
      streakDays:      5,
      recentPattern:   'high late-night usage',
    };
    const insight = await getDailyInsight(mockContext);
    res.json({ insight, generatedAt: new Date().toISOString() });
  } catch (err) { next(err); }
});

// GET /api/ai/suggestions
router.get('/suggestions', authenticate, async (req, res, next) => {
  try {
    const suggestions = [
      { id: '1', type: 'focus',    priority: 'high',   text: 'Your peak focus window is 9–11 AM. Schedule deep work now.',    action: 'start-focus' },
      { id: '2', type: 'recovery', priority: 'medium', text: '4 hours of screen use without a break. Take a 3-min eye rest.',   action: 'eye-break'   },
      { id: '3', type: 'detox',    priority: 'medium', text: '45 mins of social media detected. Consider a 1-hour detox.',      action: 'detox'       },
      { id: '4', type: 'sleep',    priority: 'low',    text: 'Your sleep quality improves when you stop screens by 9:30 PM.',   action: 'set-reminder' },
    ];
    res.json({ suggestions });
  } catch (err) { next(err); }
});

function buildSystemPrompt(context) {
  return `You are NeuroAI, the AI Brain Coach for ResetOS — a digital burnout recovery app.

User context:
- Burnout Score: ${context?.burnoutScore ?? 'unknown'}/100
- Level: ${context?.burnoutLevel ?? 'unknown'}
- Screen Time Today: ${context?.screenTimeHours ?? 'unknown'} hours
- Focus Minutes Today: ${context?.focusMinutes ?? 0}
- Streak: ${context?.streakDays ?? 0} days

Your role: Provide personalized, science-backed guidance on digital wellness, focus optimization, sleep hygiene, and burnout recovery. Be concise, warm, and actionable. Use markdown formatting for lists and emphasis. Keep responses under 200 words unless detail is requested.`;
}

module.exports = router;
