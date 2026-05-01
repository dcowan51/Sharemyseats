import React from 'react';
import { useState } from 'react';
import { gameStatus } from '../state';
import { getGameById } from '../data/games';
import Rating from './Rating';
import SeasonProgress from './SeasonProgress';
import Achievements, { computeAchievements } from './Achievements';
import RaysFoundationMatch from './RaysFoundationMatch';
import SeatsManagerDialog from './SeatsManagerDialog';
import TransferTicketModal from './TransferTicketModal';
import Toast from './Toast';
import Confetti from './Confetti';

export default function Dashboard({ games, seats, assignments, messages, people, nonprofits, onOpenGame, onGoSchedule, onResetDemo, onAssign, onRecordDonation }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [pickGameId, setPickGameId] = useState(null);
  const [batchTransfer, setBatchTransfer] = useState(null); // { game, transfers }
  const [toast, setToast] = useState(null);
  const [celebrate, setCelebrate] = useState(false);

  // Helper: count next-7-day games with all seats handled.
  function next7Stats(asgn) {
    const now = new Date(); now.setHours(0,0,0,0);
    const week = new Date(now.getTime() + 7 * 86400000);
    let total = 0, filled = 0;
    for (const g of games) {
      const d = new Date(g.date + 'T12:00:00');
      if (d < now || d > week) continue;
      total++;
      const map = asgn[g.id] || {};
      let missed = 0;
      for (const s of seats) {
        const a = map[s.id];
        if (!a || a.kind === 'unused') missed++;
      }
      if (missed === 0) filled++;
    }
    return { total, filled };
  }
  const pickGame = pickGameId ? getGameById(pickGameId) : null;
  const pickMap = pickGameId ? (assignments[pickGameId] || {}) : {};

  function handleSavePicks(nextMap, andTransfer) {
    if (!pickGameId) return;

    // Capture the "before" state to detect mission completion.
    const before = next7Stats(assignments);
    const wasComplete = before.total > 0 && before.filled === before.total;

    let donated = 0;
    const donationCounts = {};
    // Build a synthetic next-state for stat recompute (don't trust async setState).
    const projected = { ...assignments };
    projected[pickGameId] = { ...(projected[pickGameId] || {}) };
    for (const seat of seats) {
      const next = nextMap[seat.id] ?? null;
      onAssign(pickGameId, seat.id, next);
      if (next === null) delete projected[pickGameId][seat.id];
      else projected[pickGameId][seat.id] = next;
      if (next && next.kind === 'nonprofit') {
        donated++;
        donationCounts[next.id] = (donationCounts[next.id] || 0) + 1;
      }
    }
    for (const npId of Object.keys(donationCounts)) {
      onRecordDonation(pickGameId, npId, donationCounts[npId]);
    }
    const savedGameId = pickGameId;
    setPickGameId(null);

    const after = next7Stats(projected);
    const nowComplete = after.total > 0 && after.filled === after.total;

    // If user clicked "Save & transfer", build the transfer list and pop the transfer modal.
    if (andTransfer) {
      const transfers = [];
      for (const seat of seats) {
        const next = nextMap[seat.id];
        if (next && next.kind === 'person') {
          const p = people.find(x => x.id === next.id);
          if (p) transfers.push({ seat, person: p });
        }
      }
      const game = getGameById(savedGameId);
      if (game && transfers.length > 0) {
        setBatchTransfer({ game, transfers });
        // Defer the celebration toast until after the transfer flow finishes.
        return;
      }
    }

    if (!wasComplete && nowComplete) {
      setCelebrate(true);
      setToast('🎉 Mission complete — every game this week is set!');
    } else if (donated > 0) {
      setToast(`✓ Picks saved · ${donated} seat${donated === 1 ? '' : 's'} donated`);
    } else {
      setToast('✓ Picks saved');
    }
  }

  function handleTransferComplete({ method }) {
    if (!batchTransfer) return;
    const today = new Date().toISOString().slice(0, 10);
    const gameId = batchTransfer.game.id;
    const currentMap = assignments[gameId] || {};
    for (const t of batchTransfer.transfers) {
      const cur = currentMap[t.seat.id];
      if (cur && cur.kind === 'person') {
        onAssign(gameId, t.seat.id, {
          ...cur,
          transferred: true,
          transferMethod: method,
          transferredAt: today,
        });
      }
    }
  }

  function closeBatchTransfer() {
    if (batchTransfer) {
      setToast(`✓ ${batchTransfer.transfers.length} ticket${batchTransfer.transfers.length === 1 ? '' : 's'} transferred`);
    }
    setBatchTransfer(null);
  }

  const upcomingNeedsAction = games
    .map(g => ({ g, s: gameStatus(g, assignments, seats) }))
    .filter(({ g, s }) => {
      const d = new Date(g.date + 'T12:00:00');
      return d >= today && s.open > 0;
    })
    .slice(0, 4);

  const recentPast = games
    .map(g => ({ g, s: gameStatus(g, assignments, seats) }))
    .filter(({ g }) => new Date(g.date + 'T12:00:00') < today)
    .reverse()
    .slice(0, 5);

  const achievements = computeAchievements({ games, seats, assignments, messages });

  // Personalize the welcome with a stat-driven hook.
  const upcomingOpenCount = games.reduce((n, g) => {
    const d = new Date(g.date + 'T12:00:00');
    if (d < today) return n;
    const s = gameStatus(g, assignments, seats);
    return n + (s.open > 0 ? 1 : 0);
  }, 0);

  return (
    <div>
      <header className="welcome-bar">
        <div className="welcome-avatar">PC</div>
        <div className="welcome-body">
          <div className="welcome-eyebrow">Welcome back</div>
          <h1 className="welcome-name">Pat Cowan</h1>
          <div className="welcome-meta">
            Diamond Club STH since 2019 · Section 108, Row C, Seats 1–4
          </div>
        </div>
        <div className="welcome-aside">
          {upcomingOpenCount === 0
            ? <span className="welcome-status welcome-status-good">✓ All upcoming games handled</span>
            : <span className="welcome-status welcome-status-warn">{upcomingOpenCount} upcoming game{upcomingOpenCount === 1 ? '' : 's'} need attention</span>}
          <button className="welcome-reset" onClick={onResetDemo} title="Reset demo data">Reset demo</button>
        </div>
      </header>

      <SeasonProgress
        games={games}
        seats={seats}
        assignments={assignments}
        onOpenGame={onOpenGame}
        onPick={(id) => setPickGameId(id)}
      />

      <RaysFoundationMatch assignments={assignments} nonprofits={nonprofits} />

      <Achievements achievements={achievements} />

      <div className="section-title" style={{ marginTop: 28 }}>
        <h2>Needs your attention</h2>
        <span className="hint">Upcoming games with open seats</span>
      </div>
      <div className="game-list" style={{ marginBottom: 28 }}>
        {upcomingNeedsAction.length === 0 && (
          <div className="celebrate-empty">
            <div className="celebrate-emoji">🎉</div>
            <div>
              <div className="celebrate-headline">You're all set</div>
              <div className="celebrate-sub">Every upcoming game has every seat handled. Your no-miss streak is safe.</div>
            </div>
          </div>
        )}
        {upcomingNeedsAction.map(({ g, s }) => (
          <button key={g.id} className={`game-row status-${s.key}`} onClick={() => onOpenGame(g.id)}>
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
        ))}
      </div>

      <div className="section-title">
        <h2>Recently played</h2>
        <button className="btn secondary small" onClick={onGoSchedule}>See full season →</button>
      </div>
      <div className="recap-strip">
        {recentPast.length === 0 && (
          <div className="card empty-msg">No games have been played yet.</div>
        )}
        {recentPast.map(({ g, s }) => {
          const noWaste = s.unused === 0 && s.open === 0;
          return (
            <button key={g.id} className={`recap-card ${noWaste ? 'recap-good' : 'recap-warn'}`} onClick={() => onOpenGame(g.id)}>
              <div className="recap-date">{g.monthLabel} {g.dayNum}</div>
              <div className="recap-opp">{g.opponent}</div>
              <div className="recap-rating-row"><Rating n={g.stars} size="sm" /></div>
              <div className="recap-tag">
                {noWaste ? '✓ Filled' : `${s.unused + s.open} unused`}
              </div>
            </button>
          );
        })}
      </div>

      {pickGame && (
        <SeatsManagerDialog
          game={pickGame}
          seats={seats}
          currentMap={pickMap}
          people={people}
          nonprofits={nonprofits}
          onSaveAll={handleSavePicks}
          onClose={() => setPickGameId(null)}
        />
      )}

      {batchTransfer && (
        <TransferTicketModal
          game={batchTransfer.game}
          transfers={batchTransfer.transfers}
          onComplete={handleTransferComplete}
          onClose={closeBatchTransfer}
        />
      )}

      <Toast message={toast} onClose={() => setToast(null)} duration={celebrate ? 3500 : 2400} />
      <Confetti active={celebrate} onDone={() => setCelebrate(false)} />
    </div>
  );
}
