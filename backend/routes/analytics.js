const router = require('express').Router();
const { authenticate } = require('../middleware/auth');

// GET /api/analytics/screen-time
router.get('/screen-time', authenticate, async (req, res, next) => {
  try {
    res.json({
      today: {
        totalHours: 8.8,
        breakdown: [
          { category: 'Social Media',  hours: 2.5, percent: 28, color: '#FF4D6D' },
          { category: 'Work Tools',    hours: 2.1, percent: 24, color: '#00E5FF' },
          { category: 'Entertainment', hours: 1.8, percent: 20, color: '#7A5CFF' },
          { category: 'Messaging',     hours: 1.2, percent: 14, color: '#4EFFA1' },
          { category: 'News',          hours: 0.8, percent: 9,  color: '#FFD166' },
          { category: 'Other',         hours: 0.4, percent: 5,  color: '#5C5C7A' },
        ],
      },
      weeklyAvg: 6.8,
      monthlyTrend: -12,
    });
  } catch (err) { next(err); }
});

// GET /api/analytics/sleep
router.get('/sleep', authenticate, async (req, res, next) => {
  try {
    res.json({
      lastNight: { hours: 6.5, quality: 68, bedtime: '23:30', wakeTime: '06:00' },
      weeklyAvg: { hours: 6.8, quality: 72 },
      history: Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
          date:    d.toISOString().split('T')[0],
          hours:   +(5.5 + Math.random() * 2.5).toFixed(1),
          quality: Math.round(50 + Math.random() * 40),
        };
      }),
    });
  } catch (err) { next(err); }
});

// POST /api/analytics/sleep
router.post('/sleep', authenticate, async (req, res, next) => {
  try {
    const { hours, quality, bedtime, wakeTime } = req.body;
    // In production: save to Firestore
    res.status(201).json({ message: 'Sleep logged', date: new Date().toISOString() });
  } catch (err) { next(err); }
});

module.exports = router;
