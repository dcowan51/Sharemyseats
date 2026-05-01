import React, { useState } from 'react';
import AllReceiptsModal from './AllReceiptsModal';

function initials(name) {
  return name.split(' ').slice(0, 2).map(s => s[0] || '').join('').toUpperCase();
}

const FACE_VALUE = 150;

function countDonationsFor(npId, assignments) {
  let n = 0;
  for (const gid of Object.keys(assignments)) {
    const seats = assignments[gid];
    for (const sid of Object.keys(seats)) {
      const a = seats[sid];
      if (a && a.kind === 'nonprofit' && a.id === npId) n++;
    }
  }
  return n;
}

export default function Nonprofits({ nonprofits, assignments, onOpenNonprofit }) {
  const [showAll, setShowAll] = useState(false);

  let totalDonations = 0;
  for (const np of nonprofits) totalDonations += countDonationsFor(np.id, assignments);

  return (
    <div>
      <div className="section-title">
        <h1>Vetted Nonprofits</h1>
        <span className="hint">Each organization has eligibility rules for which games they can accept.</span>
        <div style={{ marginLeft: 'auto' }}>
          <button
            className="btn"
            onClick={() => setShowAll(true)}
            disabled={totalDonations === 0}
            title={totalDonations === 0 ? 'No donations yet' : 'Print every donation receipt for your CPA'}
          >
            📄 Print all receipts for CPA
          </button>
        </div>
      </div>

      {totalDonations > 0 && (
        <div className="np-bundle-summary">
          <div>
            <div className="np-bundle-eyebrow">Tax bundle ready</div>
            <div className="np-bundle-headline">
              {totalDonations} seats donated · ${(totalDonations * FACE_VALUE).toLocaleString()} estimated fair-market value
            </div>
          </div>
          <button className="btn secondary small" onClick={() => setShowAll(true)}>
            View bundle →
          </button>
        </div>
      )}

      <div className="entity-list">
        {nonprofits.map(np => {
          const e = np.eligibility;
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
          const donations = countDonationsFor(np.id, assignments);
          return (
            <button
              key={np.id}
              className="entity-row entity-clickable"
              onClick={() => onOpenNonprofit(np.id)}
              aria-label={`Open ${np.name} details`}
            >
              <div className="avatar donate">{initials(np.name)}</div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div className="name">{np.name}</div>
                <div className="sub" style={{ marginBottom: 8 }}>{np.mission}</div>
                <div className="rule-tags">
                  {tags.map(t => (
                    <span className="rule-tag" key={t.label}>
                      <span className="rule-tag-icon">{t.icon}</span>
                      {t.label}
                    </span>
                  ))}
                </div>
                <div className="sub" style={{ fontStyle: 'italic' }}>{e.notes}</div>
              </div>
              <div className="actions" style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: 'var(--donate)', fontSize: 22 }}>{donations}</div>
                <div className="sub">seats donated</div>
                <div className="np-row-arrow">→</div>
              </div>
            </button>
          );
        })}
      </div>

      {showAll && (
        <AllReceiptsModal
          nonprofits={nonprofits}
          assignments={assignments}
          scopeNonprofit={null}
          onClose={() => setShowAll(false)}
        />
      )}
    </div>
  );
}
