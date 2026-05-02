import { useState } from 'react';
import { Clock, Target, TrendingUp, Calendar } from 'lucide-react';
import { StatCard } from './components/SharedUI';
import { STUDY_MODES } from './utils/constants';
import { getAdmins, setAdmins, getStudents, setStudents } from './utils/storage';

export default function GoalsPage({ user, userData, updateUserData, setUser }) {
  const [dailyGoal, setDailyGoal] = useState(user.dailyGoal || 3);
  const [examName, setExamName] = useState(user.examName || '');
  const [examDate, setExamDate] = useState(user.examDate || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const updatedUser = { ...user, dailyGoal: parseInt(dailyGoal), examName, examDate };
    setUser(updatedUser);
    const allUsers = user.isAdmin ? getAdmins() : getStudents();
    const updated = allUsers.map(u =>
      u.email === user.email ? { ...u, dailyGoal: parseInt(dailyGoal), examName, examDate } : u
    );
    if (user.isAdmin) setAdmins(updated); else setStudents(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const isInterview = user.studyMode === 'interview';
  const sessions = userData.sessions || [];
  const totalHours = sessions.reduce((a, s) => a + s.duration / 60, 0);
  const daysLeft = Math.max(0, Math.round((new Date(examDate) - new Date()) / 86400000));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="card" style={{ padding: 24 }}>
        <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 20 }}>
          🎯 {isInterview ? 'Interview Goals' : 'Study Goals'}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ color: '#64748b', fontSize: 12, marginBottom: 6, display: 'block', fontWeight: 700 }}>
              {isInterview ? 'Target Role / Interview' : 'Target Exam'}
            </label>
            <select className="input-field" value={examName} onChange={e => setExamName(e.target.value)}>
              {STUDY_MODES[user.studyMode || 'student'].exams.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label style={{ color: '#64748b', fontSize: 12, marginBottom: 6, display: 'block', fontWeight: 700 }}>
              {isInterview ? 'Target Interview Date' : 'Exam Date'}
            </label>
            <input className="input-field" type="date" value={examDate} onChange={e => setExamDate(e.target.value)} />
          </div>
          <div>
            <label style={{ color: '#64748b', fontSize: 12, marginBottom: 6, display: 'block', fontWeight: 700 }}>
              Daily Study Goal (hours): {dailyGoal}h
            </label>
            <input
              type="range" min={1} max={12} value={dailyGoal}
              onChange={e => setDailyGoal(e.target.value)}
              style={{ width: '100%', accentColor: '#00d4ff' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: 12, marginTop: 4 }}>
              <span>1h</span><span>6h</span><span>12h</span>
            </div>
          </div>
          <button onClick={handleSave} className="gradient-btn" style={{ padding: '11px 24px', borderRadius: 12, border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
            {saved ? '✅ Saved!' : 'Save Goals'}
          </button>
        </div>
      </div>

      {daysLeft > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
          <StatCard icon={<Calendar size={20} />} label="Days Left" value={daysLeft} sub={`Until ${examName}`} color="#00d4ff" />
          <StatCard icon={<Clock size={20} />} label="Hours Needed" value={`${daysLeft * dailyGoal}h`} sub={`At ${dailyGoal}h/day`} color="#7c3aed" />
          <StatCard icon={<TrendingUp size={20} />} label="Hours Logged" value={`${totalHours.toFixed(1)}h`} sub="Total so far" color="#10b981" />
          <StatCard icon={<Target size={20} />} label="Daily Target" value={`${dailyGoal}h`} sub="Your daily goal" color="#f59e0b" />
        </div>
      )}
    </div>
  );
}
