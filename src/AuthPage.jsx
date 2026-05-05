import { useState } from 'react';
import { Brain, Shield, AlertCircle } from 'lucide-react';
import { ADMIN_SECRET_KEY, STUDY_MODES } from './utils/constants';
import { getUser, saveUser, setUserData, createFreshUserData } from './utils/storage';

export default function AuthPage({ mode, onAuth, onSwitch, onBack }) {
  const isAdminLogin = mode === 'admin-login';
  const isAdminRegister = mode === 'admin-register';
  const isRegister = mode === 'register' || mode === 'register-interview' || isAdminRegister;
  const isInterview = mode === 'register-interview';

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', secretKey: '',
    studyMode: isInterview ? 'interview' : 'student',
    examName: isInterview ? 'Software Engineer (FAANG)' : 'JEE Main',
    examDate: '2026-11-15', dailyGoal: '3'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleSubmit = async () => {
    setError('');
    if (!form.email || !form.password) { setError('Email and password are required'); return; }
    if (isRegister && !form.name) { setError('Name is required'); return; }
    if (isRegister && form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (isRegister && form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (isAdminRegister && form.secretKey !== ADMIN_SECRET_KEY) { setError('❌ Invalid secret key.'); return; }

    setLoading(true);
    const email = form.email.toLowerCase();

    try {
      if (isRegister) {
        const existing = await getUser(email);
        if (existing) { setError('An account with this email already exists.'); setLoading(false); return; }

        const newUser = {
          name: form.name, email, password: form.password,
          isAdmin: isAdminRegister,
          isPremium: isAdminRegister,
          plan: isAdminRegister ? 'admin' : null,
          trialDays: isAdminRegister ? 9999 : 10,
          studyMode: form.studyMode,
          examName: form.examName,
          examDate: form.examDate,
          dailyGoal: parseInt(form.dailyGoal) || 3,
          registeredAt: new Date().toISOString()
        };
        await saveUser(newUser);
        await setUserData(email, createFreshUserData(form.studyMode));
        onAuth(newUser);
      } else {
        const user = await getUser(email);
        if (!user || user.password !== form.password) {
          setError('Invalid email or password.');
          setLoading(false);
          return;
        }
        if (isAdminLogin && !user.isAdmin) {
          setError('Not an admin account.');
          setLoading(false);
          return;
        }
        onAuth(user);
      }
    } catch (e) {
      setError('Something went wrong. Please try again.');
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#04091a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>← Back to Home</button>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isAdminLogin || isAdminRegister ? 'linear-gradient(135deg,#ff0080,#7c3aed)' : 'linear-gradient(135deg,#00d4ff,#7c3aed)', margin: '0 auto 16px' }}>
            {isAdminLogin || isAdminRegister ? <Shield size={26} color="white" /> : <Brain size={26} color="white" />}
          </div>
          <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: 'white' }}>
            {isAdminLogin ? '🛡️ Admin Login' : isAdminRegister ? '🛡️ Admin Registration' : isRegister ? 'Start Your Journey' : 'Welcome Back'}
          </h1>
          <p style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>
            {isAdminLogin ? 'Sign in with admin credentials' : isAdminRegister ? 'Register with secret key' : isRegister ? '10 days free · No credit card needed' : 'Sign in to continue'}
          </p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={16} color="#ef4444" />
                <span style={{ color: '#ef4444', fontSize: 13 }}>{error}</span>
              </div>
            )}

            {isRegister && (
              <div>
                <label style={{ color: '#64748b', fontSize: 12, marginBottom: 8, display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>I'm preparing for</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {Object.entries(STUDY_MODES).map(([key, cfg]) => (
                    <button key={key} onClick={() => { set('studyMode', key); set('examName', cfg.exams[0]); }}
                      style={{ padding: '12px', borderRadius: 12, border: `2px solid ${form.studyMode === key ? cfg.color : '#1e2d4a'}`, background: form.studyMode === key ? `${cfg.color}15` : 'transparent', cursor: 'pointer', textAlign: 'center' }}>
                      <div style={{ fontSize: 24, marginBottom: 4 }}>{cfg.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: form.studyMode === key ? cfg.color : '#64748b' }}>{cfg.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isRegister && <input className="input-field" placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} />}
            <input className="input-field" placeholder="Email address" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
            <input className="input-field" placeholder="Password (min 6 chars)" type="password" value={form.password} onChange={e => set('password', e.target.value)} />
            {isRegister && <input className="input-field" placeholder="Confirm Password" type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} />}

            {isAdminRegister && (
              <div>
                <label style={{ color: '#64748b', fontSize: 12, marginBottom: 6, display: 'block', fontWeight: 700 }}>🔑 Admin Secret Key</label>
                <input className="input-field" placeholder="Enter secret key" type="password" value={form.secretKey} onChange={e => set('secretKey', e.target.value)} />
              </div>
            )}

            {isRegister && (
              <>
                <div>
                  <label style={{ color: '#64748b', fontSize: 12, marginBottom: 6, display: 'block', fontWeight: 700 }}>{form.studyMode === 'interview' ? 'Target Role' : 'Target Exam'}</label>
                  <select className="input-field" value={form.examName} onChange={e => set('examName', e.target.value)}>
                    {STUDY_MODES[form.studyMode].exams.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ color: '#64748b', fontSize: 12, marginBottom: 6, display: 'block', fontWeight: 700 }}>{form.studyMode === 'interview' ? 'Target Date' : 'Exam Date'}</label>
                  <input className="input-field" type="date" value={form.examDate} onChange={e => set('examDate', e.target.value)} />
                </div>
                <div>
                  <label style={{ color: '#64748b', fontSize: 12, marginBottom: 6, display: 'block', fontWeight: 700 }}>Daily Study Goal</label>
                  <select className="input-field" value={form.dailyGoal} onChange={e => set('dailyGoal', e.target.value)}>
                    {['1','2','3','4','5','6','7','8'].map(h => <option key={h} value={h}>{h} hour{h !== '1' ? 's' : ''}/day</option>)}
                  </select>
                </div>
              </>
            )}

            <button onClick={handleSubmit} disabled={loading} className="gradient-btn"
              style={{ padding: 13, borderRadius: 12, border: 'none', color: 'white', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1 }}>
              {loading ? '⏳ Please wait...' : isAdminLogin ? '🛡️ Sign In as Admin →' : isAdminRegister ? '🛡️ Register as Admin →' : isRegister ? 'Create Account & Start Free →' : 'Sign In →'}
            </button>
          </div>

          <div style={{ marginTop: 20, borderTop: '1px solid #1e2d4a', paddingTop: 16, textAlign: 'center' }}>
            {!isAdminLogin && !isAdminRegister && (
              <p style={{ color: '#64748b', fontSize: 14 }}>
                {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                <button onClick={() => onSwitch(isRegister ? 'login' : 'register')} style={{ color: '#00d4ff', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                  {isRegister ? 'Sign in' : 'Start free trial'}
                </button>
              </p>
            )}
            {isAdminLogin && (
              <p style={{ color: '#64748b', fontSize: 14 }}>
                New admin? <button onClick={() => onSwitch('admin-register')} style={{ color: '#ff0080', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Register with secret key</button>
              </p>
            )}
            {isAdminRegister && (
              <p style={{ color: '#64748b', fontSize: 14 }}>
                Already an admin? <button onClick={() => onSwitch('admin-login')} style={{ color: '#ff0080', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Sign In</button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
