import { Clock, Flame, Brain, TrendingUp, Calendar } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { StatCard, Heatmap } from './components/SharedUI';
import { DEFAULT_SUBJECTS } from './utils/constants';

export default function Dashboard({ user, userData, onUpgrade }) {
  const sessions = userData.sessions || [];
  const concepts = userData.concepts || [];
  const dailyGoal = user.dailyGoal || 3;
  const isInterviewMode = user.studyMode === 'interview';

  const thisWeekSessions = sessions.filter(s => new Date(s.date) >= new Date(Date.now() - 7 * 86400000));
  const weekHours = thisWeekSessions.reduce((a, s) => a + s.duration / 60, 0);

  const streak = (() => {
    if (!sessions.length) return 0;
    const dates = [...new Set(sessions.map(s => s.date))].sort().reverse();
    let count = 0;
    let check = new Date().toISOString().split('T')[0];
    for (const d of dates) {
      if (d === check) { count++; const dt = new Date(check); dt.setDate(dt.getDate() - 1); check = dt.toISOString().split('T')[0]; }
      else break;
    }
    return count;
  })();

  const avgScore = concepts.length ? Math.round(concepts.reduce((a, c) => a + c.mastery, 0) / concepts.length) : 0;
  const predictedScore = concepts.length ? Math.min(99, Math.round(avgScore + weekHours * 1.2)) : 0;
  const weakAreas = concepts.filter(c => c.mastery < 60).sort((a, b) => a.mastery - b.mastery);

  const weeklyChartData = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => {
    const now = new Date();
    const diff = i - (now.getDay() === 0 ? 6 : now.getDay() - 1);
    const d = new Date(now); d.setDate(now.getDate() + diff);
    const ds = d.toISOString().split('T')[0];
    const hours = sessions.filter(s => s.date === ds).reduce((a, s) => a + s.duration / 60, 0);
    return { day, hours: parseFloat(hours.toFixed(1)), target: dailyGoal };
  });

  const subjects = userData.customSubjects || DEFAULT_SUBJECTS[user.studyMode || 'student'];
  const radarData = subjects.slice(0, 6).map(subject => {
    const sub = concepts.filter(c => c.subject === subject);
    const avg = sub.length ? Math.round(sub.reduce((a, c) => a + c.mastery, 0) / sub.length) : 0;
    return { subject: subject.length > 12 ? subject.substring(0, 12) + '...' : subject, A: avg, fullMark: 100 };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {!user.isPremium && (
        <div style={{ padding: '14px 20px', borderRadius: 14, background: 'linear-gradient(135deg,rgba(245,158,11,0.15),rgba(239,68,68,0.1))', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span style={{ color: '#f59e0b', fontWeight: 700 }}>⏳ {user.trialDays} days left in your free trial</span>
            <p style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>Upgrade to keep all data and unlimited AI features</p>
          </div>
          <button onClick={() => onUpgrade('monthly')} className="gradient-btn" style={{ padding: '8px 20px', borderRadius: 10, border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Upgrade Now ⚡</button>
        </div>
      )}

      {sessions.length === 0 && (
        <div style={{ padding: 24, borderRadius: 16, border: '2px dashed #1e2d4a', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{isInterviewMode ? '💼' : '📚'}</div>
          <h3 className="font-display" style={{ color: 'white', fontWeight: 700, marginBottom: 8 }}>Welcome, {user.name}! Let's get started.</h3>
          <p style={{ color: '#64748b', fontSize: 14 }}>{isInterviewMode ? 'Log your first prep session to see your progress here.' : 'Log your first study session to see your dashboard come alive!'}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 14 }}>
        <StatCard icon={<Clock size={20} />} label="Hours This Week" value={`${weekHours.toFixed(1)}h`} sub={`Target: ${(user.dailyGoal || 3) * 7}h/week`} color="#00d4ff" />
        <StatCard icon={<Flame size={20} />} label="Study Streak" value={streak > 0 ? `${streak}🔥` : '0'} sub="Days in a row" color="#f59e0b" />
        <StatCard icon={<Brain size={20} />} label={isInterviewMode ? "Topics Logged" : "Concepts Logged"} value={concepts.length} sub={`${weakAreas.length} need review`} color="#7c3aed" />
        <StatCard icon={<TrendingUp size={20} />} label={isInterviewMode ? "Interview Readiness" : "Predicted Score"} value={concepts.length ? `${predictedScore}%` : 'N/A'} sub="Based on performance" color="#10b981" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 16 }}>📈 Daily Study Hours</h3>
          {sessions.length === 0 ? (
            <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: 14 }}>Log sessions to see chart</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={weeklyChartData}>
                <defs>
                  <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
                <XAxis dataKey="day" stroke="#475569" tick={{ fontSize: 12 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#0d1629', border: '1px solid #1e2d4a', borderRadius: 10, color: 'white' }} />
                <Area type="monotone" dataKey="target" stroke="#1e2d4a" fill="none" strokeDasharray="4 4" name="Target" />
                <Area type="monotone" dataKey="hours" stroke="#00d4ff" fill="url(#hg)" strokeWidth={2} name="Actual" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 16 }}>🎯 {isInterviewMode ? 'Topic Mastery' : 'Subject Mastery'}</h3>
          {concepts.length === 0 ? (
            <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: 14 }}>Add concepts to see radar</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e2d4a" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#475569', fontSize: 9 }} />
                <Radar name="Mastery" dataKey="A" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.3} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 16 }}>📅 Study Heatmap (Last 12 Weeks)</h3>
        <Heatmap sessions={sessions} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 16 }}>⚠️ {isInterviewMode ? 'Weak Topics' : 'Weak Areas'}</h3>
          {weakAreas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
              <p style={{ color: '#64748b' }}>{concepts.length === 0 ? 'Add concepts to track weakness' : 'All concepts well covered!'}</p>
            </div>
          ) : weakAreas.slice(0, 4).map(c => (
            <div key={c.id} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: '#94a3b8', fontSize: 13 }}>{c.title}</span>
                <span style={{ color: c.mastery < 40 ? '#ef4444' : '#f59e0b', fontSize: 13, fontWeight: 700 }}>{c.mastery}%</span>
              </div>
              <div className="mastery-bar">
                <div className="mastery-fill" style={{ width: `${c.mastery}%`, background: c.mastery < 40 ? '#ef4444' : '#f59e0b' }} />
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 16 }}>
            {isInterviewMode ? '💼 Interview Countdown' : '🎓 Exam Countdown'}
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#00d4ff' }} className="font-display">
              {Math.max(0, Math.round((new Date(user.examDate) - new Date()) / 86400000))}
            </div>
            <p style={{ color: '#64748b', marginBottom: 16 }}>days until {user.examName}</p>
            <div style={{ padding: 16, borderRadius: 12, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <p style={{ color: '#e2e8f0', fontSize: 13, lineHeight: 1.6 }}>
                {sessions.length === 0
                  ? `Start logging your ${isInterviewMode ? 'prep' : 'study'} sessions to get AI-powered insights!`
                  : `At ${(weekHours / 7).toFixed(1)}h/day pace — target ${dailyGoal}h/day to maximize your ${isInterviewMode ? 'readiness' : 'score'}.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
