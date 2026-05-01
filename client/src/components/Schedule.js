import React, { useMemo, useState } from 'react';
import { gameStatus } from '../state';
import Rating, { RatingLegend } from './Rating';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DOWS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function Schedule({ games, seats, assignments, onOpenGame }) {
  const [view, setView] = useState('list');
  const [filter, setFilter] = useState('all'); // all | open | donated | set
  const [opponent, setOpponent] = useState('all');

  const opponents = useMemo(() => {
    const set = new Set(games.map(g => g.opponent));
    return ['all', ...Array.from(set).sort()];
  }, [games]);

  const filtered = useMemo(() => {
    return games.filter(g => {
      if (opponent !== 'all' && g.opponent !== opponent) return false;
      if (filter === 'all') return true;
      const s = gameStatus(g, assignments, seats);
      if (filter === 'open') return s.open > 0;
      if (filter === 'donated') return s.donated > 0;
      if (filter === 'set') return s.open === 0;
      return true;
    });
  }, [games, filter, opponent, assignments, seats]);

  return (
    <div>
      <div className="section-title">
        <h1>Schedule</h1>
        <span className="hint">{filtered.length} of {games.length} games shown</span>
      </div>

      <div className="toolbar">
        <div className="toggle" role="tablist" aria-label="View">
          <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>List</button>
          <button className={view === 'cal' ? 'active' : ''} onClick={() => setView('cal')}>Calendar</button>
        </div>
        <select className="filter-input" value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter by status">
          <option value="all">All games</option>
          <option value="open">Has open seats</option>
          <option value="donated">Has donated seats</option>
          <option value="set">Fully set</option>
        </select>
        <select className="filter-input" value={opponent} onChange={e => setOpponent(e.target.value)} aria-label="Filter by opponent">
          {opponents.map(o => <option key={o} value={o}>{o === 'all' ? 'All opponents' : o}</option>)}
        </select>
      </div>

      <RatingLegend compact />

      {view === 'list' ? (
        <ListView games={filtered} seats={seats} assignments={assignments} onOpenGame={onOpenGame} />
      ) : (
        <CalendarView games={filtered} seats={seats} assignments={assignments} onOpenGame={onOpenGame} />
      )}
    </div>
  );
}

function ListView({ games, seats, assignments, onOpenGame }) {
  if (games.length === 0) {
    return <div className="card empty-msg">No games match these filters.</div>;
  }
  return (
    <div className="game-list">
      {games.map(g => {
        const s = gameStatus(g, assignments, seats);
        return (
          <button key={g.id} className={`game-row status-${s.key} ${g.isWeekend ? 'is-weekend' : ''}`} onClick={() => onOpenGame(g.id)}>
            <div className="date-blk">
              <div className="date-month">{g.monthLabel}</div>
              <div className="date-day">{g.dayNum}</div>
              <div className="date-dow">{g.dowShort}</div>
            </div>
            <div>
              <div className="matchup">{g.matchup}</div>
              <div className="submeta">{g.time} · {g.pitchers.opp} vs. {g.pitchers.rays}</div>
              {g.promo && <span className="promo">{g.promo}</span>}
            </div>
            <Rating n={g.stars} />
            <span className="status-pill">{s.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function CalendarView({ games, seats, assignments, onOpenGame }) {
  // Group games by year-month and render a month grid for each.
  const byMonth = useMemo(() => {
    const m = new Map();
    for (const g of games) {
      const d = new Date(g.date + 'T12:00:00');
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!m.has(key)) m.set(key, []);
      m.get(key).push(g);
    }
    return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [games]);

  if (byMonth.length === 0) {
    return <div className="card empty-msg">No games match these filters.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {byMonth.map(([key, gs]) => {
        const [year, monthIdx] = key.split('-').map(Number);
        const first = new Date(year, monthIdx, 1);
        const startDow = first.getDay();
        const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
        const cells = [];
        for (let i = 0; i < startDow; i++) cells.push({ empty: true, key: `e${i}` });
        for (let day = 1; day <= daysInMonth; day++) {
          const dateStr = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayGames = gs.filter(g => g.date === dateStr);
          cells.push({ key: dateStr, day, games: dayGames });
        }
        return (
          <div className="cal" key={key}>
            <div className="month-header">{MONTHS[monthIdx]} {year}</div>
            {DOWS.map(d => <div className="dow" key={d}>{d}</div>)}
            {cells.map(c => {
              if (c.empty) return <div key={c.key} className="cell empty" />;
              return (
                <div key={c.key} className="cell">
                  <div className="num">{c.day}</div>
                  {c.games.map(g => {
                    const s = gameStatus(g, assignments, seats);
                    return (
                      <button
                        key={g.id}
                        className={`game-chip status-${s.key}`}
                        onClick={() => onOpenGame(g.id)}
                        title={`${g.matchup} — ${g.time} · Rating ${g.stars}/5`}
                      >
                        <span className="game-chip-name">{g.opponent}</span>
                        <Rating n={g.stars} size="sm" />
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
