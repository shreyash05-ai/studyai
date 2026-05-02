import { Brain, X } from 'lucide-react';

export default function Sidebar({ tab, setTab, user, open, onClose, onUpgrade }) {
  const isInterview = user.studyMode === 'interview';

  const items = [
    ['dashboard', '🏠', 'Dashboard'],
    ['goals', '🎯', 'Goals'],
    ['study', '⏱️', 'Study Tracker'],
    ['concepts', '💡', isInterview ? 'Topics' : 'Concepts'],
    ['test', '🧪', isInterview ? 'Practice Tests' : 'Mock Tests'],
    ['chat', '🤖', 'AI Mentor'],
    ...(isInterview ? [['interview', '💼', 'Interview Prep']] : []),
    ['habits', '🔥', 'Habits'],
    ['leaderboard', '🏆', 'Leaderboard'],
    ['settings', '⚙️', 'Settings'],
  ];

  const Content = ({ showClose }) => (
    <>
      <div style={{ padding: '20px 16px', borderBottom: '1px solid #1e2d4a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={20} color="white" />
          </div>
          <span className="font-display" style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>StudyAI</span>
          {showClose && (
            <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={18} /></button>
          )}
        </div>
        <div style={{ padding: '8px 12px', borderRadius: 10, background: user.isAdmin ? 'rgba(255,0,128,0.1)' : user.isPremium ? 'rgba(0,212,255,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${user.isAdmin ? 'rgba(255,0,128,0.35)' : user.isPremium ? 'rgba(0,212,255,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
          <p style={{ color: user.isAdmin ? '#ff0080' : user.isPremium ? '#00d4ff' : '#f59e0b', fontSize: 12, fontWeight: 700 }}>
            {user.isAdmin ? '🛡️ Admin' : user.isPremium ? '⚡ Premium' : `⏳ ${user.trialDays} days left`}
          </p>
          <p style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>{user.name}</p>
          <p style={{ color: '#475569', fontSize: 10 }}>{isInterview ? '💼 Interview Mode' : '🎓 Student Mode'}</p>
        </div>
      </div>

      <div style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {items.map(([k, icon, label]) => (
          <button key={k} onClick={() => { setTab(k); onClose(); }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, border: 'none', cursor: 'pointer', marginBottom: 4, textAlign: 'left', background: tab === k ? 'rgba(0,212,255,0.1)' : 'transparent', borderLeft: `3px solid ${tab === k ? '#00d4ff' : 'transparent'}` }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span style={{ color: tab === k ? '#00d4ff' : '#64748b', fontWeight: tab === k ? 700 : 500, fontSize: 14 }}>{label}</span>
          </button>
        ))}
      </div>

      {!user.isPremium && !user.isAdmin && (
        <div style={{ padding: 16, borderTop: '1px solid #1e2d4a' }}>
          <button onClick={onUpgrade} className="gradient-btn" style={{ width: '100%', padding: '10px', borderRadius: 12, border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
            ⚡ Upgrade — $5/mo
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="sidebar-desktop" style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 240, background: '#060d1f', borderRight: '1px solid #1e2d4a', zIndex: 40, flexDirection: 'column' }}>
        <Content showClose={false} />
      </div>

      {/* Mobile overlay */}
      {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 30 }} />}
      <div style={{ position: 'fixed', left: open ? 0 : -260, top: 0, bottom: 0, width: 240, background: '#060d1f', borderRight: '1px solid #1e2d4a', zIndex: 50, display: 'flex', flexDirection: 'column', transition: 'left 0.3s' }}>
        <Content showClose={true} />
      </div>
    </>
  );
}
