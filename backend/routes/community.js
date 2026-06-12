const router = require('express').Router();
const { authenticate } = require('../middleware/auth');

// GET /api/community/challenges
router.get('/challenges', authenticate, async (req, res, next) => {
  try {
    res.json({
      challenges: [
        {
          id: 'c1', title: '7-Day Social Detox',
          description:  'No social media for 7 straight days',
          participants: 2847, duration: 7, daysLeft: 4,
          reward:       '500 XP + Neural Badge',
          type:         'detox',
        },
        {
          id: 'c2', title: 'Deep Work Sprint',
          description:  '4+ hours of focused work daily for 5 days',
          participants: 1234, duration: 5, daysLeft: 5,
          reward:       '300 XP',
          type:         'focus',
        },
      ],
    });
  } catch (err) { next(err); }
});

// POST /api/community/challenges/:id/join
router.post('/challenges/:id/join', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    res.json({ message: 'Joined challenge', challengeId: id, joinedAt: new Date().toISOString() });
  } catch (err) { next(err); }
});

// GET /api/community/challenges/:id/leaderboard
router.get('/challenges/:id/leaderboard', authenticate, async (req, res, next) => {
  try {
    res.json({
      challengeId: req.params.id,
      entries: [
        { rank: 1, displayName: 'Aiki_M',   score: 98 },
        { rank: 2, displayName: 'ZenCoder', score: 95 },
        { rank: 3, displayName: 'You',      score: 88 },
      ],
    });
  } catch (err) { next(err); }
});

module.exports = router;
