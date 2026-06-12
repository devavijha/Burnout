const router = require('express').Router();
const { authenticate } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, displayName, role } = req.body;
    if (!email || !password || !displayName) {
      return res.status(400).json({ error: 'email, password, displayName required' });
    }
    // In production: create Firebase Auth user, then Firestore document
    const uid = `user-${Date.now()}`;
    res.status(201).json({
      user:  { id: uid, email, displayName, role: role ?? 'other', xp: 0, level: 1, streak: 0 },
      token: 'demo-token-123',
    });
  } catch (err) { next(err); }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }
    res.json({
      user:  { id: 'demo-user', email, displayName: 'Neural User', xp: 1250, level: 3, streak: 5 },
      token: 'demo-token-123',
    });
  } catch (err) { next(err); }
});

// PATCH /api/auth/profile
router.patch('/profile', authenticate, async (req, res, next) => {
  try {
    // Update user profile in Firestore
    res.json({ message: 'Profile updated', user: { ...req.body, updatedAt: new Date() } });
  } catch (err) { next(err); }
});

// POST /api/auth/refresh
router.post('/refresh', authenticate, async (req, res) => {
  res.json({ token: 'demo-token-123', expiresAt: Date.now() + 3600000 });
});

module.exports = router;
