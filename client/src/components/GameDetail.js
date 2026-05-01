import React, { useState } from 'react';
import SeatsManagerDialog from './SeatsManagerDialog';
import TaxReceiptModal from './TaxReceiptModal';
import TransferTicketModal from './TransferTicketModal';
import Toast from './Toast';
import Rating, { RATING_TIERS } from './Rating';

import { METHOD_LABEL } from './TransferTicketModal';

function describeAssignment(a, people, nonprofits) {
  if (!a) return null;
  if (a.kind === 'unused') return { headline: 'Marked unused', sub: 'No one is using this seat.' };
  if (a.kind === 'claimed') return { headline: 'Taken', sub: 'Marked handled (no name on file).' };
  if (a.kind === 'person') {
    const p = people.find(x => x.id === a.id);
    const headline = p ? p.name : 'Unknown person';
    if (a.transferred) {
      return {
        headline,
        sub: `🔒 Transferred via ${METHOD_LABEL[a.transferMethod] || 'MLB Ballpark'}${a.transferredAt ? ` · ${a.transferredAt}` : ''}`,
        locked: true,
      };
    }
    return { headline, sub: p ? p.relation : '' };
  }
  if (a.kind === 'nonprofit') {
    const np = nonprofits.find(x => x.id === a.id);
    return np ? { headline: np.name, sub: 'Donated' } : { headline: 'Donated', sub: '' };
  }
  return null;
}

function seatClass(a) {
  if (!a) return 'unassigned';
  if (a.kind === 'person' && a.transferred) return 'assigned seat-transferred';
  if (a.kind === 'person') return 'assigned';
  if (a.kind === 'nonprofit') return 'donated';
  if (a.kind === 'unused') return 'assigned';
  if (a.kind === 'claimed') return 'assigned';
  return 'unassigned';
}

