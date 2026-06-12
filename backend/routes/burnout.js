const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { calculateBurnoutScore, generateHeatmap } = require('../ai/burnoutEngine');

// GET /api/burnout/score
router.get('/score', authenticate, async (req, res, next) => {
  try {
    const uid = req.user.uid;
    // In production: fetch latest metrics from Firestore
    const mockMetrics = {
      screenTimeHours:   4.5,
      appSwitches:       87,
      lateNightMinutes:  35,
      notificationCount: 124,
    };
    const result = calculateBurnoutScore(mockMetrics);
    res.json(result);
  } catch (err) { next(err); }
});

// POST /api/burnout/metrics
router.post('/metrics', authenticate, async (req, res, next) => {
  try {
    const { screenTimeHours, appSwitches, lateNightMinutes, notificationCount } = req.body;
    if (screenTimeHours === undefined) {
      return res.status(400).json({ error: 'screenTimeHours required' });
    }
    const result = calculateBurnoutScore({ screenTimeHours, appSwitches, lateNightMinutes, notificationCount });
    // In production: save to Firestore burnout subcollection
    res.json({ ...result, savedAt: new Date().toISOString() });
  } catch (err) { next(err); }
});

// GET /api/burnout/history
router.get('/history', authenticate, async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;
    // Mock 30 days of history
    const history = Array.from({ length: days }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      const score = Math.max(20, Math.min(90, 50 + Math.sin(i * 0.4) * 20 + (Math.random() - 0.5) * 15));
      return {
        date:             d.toISOString().split('T')[0],
        score:            Math.round(score),
        screenTimeHours:  +(3 + Math.random() * 5).toFixed(1),
        appSwitches:      Math.round(50 + Math.random() * 80),
        lateNightMinutes: Math.round(Math.random() * 90),
      };
    });
    res.json({ history, days });
  } catch (err) { next(err); }
});

// GET /api/burnout/heatmap
router.get('/heatmap', authenticate, async (req, res, next) => {
  try {
    const heatmap = generateHeatmap();
    res.json({ heatmap });
  } catch (err) { next(err); }
});

// GET /api/burnout/weekly-report
router.get('/weekly-report', authenticate, async (req, res, next) => {
  try {
    res.json({
      weekAvg:          54,
      bestDay:          { day: 'Saturday', score: 28 },
      worstDay:         { day: 'Wednesday', score: 78 },
      improvementVsLast: -8,
      topInsight:       'Your burnout peaks on Wednesdays, likely due to meeting-heavy schedules.',
      recommendation:   'Block 2 focus sessions on Tuesdays to preempt Wednesday fatigue.',
    });
  } catch (err) { next(err); }
});

module.exports = router;
