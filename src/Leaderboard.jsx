export default function Leaderboard({ user, userData }) {
  const sessions = userData.sessions || [];
  const totalHours = parseFloat(sessions.reduce((a, s) => a + s.duration / 60, 0).toFixed(1));
  const concepts = userData.concepts || [];
  const avgScore = concepts.length > 0
    ? Math.round(concepts.reduce((a, c) => a + c.mastery, 0) / concepts.length)
    : 0;

  const mockPeers = [
    { rank: 1, name: 'Prep_7823', hours: 42, score: 94, badge: '🏆' },
    { rank: 2, name: 'Prep_1204', hours: 38, score: 91, badge: '🥈' },
    { rank: 3, name: 'Prep_5567', hours: 32, score: 85, badge: '🥉' },
    { rank: 4, name: 'Prep_9901', hours: 28, score: 82, badge: '⭐' },
    { rank: 5, name: 'Prep_3310', hours: 25, score: 79, badge: '⭐' },
  ];

  const me = { name: 'You', hours: totalHours, score: avgScore, isMe: true, badge: avgScore > 0 ? '🌟' : '🆕' };
  const myRank = mockPeers.filter(p => p.hours > totalHours).length + 1;
  const leaderboard = [
    ...mockPeers.filter(p => p.hours > totalHours),
    { ...me, rank: myRank },
    ...mockPeers.filter(p => p.hours <= totalHours).map((p, i) => ({ ...p, rank: myRank + i + 1 })),
  ].slice(0, 8).map((item, i) => ({ ...item, rank: i + 1 }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="card" style={{ padding: 24 }}>
        <h3 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 8 }}>🏆 Anonymous Leaderboard</h3>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Compare with other {user.examName} students this week</p>

        {totalHours === 0 && (
          <div style={{ padding: 16, borderRadius: 12, background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', marginBottom: 20 }}>
            <p style={{ color: '#00d4ff', fontSize: 14 }}>📊 Log study sessions to appear on the leaderboard with real stats!</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {leaderboard.map((l, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderRadius: 14, background: l.isMe ? 'rgba(0,212,255,0.08)' : '#060d1f', border: `1px solid ${l.isMe ? 'rgba(0,212,255,0.4)' : '#1e2d4a'}` }}>
              <span style={{ fontSize: 24, width: 32, textAlign: 'center' }}>{l.badge || '⭐'}</span>
              <span className="font-display" style={{ color: l.isMe ? '#00d4ff' : '#94a3b8', fontWeight: 700, flex: 1, fontSize: 15 }}>
                {l.name}
                {l.isMe && (
                  <span style={{ fontSize: 12, marginLeft: 8, padding: '2px 8px', borderRadius: 10, background: 'rgba(0,212,255,0.2)', color: '#00d4ff' }}>YOU</span>
                )}
              </span>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>{l.score}%</p>
                <p style={{ color: '#475569', fontSize: 12 }}>{l.hours}h studied</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
