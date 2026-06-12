const router = require('express').Router();
const { authenticate } = require('../middleware/auth');

// POST /api/focus/sessions
router.post('/sessions', authenticate, async (req, res, next) => {
  try {
    const { durationMinutes, type } = req.body;
    if (!durationMinutes) return res.status(400).json({ error: 'durationMinutes required' });

    const session = {
      id:               Date.now().toString(),
      uid:              req.user.uid,
      durationMinutes:  Number(durationMinutes),
      type:             type ?? 'custom',
      status:           'active',
      startedAt:        new Date().toISOString(),
    };
    // In production: save to Firestore
    res.status(201).json({ session });
  } catch (err) { next(err); }
});

// PATCH /api/focus/sessions/:id
router.patch('/sessions/:id', authenticate, async (req, res, next) => {
  try {
    const { completedMinutes, status } = req.body;
    // In production: update Firestore document
    res.json({
      id: req.params.id,
      completedMinutes: Number(completedMinutes),
      status,
      endedAt: new Date().toISOString(),
      xpEarned: status === 'completed' ? 50 : 15,
    });
  } catch (err) { next(err); }
});

// GET /api/focus/sessions
router.get('/sessions', authenticate, async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    // Return mock sessions
    res.json({ sessions: [], total: 0 });
  } catch (err) { next(err); }
});

// GET /api/focus/stats
router.get('/stats', authenticate, async (req, res, next) => {
  try {
    res.json({
      totalFocusMinutesAllTime: 1240,
      totalFocusMinutesThisWeek: 180,
      averageSessionMinutes: 24,
      completionRate: 78,
      longestSession: 50,
      currentStreak: 5,
    });
  } catch (err) { next(err); }
});

module.exports = router;
