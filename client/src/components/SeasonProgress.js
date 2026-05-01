import React from 'react';
import Rating from './Rating';

// Compute the metrics that matter for incentivizing early action.
function computeStats(games, assignments, seats) {
  const now = new Date();
  const today = new Date(now); today.setHours(0, 0, 0, 0);
  const week = new Date(today.getTime() + 7 * 86400000);

  let filledSeats = 0, missedSeats = 0;
  let filledGames = 0, missedGames = 0;
  let next7Total = 0, next7Filled = 0;
  let upcomingFullyHandled = 0;
  let upcomingHandledLeadDaysSum = 0;
  const pastSorted = [];
  const next7Open = [];

  for (const g of games) {
    const d = new Date(g.date + 'T12:00:00');
    const map = assignments[g.id] || {};
    let filledHere = 0, missedHere = 0;
    for (const s of seats) {
      const a = map[s.id];
      if (a && (a.kind === 'person' || a.kind === 'nonprofit' || a.kind === 'claimed')) {
        filledHere++;
      } else {
        missedHere++; // open or 'unused' both count as missed seats
      }
    }

    if (d < today) {
      filledSeats += filledHere;
      missedSeats += missedHere;
      if (missedHere === 0) filledGames++;
      else missedGames++;
      pastSorted.push({ game: g, missedHere });
    } else {
      const daysOut = Math.ceil((d - today) / 86400000);
      const fullyHandled = missedHere === 0;
      if (fullyHandled) {
        upcomingFullyHandled++;
        upcomingHandledLeadDaysSum += daysOut;
      }
      if (d <= week) {
        next7Total++;
        if (fullyHandled) next7Filled++;
        else next7Open.push({ game: g, missedHere, daysOut });
      }
    }
  }

  // Streak: most-recent past games where every seat was filled.
  pastSorted.sort((a, b) => b.game.date.localeCompare(a.game.date));
  let streak = 0;
  for (const r of pastSorted) {
    if (r.missedHere === 0) streak++; else break;
  }

  const avgLeadDays = upcomingFullyHandled > 0
    ? Math.round(upcomingHandledLeadDaysSum / upcomingFullyHandled)
    : null;

  let leadTier = null;
  if (avgLeadDays != null) {
    if (avgLeadDays >= 10) leadTier = { label: 'Early Bird', emoji: '🐦', cls: 'good' };
    else if (avgLeadDays >= 5) leadTier = { label: 'On Time', emoji: '⏱️', cls: 'mid' };
    else leadTier = { label: 'Last Minute', emoji: '⚠️', cls: 'warn' };
  }

  return {
    filledSeats, missedSeats, filledGames, missedGames,
    next7Total, next7Filled, next7Open,
    streak, avgLeadDays, leadTier,
  };
}

export default function SeasonProgress({ games, seats, assignments, onOpenGame, onPick }) {
  const s = computeStats(games, assignments, seats);
  const next7Pct = s.next7Total === 0 ? 100 : Math.round((s.next7Filled / s.next7Total) * 100);
  const missionComplete = s.next7Total > 0 && s.next7Filled === s.next7Total;

  return (
    <div className="season-progress">
      <div className="sp-mission">
        <div className="sp-mission-head">
          <div>
            <div className="sp-eyebrow">⚾ Mission control · this week</div>
            <div className="sp-mission-headline">
              {missionComplete
                ? 'All games this week are handled — nice work.'
                : `Fill every seat for the next ${s.next7Total} game${s.next7Total === 1 ? '' : 's'}`}
            </div>
            <div className="sp-mission-meta">
              {s.next7Filled} of {s.next7Total} games handled in the next 7 days · click any row to make picks
            </div>
          </div>
        </div>

        <div className="sp-bar-track">
          <div className={`sp-bar-fill ${missionComplete ? 'sp-bar-done' : ''}`} style={{ width: `${next7Pct}%` }}>
            <span className="sp-bar-pct">{next7Pct}%</span>
          </div>
        </div>

        {!missionComplete && s.next7Open.length > 0 && (
          <div className="sp-week-list">
            {s.next7Open.map(({ game, missedHere, daysOut }) => (
              <button
                key={game.id}
                className="sp-week-row"
                onClick={() => onPick ? onPick(game.id) : onOpenGame(game.id)}
              >
                <span className="sp-week-when">
                  {daysOut === 0 ? 'Today' : daysOut === 1 ? 'Tomorrow' : `${daysOut} days`}
                </span>
                <Rating n={game.stars} size="sm" />
                <span className="sp-week-game">{game.matchup}</span>
                <span className="sp-week-open">{missedHere} open</span>
                <span className="sp-week-action">Pick →</span>
              </button>
            ))}
          </div>
        )}
        {missionComplete && (
          <div className="sp-mission-done">
            ✨ Mission complete — your streak is safe and every seat this week is in good hands.
          </div>
        )}
      </div>

      <div className="sp-tally">
        <div className="sp-tally-cell sp-tally-good">
          <div className="sp-tally-num">{s.filledSeats}</div>
          <div className="sp-tally-label">Seats filled</div>
        </div>
        <div className="sp-tally-cell sp-tally-warn">
          <div className="sp-tally-num">{s.missedSeats}</div>
          <div className="sp-tally-label">Seats missed</div>
        </div>
        <div className="sp-tally-cell sp-tally-streak">
          <div className="sp-tally-num">🔥 {s.streak}</div>
          <div className="sp-tally-label">No-miss streak</div>
        </div>
        <div className="sp-tally-cell sp-tally-lead">
          {s.leadTier ? (
            <>
              <div className="sp-tally-num">{s.leadTier.emoji} {s.avgLeadDays}d</div>
              <div className="sp-tally-label">avg early · {s.leadTier.label}</div>
            </>
          ) : (
            <>
              <div className="sp-tally-num">—</div>
              <div className="sp-tally-label">avg lead time</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
