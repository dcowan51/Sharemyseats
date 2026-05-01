import React from 'react';

// Numeric rating badge — replaces the visual stars.
// Sizes: 'sm' inline / 'md' default / 'lg' on hero headers.
// Tier labels with insight hints describing the demand and how to plan.
// Underlying attendance estimates exist in the data layer to drive the rating
// math, but are intentionally not surfaced on user-facing screens.
export const RATING_TIERS = {
  5: { label: 'Marquee', cls: 'r5', hint: 'Sells itself — high demand' },
  4: { label: 'Hot',     cls: 'r4', hint: 'Strong demand — easy to give away' },
  3: { label: 'Solid',   cls: 'r3', hint: 'Average matchup' },
  2: { label: 'Quiet',   cls: 'r2', hint: 'Plan ahead — softer demand' },
  1: { label: 'Sparse',  cls: 'r1', hint: 'Hardest to fill — donate or invite friends early' },
};

export default function Rating({ n, size = 'md', showLabel = false }) {
  const tier = RATING_TIERS[n] || RATING_TIERS[1];
  return (
    <span className={`rating rating-${size} rating-${tier.cls}`} aria-label={`Rating ${n} of 5 — ${tier.label}`}>
      <span className="rating-num">{n}</span>
      {showLabel && <span className="rating-label">{tier.label}</span>}
    </span>
  );
}

export function RatingLegend({ compact = false }) {
  return (
    <div className={`rating-legend ${compact ? 'rating-legend-compact' : ''}`}>
      <div className="rating-legend-head">
        <span className="rating-legend-eyebrow">Game rating</span>
        <span className="rating-legend-sub">Based on opponent demand, day of week, time, and promotions</span>
      </div>
      <div className="rating-legend-rows">
        {[5, 4, 3, 2, 1].map(n => {
          const tier = RATING_TIERS[n];
          return (
            <span className="rating-legend-row" key={n}>
              <span className={`rating rating-sm rating-${tier.cls}`}>
                <span className="rating-num">{n}</span>
              </span>
              <span className="rating-legend-label">
                <strong>{tier.label}</strong>
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
