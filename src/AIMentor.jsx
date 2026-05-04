import { useState, useRef, useEffect } from 'react';
import { Brain, Send } from 'lucide-react';
import { callAI } from './utils/ai';

export default function AIMentor({ user, userData }) {
  const isInterview = user.studyMode === 'interview';
  const concepts = userData?.concepts || [];
  const sessions = userData?.sessions || [];

  const weakAreas = concepts.filter(c => c.mastery < 60).map(c => c.title).join(', ') || 'none logged yet';
  const totalHours = sessions.reduce((a, s) => a + s.duration / 60, 0).toFixed(1);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hey ${user.name}! 👋 I'm your AI ${isInterview ? 'interview' : 'study'} mentor. I'm here to help you prepare for **${user.examName}**.\n\nYou've logged **${totalHours}h** so far${weakAreas !== 'none logged yet' ? ` and your weak areas include: ${weakAreas}` : ''}.\n\nHow can I help you today? 🚀`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [socratic, setSocratic] = useState(false);
  const [mood, setMood] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', content: text };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const moodLabel = mood === '😊' ? 'happy and motivated' : mood === '😐' ? 'neutral' : mood === '😩' ? 'tired and stressed' : mood === '😤' ? 'frustrated' : 'neutral';
      const systemPrompt = socratic
        ? `You are a Socratic ${isInterview ? 'interview coach' : 'study mentor'} helping ${user.name} prepare for ${user.examName}. NEVER give direct answers — always ask guiding questions that lead them to discover the answer themselves. Be encouraging and concise. The student feels ${moodLabel}.`
        : `You are an expert AI ${isInterview ? 'interview coach' : 'study mentor'} for ${user.name} preparing for ${user.examName}. ${isInterview ? 'Help with DSA, system design, behavioral questions, coding patterns, time complexity, and interview strategies.' : 'Give concise, practical study advice, explain concepts clearly, and provide motivation.'} Context: Student has studied ${totalHours} hours total. Weak areas: ${weakAreas}. Student mood: ${moodLabel}. Be warm, specific, and actionable. Keep responses under 200 words.`;

      const history = messages.slice(-8).map(m => ({ role: m.role, content: m.content }));
      const reply = await callAI([...history, userMsg], systemPrompt);
      setMessages(m => [...m, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: `❌ Error: ${e.message}. Please check your API key setup.` }]);
    }
    setLoading(false);
  };

  const suggestions = isInterview
    ? ['📅 Create an 8-week interview prep plan', '💡 Explain Binary Search Trees', '🎯 How to ace system design rounds', '💬 Give me a behavioral question', '⚡ What are the most important DSA topics?']
    : ['📅 Create a study plan for me', '⚠️ Help with my weak areas', '💡 Explain a tough concept simply', '🎯 How to improve my focus', '📊 Tips for exam day'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Controls */}
      <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>Mode:</span>
          {[
            [false, '💬', 'Direct'],
            [true, '🏛️', 'Socratic'],
          ].map(([val, icon, label]) => (
            <button
              key={label}
              onClick={() => setSocratic(val)}
              style={{
                padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13,
                border: socratic === val ? 'none' : '1px solid #1e2d4a',
                background: socratic === val ? 'linear-gradient(135deg,#00d4ff,#7c3aed)' : 'transparent',
                color: socratic === val ? 'white' : '#64748b'
              }}
            >
              {icon} {label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ color: '#64748b', fontSize: 13 }}>Mood:</span>
          {['😊', '😐', '😩', '😤'].map(m => (
            <button
              key={m}
              onClick={() => setMood(prev => prev === m ? null : m)}
              style={{
                fontSize: 20, background: 'none',
                border: `2px solid ${mood === m ? '#00d4ff' : 'transparent'}`,
                borderRadius: 8, cursor: 'pointer', padding: 4, transition: 'all 0.2s'
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ height: 'min(420px, 60vh)', overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {m.role === 'assistant' && (
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: 10, marginTop: 2 }}>
                  <Brain size={16} color="white" />
                </div>
              )}
              <div style={{
                maxWidth: '76%', padding: '12px 16px', borderRadius: 14, fontSize: 14, lineHeight: 1.7,
                background: m.role === 'user' ? 'linear-gradient(135deg,#00d4ff,#7c3aed)' : '#0d1629',
                color: 'white',
                border: m.role === 'assistant' ? '1px solid #1e2d4a' : 'none',
                borderBottomLeftRadius: m.role === 'assistant' ? 4 : 14,
                borderBottomRightRadius: m.role === 'user' ? 4 : 14,
                whiteSpace: 'pre-wrap'
              }}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#00d4ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={16} color="white" />
              </div>
              <div style={{ padding: '12px 16px', borderRadius: 14, background: '#0d1629', border: '1px solid #1e2d4a' }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d4ff', animation: `dot-pulse 1s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick Suggestions */}
        <div style={{ padding: '10px 20px', borderTop: '1px solid #1e2d4a', display: 'flex', gap: 8, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => send(s)}
              style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.05)', color: '#00d4ff', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600 }}>
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #1e2d4a', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            className="input-field"
            placeholder={isInterview ? 'Ask about DSA, system design, interviews...' : 'Ask your AI mentor anything...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && !loading && send(input)}
            style={{ flex: 1 }}
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            className="gradient-btn"
            style={{ padding: '10px 16px', borderRadius: 10, border: 'none', color: 'white', cursor: 'pointer', opacity: loading || !input.trim() ? 0.6 : 1 }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
