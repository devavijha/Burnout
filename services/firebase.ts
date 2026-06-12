import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { FIREBASE_CONFIG } from '@/constants/config';

// Initialize Firebase (once)
const app = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApps()[0];
export const auth = getAuth(app);
export const db   = getFirestore(app);

// ────────────────────────────────────────────────
// Auth helpers
// ────────────────────────────────────────────────
export const firebaseSignIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const firebaseRegister = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const firebaseSignOut = () => signOut(auth);

export const onUserChange = (cb: (user: FirebaseUser | null) => void) =>
  onAuthStateChanged(auth, cb);

// ────────────────────────────────────────────────
// User document
// ────────────────────────────────────────────────
export const createUserDoc = async (uid: string, data: Record<string, unknown>) => {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

export const getUserDoc = async (uid: string) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
};

export const updateUserDoc = async (uid: string, data: Record<string, unknown>) => {
  await updateDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

// ────────────────────────────────────────────────
// Burnout metrics
// ────────────────────────────────────────────────
export const saveBurnoutEntry = async (uid: string, entry: Record<string, unknown>) => {
  const ref = doc(collection(db, 'users', uid, 'burnout'));
  await setDoc(ref, { ...entry, savedAt: Timestamp.now() });
};

export const getBurnoutHistory = async (uid: string, days = 30) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const q = query(
    collection(db, 'users', uid, 'burnout'),
    where('savedAt', '>=', Timestamp.fromDate(cutoff)),
    orderBy('savedAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ────────────────────────────────────────────────
// Focus sessions
// ────────────────────────────────────────────────
export const saveFocusSession = async (uid: string, session: Record<string, unknown>) => {
  const ref = doc(collection(db, 'users', uid, 'focus_sessions'));
  await setDoc(ref, { ...session, savedAt: Timestamp.now() });
};

export const getRecentSessions = async (uid: string, count = 10) => {
  const q = query(
    collection(db, 'users', uid, 'focus_sessions'),
    orderBy('savedAt', 'desc'),
    limit(count),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
