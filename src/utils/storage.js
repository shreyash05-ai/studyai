import { DEFAULT_SUBJECTS } from './constants';

// ─── STORAGE HELPERS ──────────────────────────────────────────────────────────

const storage = {
  get: (key, def) => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : def;
    } catch {
      return def;
    }
  },
  set: (key, val) => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  },
};

export const getAdmins = () => storage.get('studyai_admins', []);
export const setAdmins = (a) => storage.set('studyai_admins', a);
export const getStudents = () => storage.get('studyai_students', []);
export const setStudents = (s) => storage.set('studyai_students', s);
export const getUserData = (email) => storage.get(`studyai_data_${email}`, null);
export const setUserData = (email, data) => storage.set(`studyai_data_${email}`, data);

export const createFreshUserData = (mode = 'student') => ({
  sessions: [],
  concepts: [],
  habits: [],
  goals: { dailyHours: 3, weeklyTarget: 21 },
  // Each user gets their own customizable subjects list
  customSubjects: [...DEFAULT_SUBJECTS[mode || 'student']],
});
