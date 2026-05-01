import React, { useEffect, useMemo, useState } from 'react';
import { nonprofitCanAccept } from '../data/nonprofits';
import { METHOD_LABEL } from './TransferTicketModal';

function useBodyScrollLock() {
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, []);
}

// Encoded select values:
//   '' / 'clear'           = no assignment (open)
//   'taken'                = marked taken (no specific name)
//   'unused'               = explicitly not used
//   'person:<id>'          = assigned to a specific person
//   'nonprofit:<id>'       = donated to a nonprofit
function encode(a) {
  if (!a) return 'clear';
  if (a.kind === 'unused') return 'unused';
  if (a.kind === 'claimed') return 'taken';
  if (a.kind === 'person') return `person:${a.id}`;
  if (a.kind === 'nonprofit') return `nonprofit:${a.id}`;
  return 'clear';
}
function decode(v) {
  if (!v || v === 'clear') return null;
  if (v === 'unused') return { kind: 'unused' };
  if (v === 'taken') return { kind: 'claimed' };
  if (v.startsWith('person:')) return { kind: 'person', id: v.slice(7) };
  if (v.startsWith('nonprofit:')) return { kind: 'nonprofit', id: v.slice(10) };
  return null;
}

export default function SeatsManagerDialog({ game, seats, currentMap, people, nonprofits, onSaveAll, onClose }) {
  useBodyScrollLock();
  const [pending, setPending] = useState(() => {
    const m = {};
    for (const s of seats) m[s.id] = encode(currentMap[s.id]);
    return m;
  });
  const [showDonatePicker, setShowDonatePicker] = useState(false);

  const family = people.filter(p => p.group === 'Family');
  const friends = people.filter(p => p.group === 'Friends');

  const eligibility = useMemo(() => {
    const m = {};
    for (const np of nonprofits) m[np.id] = nonprofitCanAccept(np, game);
    return m;
  }, [nonprofits, game]);

  const eligibleNonprofits = nonprofits.filter(np => eligibility[np.id].ok);

  // Locked seats — their tickets have already been transferred and can't be modified.
  const lockedSeats = new Set(
    seats.filter(s => {
      const a = currentMap[s.id];
      return a && a.kind === 'person' && a.transferred;
    }).map(s => s.id)
  );

  const setSeat = (seatId, val) => {
    if (lockedSeats.has(seatId)) return;
    setPending(p => ({ ...p, [seatId]: val }));
  };

  const applyToAll = (val) => {
    setPending(prev => {
      const next = { ...prev };
      for (const s of seats) {
        if (lockedSeats.has(s.id)) continue; // skip locked seats
        next[s.id] = val;
      }
      return next;
    });
  };

  const editableCount = seats.length - lockedSeats.size;

  function save() {
    const out = {};
    for (const s of seats) out[s.id] = decode(pending[s.id]);
    onSaveAll(out, /* andTransfer */ false);
  }

  function saveAndTransfer() {
    const out = {};
    for (const s of seats) out[s.id] = decode(pending[s.id]);
    onSaveAll(out, /* andTransfer */ true);
  }

  // Count person-assignments to enable/disable "Save & transfer".
  const personAssignCount = Object.values(pending).filter(v => v && v.startsWith && v.startsWith('person:')).length;

  const dateLabel = new Date(game.date + 'T12:00:00').toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  // Tally pending state for the live summary.
  const summary = useMemo(() => {
    let taken = 0, donated = 0, unused = 0, open = 0;
    for (const s of seats) {
      const v = pending[s.id];
      if (!v || v === 'clear') open++;
      else if (v === 'taken') taken++;
      else if (v === 'unused') unused++;
      else if (v.startsWith('person:')) taken++;
      else if (v.startsWith('nonprofit:')) donated++;
    }
    return { taken, donated, unused, open };
  }, [pending, seats]);

  // Reused option list for each per-seat select.
  const renderOptions = () => (
    <>
      <option value="clear">— Open / not yet handled —</option>
      <option value="taken">Taken (no specific name)</option>
      <option value="unused">Mark unused</option>
      <optgroup label="Family">
        {family.map(p => (
          <option key={p.id} value={`person:${p.id}`}>{p.name} ({p.relation})</option>
        ))}
      </optgroup>
      <optgroup label="Friends">
        {friends.map(p => (
          <option key={p.id} value={`person:${p.id}`}>{p.name} ({p.relation})</option>
        ))}
      </optgroup>
      <optgroup label="Donate to nonprofit">
        {nonprofits.map(np => {
          const e = eligibility[np.id];
          const label = e.ok ? np.name : `${np.name} — ${e.reasons[0]}`;
          return (
            <option key={np.id} value={`nonprofit:${np.id}`} disabled={!e.ok}>
              {label}
            </option>
          );
        })}
      </optgroup>
    </>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Manage all 4 seats</h2>
          <p style={{ color: 'var(--ink-soft)', margin: 0 }}>
            {game.matchup} · {dateLabel} · {game.time}
          </p>
        </div>

        <div className="modal-body">
          <div className="quick-bar">
            <div className="quick-bar-title">
              Quick actions
              {lockedSeats.size > 0 && (
                <span className="quick-bar-locknote">
                  · {lockedSeats.size} seat{lockedSeats.size === 1 ? '' : 's'} locked (already transferred)
                </span>
              )}
            </div>
            <div className="quick-buttons">
              <button className="btn quick" onClick={() => applyToAll('taken')} disabled={editableCount === 0}>
                ✓ Mark {editableCount === seats.length ? `all ${seats.length}` : editableCount} taken
              </button>
              <button className="btn quick donate" onClick={() => setShowDonatePicker(v => !v)} disabled={editableCount === 0}>
                ♥ Donate {editableCount === seats.length ? `all ${seats.length}` : editableCount}
              </button>
              <button className="btn quick warn" onClick={() => applyToAll('clear')} disabled={editableCount === 0}>
                ↺ Clear {editableCount === seats.length ? 'all' : `${editableCount}`}
              </button>
            </div>
            {showDonatePicker && (
              <div className="quick-donate-list">
                {eligibleNonprofits.length === 0 && (
                  <div className="empty-msg" style={{ padding: 8 }}>
                    No nonprofits can accept this game right now (check advance-notice rules).
                  </div>
                )}
                {eligibleNonprofits.map(np => (
                  <button
                    key={np.id}
                    className="choice"
                    onClick={() => { applyToAll(`nonprofit:${np.id}`); setShowDonatePicker(false); }}
                  >
                    <div>
                      <div className="name">{np.name}</div>
                      <div className="sub">{np.mission}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="summary-strip">
            <span className="chip chip-good">{summary.taken} taken</span>
            <span className="chip chip-donate">{summary.donated} donated</span>
            {summary.unused > 0 && <span className="chip chip-mute">{summary.unused} unused</span>}
            <span className={`chip ${summary.open > 0 ? 'chip-warn' : 'chip-mute'}`}>
              {summary.open} open
            </span>
          </div>

          <div className="seat-rows">
            {seats.map(seat => {
              const isLocked = lockedSeats.has(seat.id);
              const lockedAssignment = isLocked ? currentMap[seat.id] : null;
              const lockedPerson = lockedAssignment && people.find(p => p.id === lockedAssignment.id);
              return (
                <div className={`seat-row ${isLocked ? 'seat-row-locked' : ''}`} key={seat.id}>
                  <div className="seat-row-label">
                    <div className="seat-num">Seat {seat.number}</div>
                    <div className="seat-sub">{seat.label} · Sec {seat.section}, Row {seat.row}</div>
                  </div>
                  {isLocked ? (
                    <div className="seat-locked-state">
                      <span className="seat-lock-icon" aria-hidden>🔒</span>
                      <div>
                        <div className="seat-lock-name">
                          {lockedPerson ? lockedPerson.name : 'Recipient'}
                        </div>
                        <div className="seat-lock-meta">
                          Transferred via {METHOD_LABEL[lockedAssignment.transferMethod] || 'MLB Ballpark'}
                          {lockedAssignment.transferredAt ? ` · ${lockedAssignment.transferredAt}` : ''}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <select
                      className="filter-input"
                      value={pending[seat.id] ?? 'clear'}
                      onChange={e => setSeat(seat.id, e.target.value)}
                      aria-label={`Assignment for seat ${seat.number}`}
                    >
                      {renderOptions()}
                    </select>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bulk-callout">
            <span className="bulk-callout-icon">💡</span>
            <div>
              <strong>Quick tip.</strong> Use <em>Taken</em> when you just want to mark a seat handled without picking a specific person. Choose a name to track who's going.
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <button className="btn secondary" onClick={onClose}>Cancel</button>
          <button className="btn secondary" onClick={save}>Save</button>
          <button
            className="btn"
            onClick={saveAndTransfer}
            disabled={personAssignCount === 0}
            title={personAssignCount === 0 ? 'Assign a seat to someone first' : 'Save and send tickets via MLB Ballpark / Ticketmaster / Apple Wallet'}
          >
            Save &amp; transfer{personAssignCount > 0 ? ` ${personAssignCount}` : ''} →
          </button>
        </div>
      </div>
    </div>
  );
}
