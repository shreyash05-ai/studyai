import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { callAI } from './utils/ai';

export default function InterviewResources({ user }) {
  const [activeTab, setActiveTab] = useState('roadmap');
  const [generating, setGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [reviewResult, setReviewResult] = useState('');
  const [error, setError] = useState('');

  const generate = async (type) => {
    setGenerating(true); setError('');
    try {
      if (type === 'roadmap') {
        const text = await callAI([{ role: 'user', content: `Create a structured 8-week interview preparation roadmap for ${user.examName}. Include: week-by-week plan, key topics, resources, and daily schedule. Be specific and actionable. Format with clear sections.` }]);
        setRoadmap(text);
      } else if (type === 'question') {
        const text = await callAI([{ role: 'user', content: `Generate a realistic ${user.examName} interview question with: the question, hints, approach, time/space complexity if applicable, and a clean solution explanation. Make it medium-hard difficulty.` }]);
        setQuestion(text);
      } else if (type === 'review') {
        if (!answer.trim()) return;
        const text = await callAI([{ role: 'user', content: `Review this interview answer/approach and provide: ✅ Strengths, ⚠️ Areas to improve, ❌ Missing points, and a score out of 10.\n\nAnswer: "${answer}"` }]);
        setReviewResult(text);
      }
    } catch (e) {
      setError(`Error: ${e.message}`);
    }
    setGenerating(false);
  };

  const tabs = [
    ['roadmap', '🗺️', 'Study Roadmap'],
    ['practice', '💻', 'Practice Questions'],
    ['review', '🔍', 'Answer Review'],
    ['tips', '💡', 'Interview Tips'],
  ];

  const tips = [
    { icon: '⏱️', title: 'Think Out Loud', desc: 'Always verbalize your thought process. Interviewers want to see how you think, not just the answer.' },
    { icon: '📊', title: 'Complexity First', desc: 'Before coding, discuss time and space complexity. Ask if optimization is needed.' },
    { icon: '🧪', title: 'Test Your Code', desc: 'Walk through your solution with examples. Edge cases matter — empty inputs, single elements, large inputs.' },
    { icon: '❓', title: 'Clarify Requirements', desc: 'Ask clarifying questions before diving in. Define constraints, input types, expected outputs.' },
    { icon: '🔄', title: 'Iterative Approach', desc: 'Start with brute force, then optimize. A working solution beats an incomplete optimal one.' },
    { icon: '💬', title: 'Behavioral STAR', desc: 'For behavioral: Situation, Task, Action, Result. Prepare 5-7 strong personal stories.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {tabs.map(([k, icon, label]) => (
          <button key={k} onClick={() => setActiveTab(k)} className={`tab-btn ${activeTab === k ? 'tab-active' : 'tab-inactive'}`}>
            {icon} {label}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <p style={{ color: '#ef4444', fontSize: 13 }}>{error}</p>
        </div>
      )}

      {activeTab === 'roadmap' && (
        <div className="card" style={{ padding: 24 }}>
          <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 8 }}>🗺️ AI-Generated Interview Roadmap</h3>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>Get a personalized week-by-week prep plan for {user.examName}</p>
          <button onClick={() => generate('roadmap')} disabled={generating} className="gradient-btn" style={{ padding: '10px 24px', borderRadius: 12, border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', marginBottom: 20 }}>
            {generating ? '⏳ Generating...' : <><Sparkles size={15} style={{ display: 'inline', marginRight: 8 }} />Generate My Roadmap</>}
          </button>
          {roadmap && (
            <div style={{ padding: 20, borderRadius: 12, background: '#060d1f', border: '1px solid #1e2d4a' }}>
              <pre style={{ color: '#e2e8f0', fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap', fontFamily: 'Nunito, sans-serif' }}>{roadmap}</pre>
            </div>
          )}
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="card" style={{ padding: 24 }}>
          <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 8 }}>💻 Practice Questions</h3>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>AI generates real-style interview questions for you to practice</p>
          <button onClick={() => generate('question')} disabled={generating} className="gradient-btn" style={{ padding: '10px 24px', borderRadius: 12, border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', marginBottom: 20 }}>
            {generating ? '⏳ Generating...' : '🎲 Generate Question'}
          </button>
          {question && (
            <div style={{ padding: 20, borderRadius: 12, background: '#060d1f', border: '1px solid #1e2d4a' }}>
              <pre style={{ color: '#e2e8f0', fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap', fontFamily: 'Nunito, sans-serif' }}>{question}</pre>
            </div>
          )}
        </div>
      )}

      {activeTab === 'review' && (
        <div className="card" style={{ padding: 24 }}>
          <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 8 }}>🔍 AI Answer Review</h3>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 16 }}>Type your answer to any interview question and get AI feedback</p>
          <textarea className="input-field" placeholder="Paste your answer, approach, or solution here..." value={answer} onChange={e => setAnswer(e.target.value)} style={{ minHeight: 150, resize: 'vertical', marginBottom: 14 }} />
          <button onClick={() => generate('review')} disabled={generating || !answer.trim()} className="gradient-btn" style={{ padding: '10px 24px', borderRadius: 12, border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', marginBottom: 20, opacity: !answer.trim() ? 0.6 : 1 }}>
            {generating ? '⏳ Analyzing...' : '🔍 Review My Answer'}
          </button>
          {reviewResult && (
            <div style={{ padding: 20, borderRadius: 12, background: '#060d1f', border: '1px solid rgba(16,185,129,0.2)' }}>
              <pre style={{ color: '#e2e8f0', fontSize: 13, lineHeight: 1.8, whiteSpace: 'pre-wrap', fontFamily: 'Nunito, sans-serif' }}>{reviewResult}</pre>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tips' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 16 }}>
          {tips.map((t, i) => (
            <div key={i} className="card card-hover" style={{ padding: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{t.icon}</div>
              <h4 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 8 }}>{t.title}</h4>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
