import { useState } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { callAI } from './utils/ai';
import { SubjectManager } from './components/SharedUI';

export default function MockTest({ user, userData, updateUserData, isPremium, onUpgrade }) {
  const concepts = userData.concepts || [];
  const isInterview = user.studyMode === 'interview';
  const subjects = userData.customSubjects || [];

  const [subject, setSubject] = useState(subjects[0] || '');
  const [difficulty, setDifficulty] = useState('medium');
  const [testType, setTestType] = useState(isInterview ? 'coding' : 'mcq');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');

  const updateSubjects = (newSubjects) => {
    updateUserData({ ...userData, customSubjects: newSubjects });
    if (!newSubjects.includes(subject)) setSubject(newSubjects[0] || '');
  };

  const generateTest = async () => {
    if (!subject) { setGenError('Please add at least one subject first.'); return; }
    setGenerating(true); setAnswers({}); setResult(null); setGenError('');
    try {
      const weakConcepts = concepts
        .filter(c => c.subject === subject && c.mastery < 70)
        .map(c => c.title).join(', ');

      let prompt;
      if (isInterview && testType === 'coding') {
        prompt = `Generate a ${difficulty} difficulty technical interview test for "${subject}" with exactly 5 multiple choice questions. ${weakConcepts ? `Focus on: ${weakConcepts}.` : ''} Include questions about implementation, time complexity, and best practices. Return ONLY a valid JSON array — no markdown, no backticks, no extra text: [{"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correct":0,"explanation":"..."}]`;
      } else if (isInterview && testType === 'behavioral') {
        prompt = `Generate exactly 5 behavioral/situational interview MCQs for a ${difficulty} level software engineering role. Return ONLY valid JSON array — no markdown: [{"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correct":0,"explanation":"..."}]`;
      } else {
        prompt = `Generate a ${difficulty} difficulty mock test for ${subject} with exactly 5 multiple choice questions. ${weakConcepts ? `Focus on these weak areas: ${weakConcepts}.` : ''} Return ONLY a valid JSON array — no markdown, no backticks, no extra text: [{"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correct":0,"explanation":"..."}]`;
      }

      const raw = await callAI(
        [{ role: 'user', content: prompt }],
        'You are an expert question generator. Return ONLY valid JSON arrays. No markdown formatting, no backticks, no extra text whatsoever.'
      );
      const clean = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(clean);
      if (!Array.isArray(parsed)) throw new Error('Response was not a JSON array');
      setQuestions(parsed);
    } catch (e) {
      setGenError(`Failed to generate test: ${e.message}. Please try again.`);
    }
    setGenerating(false);
  };

  const submitTest = () => {
    let correct = 0;
    questions.forEach((q, i) => { if (answers[i] === q.correct) correct++; });
    setResult({ score: Math.round((correct / questions.length) * 100), correct, total: questions.length });
  };

  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="card" style={{ padding: 24 }}>
        <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 18 }}>
          🧪 {isInterview ? 'AI Interview Practice Test' : 'AI Mock Test'}
        </h3>

        {!isPremium && (
          <div style={{ padding: '10px 16px', borderRadius: 10, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ color: '#f59e0b', fontSize: 13 }}>⚡ Free trial: 5 tests/day. Upgrade for unlimited.</span>
            <button onClick={() => onUpgrade('monthly')} style={{ padding: '4px 12px', borderRadius: 6, border: 'none', background: '#f59e0b', color: '#0d1629', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>Upgrade</button>
          </div>
        )}

        {/* Subject Manager */}
        <SubjectManager subjects={subjects} onUpdate={updateSubjects} isInterview={isInterview} />

        {genError && (
          <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', marginBottom: 16 }}>
            <p style={{ color: '#ef4444', fontSize: 13 }}>{genError}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ color: '#64748b', fontSize: 12, marginBottom: 6, display: 'block', fontWeight: 700 }}>{isInterview ? 'Topic / Skill' : 'Subject'}</label>
            <select className="input-field" value={subject} onChange={e => setSubject(e.target.value)}>
              {subjects.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          {isInterview && (
            <div>
              <label style={{ color: '#64748b', fontSize: 12, marginBottom: 6, display: 'block', fontWeight: 700 }}>Test Type</label>
              <select className="input-field" value={testType} onChange={e => setTestType(e.target.value)}>
                <option value="coding">Technical / Coding</option>
                <option value="behavioral">Behavioral / HR</option>
                <option value="mcq">Theory MCQ</option>
              </select>
            </div>
          )}
          <div>
            <label style={{ color: '#64748b', fontSize: 12, marginBottom: 6, display: 'block', fontWeight: 700 }}>Difficulty</label>
            <select className="input-field" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="exam-level">{isInterview ? 'FAANG Level' : 'Exam Level'}</option>
            </select>
          </div>
        </div>

        <button onClick={generateTest} disabled={generating || !subject} className="gradient-btn" style={{ padding: '11px 28px', borderRadius: 12, border: 'none', color: 'white', fontWeight: 700, cursor: generating ? 'not-allowed' : 'pointer', opacity: generating ? 0.8 : 1 }}>
          {generating
            ? <><RefreshCw size={15} style={{ display: 'inline', marginRight: 8, animation: 'spin 1s linear infinite' }} />Generating...</>
            : <><Sparkles size={15} style={{ display: 'inline', marginRight: 8 }} />Generate Test</>}
        </button>
      </div>

      {questions.length > 0 && !result && (
        <div className="card" style={{ padding: 24 }}>
          <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 20 }}>{subject} — {difficulty}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {questions.map((q, i) => (
              <div key={i} style={{ padding: 18, borderRadius: 12, background: '#060d1f', border: '1px solid #1e2d4a' }}>
                <p style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 14, lineHeight: 1.6 }}>{i + 1}. {q.question}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {q.options.map((opt, j) => (
                    <button key={j} onClick={() => setAnswers(a => ({ ...a, [i]: j }))}
                      style={{ padding: '10px 16px', borderRadius: 10, border: `2px solid ${answers[i] === j ? '#00d4ff' : '#1e2d4a'}`, background: answers[i] === j ? 'rgba(0,212,255,0.1)' : 'transparent', color: answers[i] === j ? '#00d4ff' : '#94a3b8', cursor: 'pointer', textAlign: 'left', fontWeight: answers[i] === j ? 700 : 400, transition: 'all 0.2s' }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={submitTest} disabled={!allAnswered} className="gradient-btn"
            style={{ marginTop: 20, padding: '12px 32px', borderRadius: 12, border: 'none', color: 'white', fontWeight: 700, cursor: allAnswered ? 'pointer' : 'not-allowed', opacity: allAnswered ? 1 : 0.5 }}>
            Submit Test →
          </button>
        </div>
      )}

      {result && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 56, marginBottom: 8 }}>{result.score >= 80 ? '🏆' : result.score >= 60 ? '👍' : '📚'}</div>
            <h3 className="font-display" style={{ fontSize: 28, fontWeight: 900, color: result.score >= 80 ? '#10b981' : result.score >= 60 ? '#f59e0b' : '#ef4444' }}>{result.score}%</h3>
            <p style={{ color: '#64748b' }}>{result.correct}/{result.total} correct · {result.score >= 80 ? 'Excellent!' : result.score >= 60 ? 'Good! Keep practicing.' : 'Needs more study.'}</p>
          </div>
          {questions.map((q, i) => (
            <div key={i} style={{ padding: 16, borderRadius: 12, marginBottom: 12, border: `1px solid ${answers[i] === q.correct ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, background: answers[i] === q.correct ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)' }}>
              <p style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 8, lineHeight: 1.5 }}>{i + 1}. {q.question}</p>
              <p style={{ color: answers[i] === q.correct ? '#10b981' : '#ef4444', fontSize: 13, marginBottom: 6 }}>
                {answers[i] === q.correct ? '✅ Correct' : '❌ Incorrect'} · Answer: {q.options[q.correct]}
              </p>
              {q.explanation && <p style={{ color: '#64748b', fontSize: 13, fontStyle: 'italic' }}>💡 {q.explanation}</p>}
            </div>
          ))}
          <button onClick={() => { setQuestions([]); setResult(null); setAnswers({}); }}
            style={{ marginTop: 8, padding: '10px 24px', borderRadius: 10, border: '1px solid #1e2d4a', background: 'transparent', color: '#64748b', cursor: 'pointer', fontWeight: 600 }}>
            New Test
          </button>
        </div>
      )}
    </div>
  );
}
