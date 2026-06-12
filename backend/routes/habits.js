const router = require('express').Router();
const { authenticate } = require('../middleware/auth');

// GET /api/habits
router.get('/', authenticate, async (req, res, next) => {
  try {
    // In production: fetch from Firestore
    res.json({ habits: [], message: 'Fetch from client store for now' });
  } catch (err) { next(err); }
});

// POST /api/habits/log
router.post('/log', authenticate, async (req, res, next) => {
  try {
    const { habitId, date } = req.body;
    if (!habitId || !date) return res.status(400).json({ error: 'habitId and date required' });
    res.status(201).json({
      habitId, date,
      xpEarned: 10,
      message:  'Habit logged',
    });
  } catch (err) { next(err); }
});

module.exports = router;
