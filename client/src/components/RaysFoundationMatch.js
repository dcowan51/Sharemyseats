import React from 'react';

// Compute Rays Foundation match: matches first 10 donated seats per season,
// with a 2× boost for donations made 7+ days before first pitch (early-bird incentive).
import { GAMES } from '../data/games';

const MATCH_CAP = 10;
const FACE_VALUE = 150;
const EARLY_DAYS = 7;

export default function RaysFoundationMatch({ assignments, nonprofits }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let donatedSeats = 0;
  let earlyDonatedSeats = 0;
  const npCounts = {};
  for (const gid of Object.keys(assignments)) {
    const game = GAMES.find(g => g.id === gid);
    const map = assignments[gid];
    const gameDate = game ? new Date(game.date + 'T12:00:00') : null;
    const daysOut = gameDate ? Math.ceil((gameDate - today) / 86400000) : 0;
    for (const sid of Object.keys(map)) {
      const a = map[sid];
      if (a && a.kind === 'nonprofit') {
        donatedSeats++;
        if (daysOut >= EARLY_DAYS) earlyDonatedSeats++;
        npCounts[a.id] = (npCounts[a.id] || 0) + 1;
      }
    }
  }
  const matched = Math.min(donatedSeats, MATCH_CAP);
  // Early-bird donations within the cap get 2× match.
  const earlyMatched = Math.min(earlyDonatedSeats, matched);
  const lateMatched = matched - earlyMatched;
  const matchedDollars = (earlyMatched * 2 + lateMatched) * FACE_VALUE;
  const pct = Math.round((matched / MATCH_CAP) * 100);

  // Pick the top-supported nonprofit to feature.
  let topNp = null;
  let topCount = 0;
  for (const id of Object.keys(npCounts)) {
    if (npCounts[id] > topCount) {
      topCount = npCounts[id];
      topNp = nonprofits.find(n => n.id === id);
    }
  }

  if (donatedSeats === 0) return null;

  return (
    <div className="rfm-card">
      <div className="rfm-top">
        <div className="rfm-badge">Rays Foundation Match</div>
        <div className="rfm-amount-block">
          <div className="rfm-amount">${matchedDollars.toLocaleString()}</div>
          <div className="rfm-amount-label">matched this season</div>
        </div>
      </div>
      <div className="rfm-sub">
        {matched} of {MATCH_CAP} matched seats used
        {topNp && <> · top recipient: <strong>{topNp.name}</strong></>}
      </div>
      <div className="rfm-track">
        <div className="rfm-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="rfm-foot">
        <span>⚡ Donate 7+ days early for a <strong>2× match</strong></span>
        <span>{MATCH_CAP - matched} match-eligible seats left</span>
      </div>
    </div>
  );
}
