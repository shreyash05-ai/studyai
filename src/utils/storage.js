import { db } from './firebase';
import { doc, getDoc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { DEFAULT_SUBJECTS } from './constants';

export const createFreshUserData = (mode = 'student') => ({
  sessions: [],
  concepts: [],
  habits: [],
  goals: { dailyHours: 3, weeklyTarget: 21 },
  customSubjects: [...DEFAULT_SUBJECTS[mode || 'student']],
});

export const getUser = async (email) => {
  const snap = await getDoc(doc(db, 'users', email));
  return snap.exists() ? snap.data() : null;
};

export const saveUser = async (user) => {
  await setDoc(doc(db, 'users', user.email), user);
};

export const getAdmins = async () => {
  const snap = await getDocs(query(collection(db, 'users'), where('isAdmin', '==', true)));
  return snap.docs.map(d => d.data());
};

export const getStudents = async () => {
  const snap = await getDocs(query(collection(db, 'users'), where('isAdmin', '==', false)));
  return snap.docs.map(d => d.data());
};

export const getUserData = async (email) => {
  const snap = await getDoc(doc(db, 'userData', email));
  return snap.exists() ? snap.data() : null;
};

export const setUserData = async (email, data) => {
  await setDoc(doc(db, 'userData', email), data);
};

// kept for compatibility
export const setAdmins = async () => {};
export const setStudents = async () => {};
