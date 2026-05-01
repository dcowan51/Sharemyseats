import React, { useMemo, useState } from 'react';
import { getGameById } from '../data/games';
import TaxReceiptModal from './TaxReceiptModal';

function initials(name) {
  return name.split(' ').slice(0, 2).map(s => s[0] || '').join('').toUpperCase();
}

const FACE_VALUE = 150;

export default function NonprofitDetail({ nonprofit, assignments, messages, onBack, onPrintAll }) {
  const [receiptFor, setReceiptFor] = useState(null);

  // Gather every donation for this nonprofit, grouped by game.
  const donations = useMemo(() => {
    const out = [];
    for (const gid of Object.keys(assignments)) {
      const map = assignments[gid];
      let count = 0;
      for (const sid of Object.keys(map)) {
        const a = map[sid];
        if (a && a.kind === 'nonprofit' && a.id === nonprofit.id) count++;
      }
      if (count > 0) {
        const game = getGameById(gid);
        if (game) out.push({ game, seatCount: count });
      }
    }
    out.sort((a, b) => b.game.date.localeCompare(a.game.date));
    return out;
  }, [assignments, nonprofit.id]);

  const totalSeats = donations.reduce((n, d) => n + d.seatCount, 0);
  const totalValue = totalSeats * FACE_VALUE;

  const npMessages = (messages || []).filter(m => m.nonprofitId === nonprofit.id);
  const receivedMessages = npMessages.filter(m => m.status === 'received');

  const e = nonprofit.eligibility;
  const tags = [];
  if (e.weekday && e.weekend) tags.push({ icon: '📅', label: 'Any day' });
  else if (e.weekday) tags.push({ icon: '💼', label: 'Weekday only' });
  else if (e.weekend) tags.push({ icon: '🏖️', label: 'Weekend only' });
  if (e.minAdvanceHours != null) {
    tags.push({ icon: '⚡', label: `Same-day · ${e.minAdvanceHours}h before first pitch` });
  } else {
    tags.push({ icon: '⏱️', label: `${e.minAdvanceDays}+ days notice` });
  }
  if (e.maxAdvanceDays) tags.push({ icon: '🪟', label: `Up to ${e.maxAdvanceDays} days out` });

  return (
    <div>
      <div className="np-hero">
        <button className="back" onClick={onBack}>← All nonprofits</button>
        <div className="np-hero-body">
          <div className="np-hero-avatar">{initials(nonprofit.name)}</div>
          <div style={{ flex: 1 }}>
            <h1>{nonprofit.name}</h1>
            <p className="np-hero-mission">{nonprofit.mission}</p>
            <div className="rule-tags">
              {tags.map(t => (
                <span className="rule-tag" key={t.label}>
                  <span className="rule-tag-icon">{t.icon}</span>
                  {t.label}
                </span>
              ))}
            </div>
            <p className="np-hero-notes">{e.notes}</p>
          </div>
        </div>
      </div>

      <div className="np-stats">
        <div className="np-stat">
          <div className="np-stat-num">{totalSeats}</div>
          <div className="np-stat-label">Seats donated to this org</div>
        </div>
        <div className="np-stat">
          <div className="np-stat-num">${totalValue.toLocaleString()}</div>
          <div className="np-stat-label">Estimated fair-market value</div>
        </div>
        <div className="np-stat">
          <div className="np-stat-num">{donations.length}</div>
          <div className="np-stat-label">Games donated</div>
        </div>
        <div className="np-stat">
          <div className="np-stat-num">{receivedMessages.length}</div>
          <div className="np-stat-label">Photo stories received</div>
        </div>
      </div>

      <div className="section-title" style={{ marginTop: 28 }}>
        <h2>Your donation history</h2>
        <span className="hint">Click any game for an individual receipt.</span>
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn" disabled={donations.length === 0} onClick={() => onPrintAll(nonprofit)}>
            📄 Print all receipts
          </button>
        </div>
      </div>

      {donations.length === 0 ? (
        <div className="empty-msg">
          You haven't donated to {nonprofit.name} yet.
        </div>
      ) : (
        <div className="np-donations">
          {donations.map(({ game, seatCount }) => {
            const dateLabel = new Date(game.date + 'T12:00:00').toLocaleDateString(undefined, {
              weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
            });
            const past = new Date(game.date + 'T12:00:00') < new Date();
            return (
              <div key={game.id} className="np-donation-row">
                <div className="np-don-date">
                  <div className="np-don-day">{game.dayNum}</div>
                  <div className="np-don-month">{game.monthLabel}</div>
                </div>
                <div className="np-don-game">
                  <div className="np-don-matchup">{game.matchup}</div>
                  <div className="np-don-meta">{dateLabel} · {game.time} · {past ? 'Played' : 'Upcoming'}</div>
                </div>
                <div className="np-don-count">
                  <div className="np-don-count-num">{seatCount}</div>
                  <div className="np-don-count-label">seat{seatCount === 1 ? '' : 's'}</div>
                </div>
                <div className="np-don-value">${(seatCount * FACE_VALUE).toLocaleString()}</div>
                <button
                  className="btn small secondary"
                  onClick={() => setReceiptFor({ game, seatCount })}
                >
                  Receipt
                </button>
              </div>
            );
          })}
        </div>
      )}

      {receivedMessages.length > 0 && (
        <>
          <div className="section-title" style={{ marginTop: 32 }}>
            <h2>What they sent back</h2>
          </div>
          <div className="np-stories">
            {receivedMessages.slice(0, 3).map(m => {
              const game = getGameById(m.gameId);
              return (
                <div key={m.id} className="np-story">
                  {m.caption && <div className="np-story-quote">"{m.caption}"</div>}
                  <div className="np-story-meta">
                    {game?.matchup} · {game && new Date(game.date + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {receiptFor && (
        <TaxReceiptModal
          game={receiptFor.game}
          nonprofit={nonprofit}
          seatCount={receiptFor.seatCount}
          onClose={() => setReceiptFor(null)}
        />
      )}
    </div>
  );
}
