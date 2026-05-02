import { useState } from 'react';
import { Brain, CheckCircle } from 'lucide-react';

export default function Landing({ onStart }) {
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  const features = [
    { icon: "🧠", title: "Adaptive Mock Tests", desc: "AI generates tests based on your weak areas for both exams and technical interviews" },
    { icon: "💼", title: "Interview Prep Mode", desc: "DSA, System Design, behavioral questions — full interview preparation suite" },
    { icon: "🤖", title: "AI Study Mentor", desc: "Socratic chatbot that guides you to answers. Mood-aware sessions." },
    { icon: "⚡", title: "Spaced Repetition", desc: "AI schedules concept reviews at the perfect moment before you forget" },
    { icon: "🔥", title: "Habit Tracker", desc: "Build iron study habits with streaks and gamified accountability" },
    { icon: "📊", title: "Smart Analytics", desc: "Heatmap, radar charts, predicted score and deep performance insights" },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#04091a' }}>
      <nav style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e2d4a', position: 'sticky', top: 0, background: 'rgba(4,9,26,0.9)', backdropFilter: 'blur(12px)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#00d4ff,#7c3aed)' }}>
            <Brain size={20} color="white" />
          </div>
          <span className="font-display" style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>StudyAI</span>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={() => onStart('login')} style={{ padding: '8px 18px', borderRadius: 10, border: '1px solid #1e2d4a', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Login</button>
          <button onClick={() => onStart('admin-login')} style={{ padding: '8px 18px', borderRadius: 10, border: '1px solid rgba(255,0,128,0.4)', background: 'rgba(255,0,128,0.08)', color: '#ff0080', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>🛡️ Admin</button>
          <button onClick={() => onStart('register')} className="gradient-btn" style={{ padding: '8px 18px', borderRadius: 10, border: 'none', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>Start Free Trial</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '6px 18px', borderRadius: 20, border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.05)', marginBottom: 24 }}>
          <span style={{ color: '#00d4ff', fontSize: 13, fontWeight: 700 }}>✨ For Students & Interview Seekers · 10 Days Free</span>
        </div>
        <h1 className="font-display" style={{ fontSize: 'clamp(32px,5vw,68px)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 20 }}>
          Your Personal<br /><span className="gradient-text">AI Study Mentor</span><br />Exams & Interviews
        </h1>
        <p style={{ fontSize: 18, color: '#64748b', maxWidth: 580, margin: '0 auto 36px', lineHeight: 1.7 }}>
          Whether you're cracking JEE/NEET/UPSC or preparing for FAANG interviews — adaptive AI tests, smart analytics, and a mentor that thinks like your best coach.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => onStart('register')} className="gradient-btn" style={{ padding: '14px 32px', borderRadius: 14, border: 'none', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
            🎓 Start as Student →
          </button>
          <button onClick={() => onStart('register-interview')} style={{ padding: '14px 32px', borderRadius: 14, border: '1px solid #10b981', background: 'rgba(16,185,129,0.08)', color: '#10b981', fontSize: 16, cursor: 'pointer', fontWeight: 700 }}>
            💼 Interview Prep →
          </button>
        </div>
        <p style={{ color: '#475569', fontSize: 13, marginTop: 16 }}>No credit card required · Cancel anytime</p>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 className="font-display" style={{ textAlign: 'center', fontSize: 34, fontWeight: 800, color: 'white', marginBottom: 48 }}>
          Everything you need to <span className="gradient-text">succeed</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="card card-hover" style={{ padding: 24 }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
              <h3 className="font-display" style={{ fontSize: 17, fontWeight: 700, color: 'white', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px', textAlign: 'center' }}>
        <h2 className="font-display" style={{ fontSize: 34, fontWeight: 800, color: 'white', marginBottom: 8 }}>Simple, Fair Pricing</h2>
        <p style={{ color: '#64748b', marginBottom: 36 }}>Start free. Upgrade when you're ready.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          {[['monthly','Monthly'],['yearly','Yearly · Save 17%']].map(([p,l]) => (
            <button key={p} onClick={() => setSelectedPlan(p)} className={`tab-btn ${selectedPlan===p?'tab-active':'tab-inactive'}`}>{l}</button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
          <div className="card" style={{ padding: 28 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🆓</div>
            <h3 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>Free Trial</h3>
            <p className="font-display" style={{ fontSize: 40, fontWeight: 900, color: '#00d4ff', margin: '12px 0 4px' }}>₹0 / $0</p>
            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>10 days, full access</p>
            {['All features unlocked','AI mock tests (5/day)','AI mentor chatbot','Dashboard & analytics'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <CheckCircle size={15} color="#00d4ff" /><span style={{ color: '#94a3b8', fontSize: 13 }}>{f}</span>
              </div>
            ))}
            <button onClick={() => onStart('register')} className="gradient-btn" style={{ width: '100%', padding: 12, borderRadius: 12, border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', marginTop: 20 }}>Start Free →</button>
          </div>
          <div style={{ padding: 28, borderRadius: 16, border: '2px solid #00d4ff', background: 'rgba(0,212,255,0.05)', position: 'relative', boxShadow: '0 0 20px rgba(0,212,255,0.15)' }}>
            <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', padding: '4px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, color: 'white', background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', whiteSpace: 'nowrap' }}>MOST POPULAR</div>
            <div style={{ fontSize: 32, marginBottom: 8 }}>⚡</div>
            <h3 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>Premium</h3>
            <p className="font-display" style={{ fontSize: 36, fontWeight: 900, color: '#00d4ff', margin: '12px 0 4px' }}>
              {selectedPlan === 'monthly' ? '₹415 / $5' : '₹4,150 / $50'}
            </p>
            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>{selectedPlan === 'monthly' ? 'per month' : 'per year'}</p>
            {['Unlimited AI mock tests','Advanced AI mentor (Socratic)','Interview prep mode','DSA & System Design tests','Predicted score/readiness','Weekly AI report','Priority support'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <CheckCircle size={15} color="#00d4ff" /><span style={{ color: '#94a3b8', fontSize: 13 }}>{f}</span>
              </div>
            ))}
            <button onClick={() => onStart('register')} className="gradient-btn" style={{ width: '100%', padding: 12, borderRadius: 12, border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', marginTop: 20 }}>Get Premium →</button>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #1e2d4a', padding: '24px', textAlign: 'center', color: '#475569', fontSize: 13 }}>
        © 2026 StudyAI · Built for students and professionals who mean business 🎓💼
      </div>
    </div>
  );
}
