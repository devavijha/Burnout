require('dotenv').config();
const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const rateLimit   = require('express-rate-limit');
const compression = require('compression');

const authRoutes      = require('./routes/auth');
const burnoutRoutes   = require('./routes/burnout');
const focusRoutes     = require('./routes/focus');
const aiRoutes        = require('./routes/ai');
const analyticsRoutes = require('./routes/analytics');
const communityRoutes = require('./routes/community');
const habitsRoutes    = require('./routes/habits');

const app  = express();
const PORT = process.env.PORT ?? 3001;

// ── Security & Middleware ───────────────────────
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rate limiting ───────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-min window
  max:      100,
  message:  { error: 'Too many requests, please try again later' },
});
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,     // 1-min window for AI routes
  max:      10,
  message:  { error: 'AI rate limit reached, please wait' },
});

app.use('/api/', apiLimiter);
app.use('/api/ai', aiLimiter);

// ── Health Check ────────────────────────────────
app.get('/health', (req, res) => res.json({
  status:    'operational',
  version:   '1.0.0',
  timestamp: new Date().toISOString(),
  service:   'ResetOS API',
}));

// ── Routes ──────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/burnout',   burnoutRoutes);
app.use('/api/focus',     focusRoutes);
app.use('/api/ai',        aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/habits',    habitsRoutes);

// ── Global Error Handler ────────────────────────
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);
  res.status(err.status ?? 500).json({
    error:   err.message ?? 'Internal Server Error',
    code:    err.code    ?? 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ── 404 Catch-all ───────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// ── Boot ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ██████╗ ███████╗███████╗███████╗████████╗ ██████╗ ███████╗
  ██╔══██╗██╔════╝██╔════╝██╔════╝╚══██╔══╝██╔═══██╗██╔════╝
  ██████╔╝█████╗  ███████╗█████╗     ██║   ██║   ██║███████╗
  ██╔══██╗██╔══╝  ╚════██║██╔══╝     ██║   ██║   ██║╚════██║
  ██║  ██║███████╗███████║███████╗   ██║   ╚██████╔╝███████║
  ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚══════╝

  Neural API v1.0.0 · Listening on port ${PORT}
  Environment: ${process.env.NODE_ENV ?? 'development'}
  `);
});

module.exports = app;
