import { Plus, X, Settings } from 'lucide-react';
import { useState } from 'react';

// ─── STAT CARD ────────────────────────────────────────────────────────────────
export const StatCard = ({ icon, label, value, sub, color = "#00d4ff" }) => (
  <div className="card card-hover" style={{ padding: 20, cursor: 'default' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</p>
        <p className="font-display" style={{ fontSize: 26, fontWeight: 800, color, marginTop: 4 }}>{value}</p>
        {sub && <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{sub}</p>}
      </div>
      <div style={{ padding: 10, borderRadius: 12, backgroundColor: `${color}18` }}>
        <span style={{ color, display: 'block' }}>{icon}</span>
      </div>
    </div>
  </div>
);

// ─── HEATMAP ──────────────────────────────────────────────────────────────────
export const Heatmap = ({ sessions }) => {
  const days = [];
  const today = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    const s = sessions.find(x => x.date === ds);
    days.push({ date: ds, hours: s ? s.duration / 60 : 0 });
  }
  const getColor = h => h === 0 ? '#0d1629' : h < 1 ? '#164e63' : h < 2 ? '#0891b2' : h < 3 ? '#06b6d4' : '#00d4ff';

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: '3px' }}>
        {days.map((d, i) => (
          <div key={i} title={`${d.date}: ${d.hours.toFixed(1)}h`}
            style={{ width: '100%', paddingBottom: '100%', borderRadius: 3, backgroundColor: getColor(d.hours), cursor: 'pointer', transition: 'transform 0.1s' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.3)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#64748b' }}>Less</span>
        {['#0d1629', '#164e63', '#0891b2', '#06b6d4', '#00d4ff'].map((c, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: c }} />
        ))}
        <span style={{ fontSize: 11, color: '#64748b' }}>More</span>
      </div>
    </div>
  );
};

// ─── SUBJECT MANAGER ──────────────────────────────────────────────────────────
// Allows users to add/remove their own subjects freely
export const SubjectManager = ({ subjects, onUpdate, isInterview }) => {
  const [newSubject, setNewSubject] = useState('');
  const [open, setOpen] = useState(false);

  const addSubject = () => {
    const trimmed = newSubject.trim();
    if (!trimmed || subjects.includes(trimmed)) return;
    onUpdate([...subjects, trimmed]);
    setNewSubject('');
  };

  const removeSubject = (s) => {
    if (subjects.length <= 1) return; // keep at least one
    onUpdate(subjects.filter(x => x !== s));
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          padding: '6px 14px', borderRadius: 8,
          border: '1px solid rgba(0,212,255,0.3)',
          background: 'rgba(0,212,255,0.05)',
          color: '#00d4ff', fontSize: 12, cursor: 'pointer',
          fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6
        }}
      >
        <Settings size={13} />
        Manage {isInterview ? 'Topics' : 'Subjects'} ({subjects.length})
      </button>

      {open && (
        <div style={{ marginTop: 12, padding: 16, borderRadius: 12, background: '#060d1f', border: '1px solid #1e2d4a' }}>
          <p style={{ color: '#64748b', fontSize: 12, marginBottom: 10, fontWeight: 700 }}>
            ADD / REMOVE {isInterview ? 'TOPICS' : 'SUBJECTS'}
          </p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input
              className="input-field"
              placeholder={isInterview ? 'Add topic (e.g., React, Node.js)...' : 'Add subject (e.g., Geography)...'}
              value={newSubject}
              onChange={e => setNewSubject(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSubject()}
              style={{ flex: 1 }}
            />
            <button
              onClick={addSubject}
              className="gradient-btn"
              style={{ padding: '10px 14px', borderRadius: 10, border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <Plus size={16} />
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {subjects.map(s => (
              <div key={s} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 10px', borderRadius: 8,
                background: '#0d1629', border: '1px solid #1e2d4a'
              }}>
                <span style={{ color: '#94a3b8', fontSize: 13 }}>{s}</span>
                <button
                  onClick={() => removeSubject(s)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, display: 'flex' }}
                  title="Remove subject"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
          <p style={{ color: '#475569', fontSize: 11, marginTop: 10 }}>
            💡 Tip: You must keep at least one {isInterview ? 'topic' : 'subject'}.
          </p>
        </div>
      )}
    </div>
  );
};
