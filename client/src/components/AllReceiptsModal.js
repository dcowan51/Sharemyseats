import React from 'react';
import { getGameById } from '../data/games';

const FACE_VALUE = 150;

// Multi-receipt printable view. Shows a summary cover sheet + one receipt
// per donation. CPA-friendly: a single PDF you can hand off.
export default function AllReceiptsModal({ nonprofits, assignments, scopeNonprofit, onClose }) {
  // If scopeNonprofit is provided, only that org's donations are included.
  const inScope = (npId) => !scopeNonprofit || scopeNonprofit.id === npId;

  // Gather every donation grouped by (game, nonprofit).
  const rows = [];
  for (const gid of Object.keys(assignments)) {
    const map = assignments[gid];
    const counts = {};
    for (const sid of Object.keys(map)) {
      const a = map[sid];
      if (a && a.kind === 'nonprofit' && inScope(a.id)) {
        counts[a.id] = (counts[a.id] || 0) + 1;
      }
    }
    for (const npId of Object.keys(counts)) {
      const np = nonprofits.find(n => n.id === npId);
      const game = getGameById(gid);
      if (np && game) rows.push({ game, np, seatCount: counts[npId] });
    }
  }
  rows.sort((a, b) => a.game.date.localeCompare(b.game.date));

  const totalSeats = rows.reduce((n, r) => n + r.seatCount, 0);
  const totalValue = totalSeats * FACE_VALUE;

  // Per-nonprofit summary for the cover sheet.
  const npSummary = {};
  for (const r of rows) {
    if (!npSummary[r.np.id]) npSummary[r.np.id] = { np: r.np, seats: 0, value: 0, games: 0 };
    npSummary[r.np.id].seats += r.seatCount;
    npSummary[r.np.id].value += r.seatCount * FACE_VALUE;
    npSummary[r.np.id].games += 1;
  }
  const npSummaryRows = Object.values(npSummary).sort((a, b) => b.value - a.value);

  const issued = new Date().toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const heading = scopeNonprofit
    ? `Tax Receipt Bundle — ${scopeNonprofit.name}`
    : 'Tax Receipt Bundle — All Donations';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide modal-tall" onClick={e => e.stopPropagation()}>
        <div className="modal-body receipt-print">
          <div className="all-receipts">
            {/* COVER SHEET */}
            <div className="receipt cover-sheet">
              <div className="receipt-header">
                <div>
                  <div className="receipt-brand">⭐ ShareMySeats</div>
                  <div className="receipt-sub">Powered by the Tampa Bay Rays Foundation</div>
                </div>
                <div className="receipt-id">
                  <div>Bundle issued</div>
                  <div className="receipt-id-num">{issued}</div>
                </div>
              </div>

              <h2 className="receipt-title">{heading}</h2>
              <p className="cover-intro">
                This document compiles every charitable seat donation made through ShareMySeats.
                Provide it to your tax preparer for itemized-deduction substantiation. Each individual receipt follows the cover sheet.
              </p>

              <div className="cover-summary">
                <div className="cover-summary-row cover-summary-head">
                  <div>Recipient organization</div>
                  <div>Games</div>
                  <div>Seats</div>
                  <div>Fair market value</div>
                </div>
                {npSummaryRows.map(r => (
                  <div className="cover-summary-row" key={r.np.id}>
                    <div>
                      <div className="cover-np-name">{r.np.name}</div>
                      <div className="cover-np-sub">501(c)(3) verified</div>
                    </div>
                    <div>{r.games}</div>
                    <div>{r.seats}</div>
                    <div>${r.value.toLocaleString()}</div>
                  </div>
                ))}
                <div className="cover-summary-row cover-summary-total">
                  <div><strong>Total</strong></div>
                  <div><strong>{rows.length}</strong></div>
                  <div><strong>{totalSeats}</strong></div>
                  <div><strong>${totalValue.toLocaleString()}</strong></div>
                </div>
              </div>

              <div className="receipt-fineprint">
                <p><strong>No goods or services were provided in exchange for these donations.</strong> Each recipient is a registered 501(c)(3). Per-seat fair market value is based on Diamond Club face value of ${FACE_VALUE}. Please consult your tax advisor regarding deductibility.</p>
              </div>
            </div>

            {/* INDIVIDUAL RECEIPTS */}
            {rows.map((r, i) => {
              const total = (r.seatCount * FACE_VALUE).toFixed(2);
              const receiptId = `SMS-${r.game.id.slice(2)}-${r.np.id.slice(-4)}`.toUpperCase();
              const gameDate = new Date(r.game.date + 'T12:00:00').toLocaleDateString(undefined, {
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
              });
              return (
                <div key={i} className="receipt receipt-individual">
                  <div className="receipt-header">
                    <div>
                      <div className="receipt-brand">⭐ ShareMySeats</div>
                      <div className="receipt-sub">Donation Receipt #{i + 1} of {rows.length}</div>
                    </div>
                    <div className="receipt-id">
                      <div>Receipt No.</div>
                      <div className="receipt-id-num">{receiptId}</div>
                    </div>
                  </div>

                  <div className="receipt-grid" style={{ marginTop: 18, paddingTop: 18 }}>
                    <div>
                      <div className="receipt-label">Recipient</div>
                      <div className="receipt-value">{r.np.name}</div>
                      <div className="receipt-value-sub">501(c)(3) verified</div>
                    </div>
                    <div>
                      <div className="receipt-label">Game</div>
                      <div className="receipt-value">{r.game.matchup}</div>
                      <div className="receipt-value-sub">{gameDate} · {r.game.time}</div>
                    </div>
                    <div>
                      <div className="receipt-label">Seats Donated</div>
                      <div className="receipt-value">{r.seatCount} × Diamond Club</div>
                      <div className="receipt-value-sub">Section 108, Row C</div>
                    </div>
                    <div>
                      <div className="receipt-label">Fair Market Value</div>
                      <div className="receipt-value">${total}</div>
                      <div className="receipt-value-sub">${FACE_VALUE} × {r.seatCount} seats</div>
                    </div>
                  </div>

                  <div className="receipt-fineprint" style={{ marginTop: 12 }}>
                    <p>No goods or services were provided in exchange for this donation.</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-foot no-print">
          <button className="btn secondary" onClick={onClose}>Close</button>
          <button className="btn" onClick={() => window.print()}>📄 Print / Save as PDF</button>
        </div>
      </div>
    </div>
  );
}
