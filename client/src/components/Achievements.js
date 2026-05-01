import React from 'react';

export function computeAchievements({ games, seats, assignments }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const monthIdx = today.getMonth();
  const monthGames = games.filter(g => {
    const d = new Date(g.date + 'T12:00:00');
    return d.getMonth() === monthIdx && d.getFullYear() === today.getFullYear();
  });
  let monthFilled = 0;
  for (const g of monthGames) {
    const map = assignments[g.id] || {};
    let missed = 0;
    for (const s of seats) {
      const a = map[s.id];
      if (!a || a.kind === 'unused') missed++;
    }
    if (missed === 0) monthFilled++;
  }

  let donated = 0;
  for (const gid of Object.keys(assignments)) {
    const map = assignments[gid];
    for (const sid of Object.keys(map)) {
      const a = map[sid];
      if (a && a.kind === 'nonprofit') donated++;
    }
  }

  return [
    {
      id: 'no-miss-month',
      icon: '🎯',
      title: 'No-Miss Month',
      sub: `Every game in ${today.toLocaleString(undefined, { month: 'long' })} fully handled`,
      progress: monthFilled,
      target: monthGames.length || 1,
      unlocked: monthGames.length > 0 && monthFilled === monthGames.length,
    },
    {
      id: 'community-25',
      icon: '💜',
      title: '25 Seats Donated',
      sub: 'Sustained community impact across the season',
      progress: Math.min(donated, 25),
      target: 25,
      unlocked: donated >= 25,
    },
  ];
}

export default function Achievements({ achievements }) {
  return (
    <div className="goals-card">
      <div className="goals-head">
        <div>
          <h2 className="goals-title">Season goals</h2>
          <div className="goals-sub">Two targets to chase before the All-Star break</div>
        </div>
      </div>
      <div className="goals-grid">
        {achievements.map(a => {
          const pct = Math.round((a.progress / a.target) * 100);
          return (
            <div key={a.id} className={`goal ${a.unlocked ? 'unlocked' : ''}`}>
              <div className="goal-icon">{a.icon}</div>
              <div className="goal-body">
                <div className="goal-title-row">
                  <span className="goal-title">{a.title}</span>
                  {a.unlocked && <span className="goal-badge">Earned</span>}
                </div>
                <div className="goal-sub">{a.sub}</div>
                <div className="goal-track">
                  <div className="goal-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="goal-num">{a.progress} of {a.target}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
