/**
 * ResetOS — Firestore Database Schema
 * =====================================
 *
 * Collection hierarchy (NoSQL document model):
 *
 * /users/{uid}
 * /users/{uid}/burnout/{entryId}
 * /users/{uid}/focus_sessions/{sessionId}
 * /users/{uid}/habits/{habitId}
 * /users/{uid}/habit_logs/{logId}
 * /users/{uid}/sleep/{entryId}
 * /users/{uid}/chat_messages/{msgId}
 * /challenges/{challengeId}
 * /challenge_participants/{uid_challengeId}
 * /leaderboards/{challengeId}_{period}
 */

// ── User Document ────────────────────────────────
const UserSchema = {
  // Identity
  uid:             'string',          // Firebase Auth UID
  email:           'string',
  displayName:     'string',
  avatar:          'string | null',
  role:            'student | developer | remote-worker | creator | other',
  timezone:        'string',          // IANA timezone, e.g. "America/New_York"

  // Onboarding state
  isOnboarded:     'boolean',
  assessmentScore: 'number',          // Initial burnout assessment result
  permissionsGranted: 'string[]',     // ['notifications', 'screenTime', ...]

  // Gamification
  xp:              'number',
  level:           'number',
  streak:          'number',          // consecutive active days
  longestStreak:   'number',
  achievements:    'string[]',        // achievement IDs

  // Preferences
  theme:           'dark | neural',
  accentColor:     'string',          // hex color
  notificationsEnabled: 'boolean',
  soundEnabled:    'boolean',

  // Metadata
  createdAt:       'Timestamp',
  updatedAt:       'Timestamp',
  lastActiveAt:    'Timestamp',
};

// ── Burnout Entry ────────────────────────────────
const BurnoutEntrySchema = {
  uid:                 'string',
  date:                'string',     // YYYY-MM-DD
  score:               'number',     // 0–100

  // Raw inputs
  screenTimeHours:     'number',
  appSwitches:         'number',
  lateNightMinutes:    'number',
  notificationCount:   'number',
  consistencyFactor:   'number',

  // Computed dimensions
  dimensions: {
    screenTime:       'number',
    appSwitching:     'number',
    lateNightUsage:   'number',
    notificationLoad: 'number',
    usageConsistency: 'number',
  },

  level:              'string',      // Optimal | Moderate | High Risk | Critical
  recommendation:     'string',
  savedAt:            'Timestamp',
};

// ── Focus Session ─────────────────────────────────
const FocusSessionSchema = {
  uid:               'string',
  type:              'quick | deep | flow | custom',
  durationMinutes:   'number',       // target
  completedMinutes:  'number',       // actual
  status:            'active | completed | interrupted',
  ambientSound:      'string',
  appBlockEnabled:   'boolean',
  xpEarned:          'number',
  startedAt:         'Timestamp',
  endedAt:           'Timestamp | null',
  savedAt:           'Timestamp',
};

// ── Habit ────────────────────────────────────────
const HabitSchema = {
  uid:         'string',
  name:        'string',
  icon:        'string',             // emoji
  description: 'string',
  frequency:   'daily | weekdays | custom',
  color:       'string',             // hex
  createdAt:   'Timestamp',
};

// ── Habit Log ────────────────────────────────────
const HabitLogSchema = {
  uid:       'string',
  habitId:   'string',
  date:      'string',              // YYYY-MM-DD
  completed: 'boolean',
  value:     'number | null',       // for quantitative habits
  loggedAt:  'Timestamp',
};

// ── Sleep Entry ──────────────────────────────────
const SleepEntrySchema = {
  uid:       'string',
  date:      'string',              // YYYY-MM-DD
  hours:     'number',
  quality:   'number',              // 0-100
  bedtime:   'string',              // HH:mm
  wakeTime:  'string',              // HH:mm
  notes:     'string | null',
  loggedAt:  'Timestamp',
};

// ── Chat Message ─────────────────────────────────
const ChatMessageSchema = {
  uid:       'string',
  role:      'user | assistant',
  content:   'string',
  model:     'string | null',       // 'gpt-4o-mini'
  tokens:    'number | null',
  timestamp: 'Timestamp',
};

// ── Challenge ────────────────────────────────────
const ChallengeSchema = {
  id:           'string',
  title:        'string',
  description:  'string',
  type:         'detox | focus | recovery | streak',
  durationDays: 'number',
  startDate:    'string',
  endDate:      'string',
  maxParticipants: 'number | null',
  reward:       'string',
  isActive:     'boolean',
  createdAt:    'Timestamp',
};

// ── Challenge Participant ─────────────────────────
const ChallengeParticipantSchema = {
  uid:          'string',
  challengeId:  'string',
  joinedAt:     'Timestamp',
  score:        'number',           // 0-100 completion percent
  rank:         'number | null',
  isCompleted:  'boolean',
  completedAt:  'Timestamp | null',
};

// ── Firestore Security Rules ─────────────────────
const SECURITY_RULES = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read/write their own data
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;

      match /burnout/{entryId} {
        allow read, write: if request.auth.uid == uid;
      }
      match /focus_sessions/{sessionId} {
        allow read, write: if request.auth.uid == uid;
      }
      match /habits/{habitId} {
        allow read, write: if request.auth.uid == uid;
      }
      match /habit_logs/{logId} {
        allow read, write: if request.auth.uid == uid;
      }
      match /sleep/{entryId} {
        allow read, write: if request.auth.uid == uid;
      }
      match /chat_messages/{msgId} {
        allow read, write: if request.auth.uid == uid;
      }
    }

    // Challenges are public to read
    match /challenges/{challengeId} {
      allow read: if request.auth != null;
      allow write: if false; // admin only
    }

    // Participants managed by authenticated users
    match /challenge_participants/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == resource.data.uid;
    }
  }
}`;

// ── Firestore Indexes (firestore.indexes.json) ───
const INDEXES = {
  indexes: [
    {
      collectionGroup: 'burnout',
      fields: [
        { fieldPath: 'uid',     order: 'ASCENDING' },
        { fieldPath: 'savedAt', order: 'DESCENDING' },
      ],
    },
    {
      collectionGroup: 'focus_sessions',
      fields: [
        { fieldPath: 'uid',      order: 'ASCENDING' },
        { fieldPath: 'savedAt',  order: 'DESCENDING' },
      ],
    },
    {
      collectionGroup: 'sleep',
      fields: [
        { fieldPath: 'uid',      order: 'ASCENDING' },
        { fieldPath: 'date',     order: 'DESCENDING' },
      ],
    },
    {
      collectionGroup: 'habit_logs',
      fields: [
        { fieldPath: 'uid',      order: 'ASCENDING' },
        { fieldPath: 'habitId',  order: 'ASCENDING' },
        { fieldPath: 'date',     order: 'DESCENDING' },
      ],
    },
  ],
  fieldOverrides: [],
};

module.exports = {
  UserSchema,
  BurnoutEntrySchema,
  FocusSessionSchema,
  HabitSchema,
  HabitLogSchema,
  SleepEntrySchema,
  ChatMessageSchema,
  ChallengeSchema,
  SECURITY_RULES,
  INDEXES,
};
