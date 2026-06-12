/**
 * Stub Firebase Admin — replace with real service account in production.
 * In real deployment: const admin = require('firebase-admin');
 */

const auth = {
  verifyIdToken: async (token) => {
    // In production: return admin.auth().verifyIdToken(token);
    throw new Error('Firebase Admin not configured');
  },
};

const db = {
  collection: (path) => ({
    doc: (id) => ({
      get:    async () => ({ exists: false, data: () => null }),
      set:    async (data) => {},
      update: async (data) => {},
    }),
    add: async (data) => ({ id: Date.now().toString() }),
    where:   () => ({ get: async () => ({ docs: [] }) }),
    orderBy: () => ({ limit: () => ({ get: async () => ({ docs: [] }) }) }),
  }),
};

module.exports = { auth, db };
