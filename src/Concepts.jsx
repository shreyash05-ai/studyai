import { useState } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';
import { SubjectManager } from './components/SharedUI';
import { callAI } from './utils/ai';

export default function ConceptsTab({ user, userData, updateUserData }) {
  const concepts = userData.concepts || [];
  const isInterview = user.studyMode === 'interview';

  // subjects come from userData (customizable per user)
  const subjects = userData.customSubjects || [];

  const [form, setForm] = useState({ subject: subjects[0] || '', title: '', notes: '' });
  const [aiLoading, setAiLoading] = useState({});
  const [aiSummaries, setAiSummaries] = useState({});
  const [aiError, setAiError] = useState({});
  const [filter, setFilter] = useState('all');

  const updateSubjects = (newSubjects) => {
    updateUserData({ ...userData, customSubjects: newSubjects });
    // If current form subject was removed, reset to first
    if (!newSubjects.includes(form.subject)) {
      setForm(f => ({ ...f, subject: newSubjects[0] || '' }));
    }
  };

  const addConcept = () => {
    if (!form.title.trim()) return;
    updateUserData({
      ...userData,
      concepts: [...concepts, { id: Date.now(), ...form, mastery: 0, nextReview: 'Today', summary: '' }]
    });
    setForm({ subject: subjects[0] || '', title: '', notes: '' });
  };

  const generateSummary = async (concept) => {
    setAiLoading(p => ({ ...p, [concept.id]: true }));
    setAiError(p => ({ ...p, [concept.id]: null }));
    try {
      const prompt = isInterview
        ? `Create a concise technical summary for "${concept.title}" relevant to software engineering interviews. Include: definition, key points, common interview questions on this topic, and one quick tip. Keep under 120 words.`
        : `Create a concise study summary for "${concept.title}" in ${concept.subject}. Include: key definition, 3 main points, and 1 memory tip. Keep under 100 words.`;
      const text = await callAI([{ role: 'user', content: prompt }]);
      setAiSummaries(p => ({ ...p, [concept.id]: text }));
    } catch (e) {
      setAiError(p => ({ ...p, [concept.id]: `AI Error: ${e.message}` }));
    }
    setAiLoading(p => ({ ...p, [concept.id]: false }));
  };

  const updateMastery = (id, val) => {
    updateUserData({
      ...userData,
      concepts: concepts.map(c => c.id === id ? { ...c, mastery: Math.max(0, Math.min(100, c.mastery + val)) } : c)
    });
  };

  const deleteConcept = (id) =>
    updateUserData({ ...userData, concepts: concepts.filter(c => c.id !== id) });

  const filtered =
    filter === 'all' ? concepts
    : filter === 'weak' ? concepts.filter(c => c.mastery < 60)
    : concepts.filter(c => c.mastery >= 60);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="card" style={{ padding: 24 }}>
        <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 18 }}>
          ➕ Add {isInterview ? 'Topic / Concept' : 'Concept'}
        </h3>

        {/* Subject Manager — users can add/remove subjects */}
        <SubjectManager subjects={subjects} onUpdate={updateSubjects} isInterview={isInterview} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ color: '#64748b', fontSize: 12, marginBottom: 6, display: 'block', fontWeight: 700 }}>
              {isInterview ? 'Category' : 'Subject'}
            </label>
            <select className="input-field" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
              {subjects.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ color: '#64748b', fontSize: 12, marginBottom: 6, display: 'block', fontWeight: 700 }}>
              {isInterview ? 'Topic Name' : 'Concept Title'}
            </label>
            <input
              className="input-field"
              placeholder={isInterview ? 'e.g., Binary Search, Two Pointers' : 'e.g., Photosynthesis'}
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && addConcept()}
            />
          </div>
        </div>
        <textarea
          className="input-field"
          placeholder="Your notes (optional — AI will generate a summary)"
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
          style={{ minHeight: 80, resize: 'vertical', marginBottom: 14 }}
        />
        <button onClick={addConcept} className="gradient-btn" style={{ padding: '10px 24px', borderRadius: 10, border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
          <Plus size={16} style={{ display: 'inline', marginRight: 6 }} /> Add {isInterview ? 'Topic' : 'Concept'}
        </button>
      </div>

      {concepts.length > 0 && (
        <div style={{ display: 'flex', gap: 8 }}>
          {[['all', 'All'], ['weak', 'Needs Review'], ['strong', 'Strong']].map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} className={`tab-btn ${filter === k ? 'tab-active' : 'tab-inactive'}`} style={{ fontSize: 13 }}>{l}</button>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
          {concepts.length === 0 ? `Add your first ${isInterview ? 'topic' : 'concept'} above to start tracking!` : 'No concepts match this filter.'}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>
        {filtered.map(c => (
          <div key={c.id} className="card card-hover" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ flex: 1, marginRight: 10 }}>
                <span style={{ fontSize: 11, color: '#7c3aed', fontWeight: 700, textTransform: 'uppercase' }}>{c.subject}</span>
                <h4 className="font-display" style={{ fontSize: 15, fontWeight: 700, color: 'white', marginTop: 2 }}>{c.title}</h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, padding: '3px 8px', borderRadius: 6, background: c.mastery >= 70 ? 'rgba(16,185,129,0.15)' : c.mastery >= 40 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)', color: c.mastery >= 70 ? '#10b981' : c.mastery >= 40 ? '#f59e0b' : '#ef4444', fontWeight: 700 }}>{c.mastery}%</span>
                <button onClick={() => deleteConcept(c.id)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 2 }}><X size={14} /></button>
              </div>
            </div>
            <div className="mastery-bar" style={{ marginBottom: 8 }}>
              <div className="mastery-fill" style={{ width: `${c.mastery}%`, background: 'linear-gradient(90deg,#00d4ff,#7c3aed)' }} />
            </div>
            <p style={{ color: '#475569', fontSize: 12, marginBottom: 10 }}>Next review: {c.nextReview}</p>
            {c.notes && <p style={{ color: '#64748b', fontSize: 12, marginBottom: 10, fontStyle: 'italic' }}>{c.notes}</p>}

            {aiSummaries[c.id] && (
              <div style={{ padding: 12, borderRadius: 10, background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)', marginBottom: 12 }}>
                <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7 }}>{aiSummaries[c.id]}</p>
              </div>
            )}
            {aiError[c.id] && (
              <div style={{ padding: 10, borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: 12 }}>
                <p style={{ color: '#ef4444', fontSize: 12 }}>{aiError[c.id]}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => generateSummary(c)} disabled={aiLoading[c.id]} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.08)', color: '#00d4ff', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                {aiLoading[c.id] ? '⏳ Generating...' : <><Sparkles size={12} style={{ display: 'inline', marginRight: 4 }} />AI Summary</>}
              </button>
              <button onClick={() => updateMastery(c.id, 10)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #1e2d4a', background: 'transparent', color: '#10b981', fontSize: 12, cursor: 'pointer' }}>+10%</button>
              <button onClick={() => updateMastery(c.id, -10)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #1e2d4a', background: 'transparent', color: '#ef4444', fontSize: 12, cursor: 'pointer' }}>-10%</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