export default function GameDetail({ game, seats, assignments, people, nonprofits, onAssign, onRecordDonation, onBack }) {
  const [editing, setEditing] = useState(false);
  const [receipt, setReceipt] = useState(null); // { nonprofit, seatCount }
  const [transfer, setTransfer] = useState(null); // { transfers: [{seat, person}, ...] }
  const [toast, setToast] = useState(null);
  const map = assignments[game.id] || {};

  const dateLabel = new Date(game.date + 'T12:00:00').toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  function handleSaveAll(nextMap, andTransfer) {
    const donationCounts = {};
    for (const seat of seats) {
      const next = nextMap[seat.id] ?? null;
      onAssign(game.id, seat.id, next);
      if (next && next.kind === 'nonprofit') {
        donationCounts[next.id] = (donationCounts[next.id] || 0) + 1;
      }
    }
    for (const npId of Object.keys(donationCounts)) {
      onRecordDonation(game.id, npId, donationCounts[npId]);
    }
    setEditing(false);

    if (andTransfer) {
      const transfers = [];
      for (const seat of seats) {
        const next = nextMap[seat.id];
        if (next && next.kind === 'person') {
          const p = people.find(x => x.id === next.id);
          if (p) transfers.push({ seat, person: p });
        }
      }
      if (transfers.length > 0) setTransfer({ transfers });
    }
  }

  // Group donated seats by nonprofit so the receipt covers the full bundle.
  function openReceiptForSeat(seat, a) {
    const np = nonprofits.find(n => n.id === a.id);
    if (!np) return;
    let count = 0;
    for (const s of seats) {
      const aa = map[s.id];
      if (aa && aa.kind === 'nonprofit' && aa.id === a.id) count++;
    }
    setReceipt({ nonprofit: np, seatCount: count });
  }

  function openTransfer(seat, person) {
    setTransfer({ transfers: [{ seat, person }] });
  }

  function handleTransferComplete({ method }) {
    if (!transfer) return;
    const today = new Date().toISOString().slice(0, 10);
    const currentMap = assignments[game.id] || {};
    for (const t of transfer.transfers) {
      const cur = currentMap[t.seat.id];
      if (cur && cur.kind === 'person') {
        onAssign(game.id, t.seat.id, {
          ...cur,
          transferred: true,
          transferMethod: method,
          transferredAt: today,
        });
      }
    }
  }

  function handleTransferDone() {
    if (transfer) {
      const n = transfer.transfers.length;
      setToast(`✓ ${n} ticket${n === 1 ? '' : 's'} transferred`);
    }
    setTransfer(null);
  }

  return (
    <div>
      <div className="detail-header">
        <button className="back" onClick={onBack}>← Back</button>
        <h1>{game.matchup}</h1>
        <div className="meta">{dateLabel} · {game.time} · {game.venue}</div>
        <div className="meta" style={{ marginTop: 4 }}>
          Pitching: {game.pitchers.opp} vs. {game.pitchers.rays}
        </div>
        <div className="hero-rating-block">
          <div className="hero-rating-row">
            <Rating n={game.stars} size="lg" showLabel />
          </div>
          {game.ratingReasons && game.ratingReasons.length > 0 && (
            <div className="hero-reasons">
              <span className="hero-reasons-label">Why:</span>
              {game.ratingReasons.map((r, i) => (
                <span key={i} className="hero-reason-chip">{r}</span>
              ))}
            </div>
          )}
          <div className="hero-tier-hint">{RATING_TIERS[game.stars].hint}</div>
        </div>
        {game.promo && <div className="promo-big">{game.promo}</div>}
      </div>

      <div className="section-title">
        <h2>Your 4 seats</h2>
        <span className="hint">Click any seat or "Manage all seats" to bulk-assign.</span>
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn" onClick={() => setEditing(true)}>Manage all seats</button>
        </div>
      </div>

      <div className="seat-grid">
        {seats.map(seat => {
          const a = map[seat.id];
          const desc = describeAssignment(a, people, nonprofits);
          const person = a && a.kind === 'person' ? people.find(p => p.id === a.id) : null;
          return (
            <article key={seat.id} className={`seat ${seatClass(a)}`}>
              <header className="seat-head">
                <div>
                  <div className="seat-id">Seat {seat.number}</div>
                  <div className="seat-loc">{seat.label} · Sec {seat.section}, Row {seat.row}</div>
                </div>
                {a && a.kind === 'person' && a.transferred ? (
                  <span className="seat-lock-pill" title="Transferred — cannot be edited or re-sent">🔒 Locked</span>
                ) : (
                  <button className="seat-edit-btn" onClick={() => setEditing(true)} aria-label={`Edit seat ${seat.number}`}>
                    Edit
                  </button>
                )}
              </header>
              <div className="assignment">
                {desc ? (
                  <>
                    <div className="who-name">{desc.headline}</div>
                    <div className="who-sub">{desc.sub}</div>
                  </>
                ) : (
                  <>
                    <div className="who-name">No one assigned yet</div>
                    <div className="who-sub">Don't let this seat go to waste.</div>
                  </>
                )}
              </div>
              <div className="seat-actions">
                {a && a.kind === 'person' && person && !a.transferred && (
                  <button className="btn small secondary" onClick={() => openTransfer(seat, person)}>
                    🎟️ Transfer ticket
                  </button>
                )}
                {a && a.kind === 'nonprofit' && (
                  <button className="btn small secondary" onClick={() => openReceiptForSeat(seat, a)}>
                    📄 Tax receipt
                  </button>
                )}
                {!a && (
                  <button className="btn small" onClick={() => setEditing(true)}>
                    Assign this seat
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {editing && (
        <SeatsManagerDialog
          game={game}
          seats={seats}
          currentMap={map}
          people={people}
          nonprofits={nonprofits}
          onSaveAll={handleSaveAll}
          onClose={() => setEditing(false)}
        />
      )}

      {receipt && (
        <TaxReceiptModal
          game={game}
          nonprofit={receipt.nonprofit}
          seatCount={receipt.seatCount}
          onClose={() => setReceipt(null)}
        />
      )}

      {transfer && (
        <TransferTicketModal
          game={game}
          transfers={transfer.transfers}
          onComplete={handleTransferComplete}
          onClose={handleTransferDone}
        />
      )}

      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
