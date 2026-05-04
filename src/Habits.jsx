import { useState } from 'react';

const defaultHabits = [
  { id: 1, name: 'Study Session', icon: '📚', streak: 0, done: false },
  { id: 2, name: 'Revise Notes', icon: '📝', streak: 0, done: false },
  { id: 3, name: 'Solve Problems', icon: '🧠', streak: 0, done: false },
  { id: 4, name: 'Take Breaks', icon: '☕', streak: 0, done: false },
];

export default function Habits({ userData, updateUserData }) {
  const habits = userData.habits?.length ? userData.habits : defaultHabits;
  const [newHabit, setNewHabit] = useState('');

  const toggleHabit = (id) => {
    const updated = habits.map(h =>
      h.id === id ? { ...h, done: !h.done, streak: !h.done ? h.streak + 1 : Math.max(0, h.streak - 1) } : h
    );
    updateUserData({ ...userData, habits: updated });
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const updated = [...habits, { id: Date.now(), name: newHabit.trim(), icon: '⭐', streak: 0, done: false }];
    updateUserData({ ...userData, habits: updated });
    setNewHabit('');
  };

  const deleteHabit = (id) => {
    updateUserData({ ...userData, habits: habits.filter(h => h.id !== id) });
  };

  const resetAll = () => {
    updateUserData({ ...userData, habits: habits.map(h => ({ ...h, done: false })) });
  };

  const doneCnt = habits.filter(h => h.done).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>🔥 Daily Habits</h3>
            <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>{doneCnt}/{habits.length} completed today</p>
          </div>
          <button onClick={resetAll} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #1e2d4a', background: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: 13 }}>
            Reset Day
          </button>
        </div>

        <div className="mastery-bar" style={{ marginBottom: 24, height: 8 }}>
          <div className="mastery-fill" style={{ width: `${habits.length ? (doneCnt / habits.length) * 100 : 0}%`, background: 'linear-gradient(90deg,#00d4ff,#7c3aed)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {habits.map(h => (
            <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderRadius: 14, background: h.done ? 'rgba(0,212,255,0.06)' : '#060d1f', border: `1px solid ${h.done ? 'rgba(0,212,255,0.3)' : '#1e2d4a'}`, transition: 'all 0.2s' }}>
              <button
                onClick={() => toggleHabit(h.id)}
                className={`habit-check ${h.done ? 'habit-check-done' : ''}`}
              >
                {h.done && <span style={{ color: 'white', fontSize: 14 }}>✓</span>}
              </button>
              <span style={{ fontSize: 22 }}>{h.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: h.done ? '#00d4ff' : '#e2e8f0', fontWeight: 600, fontSize: 15, textDecoration: h.done ? 'line-through' : 'none' }}>{h.name}</p>
                <p style={{ color: '#475569', fontSize: 12 }}>🔥 {h.streak} day streak</p>
              </div>
              <button onClick={() => deleteHabit(h.id)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <input
            className="input-field"
            placeholder="Add a new habit..."
            value={newHabit}
            onChange={e => setNewHabit(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addHabit()}
          />
          <button onClick={addHabit} className="gradient-btn" style={{ padding: '10px 20px', borderRadius: 10, border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            + Add
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 14 }}>
        {[
          { label: 'Completed Today', value: doneCnt, color: '#00d4ff' },
          { label: 'Total Habits', value: habits.length, color: '#7c3aed' },
          { label: 'Best Streak', value: Math.max(...habits.map(h => h.streak), 0) + '🔥', color: '#f59e0b' },
          { label: 'Completion', value: habits.length ? Math.round((doneCnt / habits.length) * 100) + '%' : '0%', color: '#10b981' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: 20 }}>
            <p style={{ color: '#64748b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</p>
            <p className="font-display" style={{ fontSize: 26, fontWeight: 800, color: s.color, marginTop: 4 }}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
