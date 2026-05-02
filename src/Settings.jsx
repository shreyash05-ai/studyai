import { LogOut } from 'lucide-react';
import { createFreshUserData } from './utils/storage';

export default function SettingsTab({ user, onUpgrade, onLogout, userData, updateUserData }) {
  const isInterview = user.studyMode === 'interview';

  const clearData = () => {
    if (window.confirm('Are you sure? This will clear all your study data.')) {
      updateUserData(createFreshUserData(user.studyMode));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Profile */}
      <div className="card" style={{ padding: 24 }}>
        <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 20 }}>👤 Profile</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            ['Name', user.name],
            ['Email', user.email],
            ['Mode', isInterview ? '💼 Interview Prep' : '🎓 Student'],
            ['Target', user.examName],
          ].map(([label, val]) => (
            <div key={label}>
              <label style={{ color: '#64748b', fontSize: 12, marginBottom: 6, display: 'block', fontWeight: 700 }}>{label}</label>
              <input className="input-field" defaultValue={val} readOnly style={{ color: '#94a3b8' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Subscription */}
      <div className="card" style={{ padding: 24 }}>
        <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 16 }}>💎 Subscription</h3>
        <div style={{
          padding: 20, borderRadius: 14, marginBottom: 16,
          background: user.isAdmin ? 'rgba(255,0,128,0.08)' : user.isPremium ? 'rgba(0,212,255,0.08)' : 'rgba(245,158,11,0.08)',
          border: `1px solid ${user.isAdmin ? 'rgba(255,0,128,0.35)' : user.isPremium ? 'rgba(0,212,255,0.3)' : 'rgba(245,158,11,0.3)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>{user.isAdmin ? '🛡️' : user.isPremium ? '⚡' : '⏳'}</span>
            <div>
              <p className="font-display" style={{ color: 'white', fontWeight: 700 }}>
                {user.isAdmin ? 'Admin Account — Full Access' : user.isPremium ? 'Premium Active' : 'Free Trial'}
              </p>
              <p style={{ color: '#64748b', fontSize: 13 }}>
                {user.isAdmin ? 'All features unlocked · No restrictions' : user.isPremium ? 'All features unlocked' : `${user.trialDays} days remaining`}
              </p>
            </div>
          </div>
        </div>
        {!user.isPremium && !user.isAdmin && (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => onUpgrade('monthly')} className="gradient-btn" style={{ padding: '11px 24px', borderRadius: 12, border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
              Monthly — ₹415 / $5
            </button>
            <button onClick={() => onUpgrade('yearly')} style={{ padding: '11px 24px', borderRadius: 12, border: '1px solid #00d4ff', background: 'rgba(0,212,255,0.08)', color: '#00d4ff', fontWeight: 700, cursor: 'pointer' }}>
              Yearly — ₹4150 / $50 🌟
            </button>
          </div>
        )}
      </div>

      {/* Data */}
      <div className="card" style={{ padding: 24 }}>
        <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 8 }}>📊 Your Data</h3>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 16 }}>
          Sessions: {(userData.sessions || []).length} · Concepts: {(userData.concepts || []).length} · Habits: {(userData.habits || []).length}
        </p>
        <button onClick={clearData} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
          🗑️ Clear All Data
        </button>
      </div>

      {/* Logout */}
      <button onClick={onLogout} style={{ padding: '13px', borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 15 }}>
        <LogOut size={18} /> Sign Out
      </button>
    </div>
  );
}
