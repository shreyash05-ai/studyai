import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SubjectManager } from './components/SharedUI';
import { fmt } from './utils/ai';

export default function StudyTracker({ user, userData, updateUserData }) {
  const sessions = userData.sessions || [];
  const subjects = userData.customSubjects || [];
  const isInterview = user.studyMode === 'interview';

  const [timerSec, setTimerSec] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('focus');
  const [form, setForm] = useState({ subject: subjects[0] || '', duration: 60, focusScore: 4, notes: '' });
  const timerRef = useRef(null);

  const modes = { focus: [25 * 60, 'Focus'], short: [5 * 60, 'Short Break'], long: [15 * 60, 'Long Break'] };

  useEffect(() => {
    if (running) timerRef.current = setInterval(() => setTimerSec(s => s > 0 ? s - 1 : 0), 1000);
    else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [running]);

  const switchMode = m => { setTimerMode(m); setTimerSec(modes[m][0]); setRunning(false); };
  const pct = (1 - timerSec / modes[timerMode][0]) * 100;

  const updateSubjects = (newSubjects) => {
    updateUserData({ ...userData, customSubjects: newSubjects });
    if (!newSubjects.includes(form.subject)) {
      setForm(f => ({ ...f, subject: newSubjects[0] || '' }));
    }
  };

  const logSession = () => {
    if (!form.subject || form.duration < 1) return;
    updateUserData({
      ...userData,
      sessions: [...sessions, { id: Date.now(), date: new Date().toISOString().split('T')[0], ...form }]
    });
    setForm({ subject: subjects[0] || '', duration: 60, focusScore: 4, notes: '' });
  };

  const weeklyBarData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
    const now = new Date();
    const diff = i - (now.getDay() === 0 ? 6 : now.getDay() - 1);
    const d = new Date(now); d.setDate(now.getDate() + diff);
    const ds = d.toISOString().split('T')[0];
    const hours = sessions.filter(s => s.date === ds).reduce((a, s) => a + s.duration / 60, 0);
    return { day, hours: parseFloat(hours.toFixed(1)), target: user.dailyGoal || 3 };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Pomodoro Timer */}
      <div className="card" style={{ padding: 28, textAlign: 'center' }}>
        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 20 }}>⏱️ Pomodoro Timer</h2>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 28, flexWrap: 'wrap' }}>
          {Object.entries(modes).map(([k, [, l]]) => (
            <button key={k} onClick={() => switchMode(k)} className={`tab-btn ${timerMode === k ? 'tab-active' : 'tab-inactive'}`}>{l}</button>
          ))}
        </div>
        <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 28px' }}>
          <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="100" cy="100" r="90" fill="none" stroke="#1e2d4a" strokeWidth="10" />
            <circle cx="100" cy="100" r="90" fill="none" stroke="url(#tg)" strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 90}`} strokeDashoffset={`${2 * Math.PI * 90 * (1 - pct / 100)}`}
              strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s' }} />
            <defs>
              <linearGradient id="tg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00d4ff" /><stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span className="font-display" style={{ fontSize: 42, fontWeight: 900, color: 'white' }}>{fmt(timerSec)}</span>
            <span style={{ color: '#64748b', fontSize: 13 }}>{modes[timerMode][1]}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => setRunning(r => !r)} className="gradient-btn" style={{ padding: '12px 28px', borderRadius: 12, border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 16 }}>
            {running ? <><Pause size={18} style={{ display: 'inline', marginRight: 6 }} />Pause</> : <><Play size={18} style={{ display: 'inline', marginRight: 6 }} />Start</>}
          </button>
          <button onClick={() => { setRunning(false); setTimerSec(modes[timerMode][0]); }} style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #1e2d4a', background: 'transparent', color: '#64748b', cursor: 'pointer' }}>
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Log Session */}
      <div className="card" style={{ padding: 24 }}>
        <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 18 }}>
          📝 Log {isInterview ? 'Prep' : 'Study'} Session
        </h3>

        {/* Subject Manager */}
        <SubjectManager subjects={subjects} onUpdate={updateSubjects} isInterview={isInterview} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ color: '#64748b', fontSize: 12, marginBottom: 6, display: 'block', fontWeight: 700 }}>
              {isInterview ? 'Topic / Skill' : 'Subject'}
            </label>
            <select className="input-field" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
              {subjects.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ color: '#64748b', fontSize: 12, marginBottom: 6, display: 'block', fontWeight: 700 }}>Duration (minutes)</label>
            <input className="input-field" type="number" value={form.duration} onChange={e => setForm({ ...form, duration: +e.target.value })} min={1} />
          </div>
          <div>
            <label style={{ color: '#64748b', fontSize: 12, marginBottom: 6, display: 'block', fontWeight: 700 }}>Focus Score</label>
            <select className="input-field" value={form.focusScore} onChange={e => setForm({ ...form, focusScore: +e.target.value })}>
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} ⭐ {n === 5 ? '(Deep Focus)' : n === 1 ? '(Distracted)' : ''}</option>)}
            </select>
          </div>
        </div>
        <input className="input-field" placeholder="Notes (topics covered, problems solved...)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ marginBottom: 14 }} />
        <button onClick={logSession} className="gradient-btn" style={{ padding: '10px 24px', borderRadius: 10, border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
          <Plus size={16} style={{ display: 'inline', marginRight: 6 }} /> Log Session
        </button>
      </div>

      {/* Session History */}
      {sessions.length > 0 && (
        <div className="card" style={{ padding: 24 }}>
          <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 16 }}>📋 Session History</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1e2d4a' }}>
                  {['Date', 'Subject', 'Duration', 'Focus', 'Notes'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...sessions].reverse().slice(0, 10).map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #0d1e35' }}>
                    <td style={{ padding: '10px 12px', color: '#94a3b8', fontSize: 13 }}>{s.date}</td>
                    <td style={{ padding: '10px 12px', color: '#00d4ff', fontSize: 13, fontWeight: 600 }}>{s.subject}</td>
                    <td style={{ padding: '10px 12px', color: '#e2e8f0', fontSize: 13 }}>{s.duration}m</td>
                    <td style={{ padding: '10px 12px', fontSize: 13 }}>{'⭐'.repeat(s.focusScore)}</td>
                    <td style={{ padding: '10px 12px', color: '#64748b', fontSize: 13 }}>{s.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Weekly Chart */}
      {sessions.length > 0 && (
        <div className="card" style={{ padding: 20 }}>
          <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 16 }}>📊 This Week's Progress</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
              <XAxis dataKey="day" stroke="#475569" tick={{ fontSize: 12 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#0d1629', border: '1px solid #1e2d4a', borderRadius: 10, color: 'white' }} />
              <Bar dataKey="target" fill="#1e2d4a" radius={[4, 4, 0, 0]} name="Target" />
              <Bar dataKey="hours" fill="#00d4ff" radius={[4, 4, 0, 0]} name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
