const jwt          = require('jsonwebtoken');
const { auth, db } = require('../config/firebase-admin');

/**
 * Middleware: Verify Firebase ID token or custom JWT.
 */
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // Demo bypass for prototype (remove in production)
    if (token === 'demo-token-123') {
      req.user = { uid: 'demo-user', email: 'user@resetos.app', role: 'developer' };
      return next();
    }

    // Verify Firebase ID token
    const decoded = await auth.verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token', code: 'AUTH_INVALID' });
  }
};

/**
 * Optional auth — sets req.user if token present, continues without it too.
 */
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return next();
  try {
    const token  = authHeader.split(' ')[1];
    if (token === 'demo-token-123') {
      req.user = { uid: 'demo-user' };
    } else {
      req.user = await auth.verifyIdToken(token);
    }
  } catch {}
  next();
};

module.exports = { authenticate, optionalAuth };
