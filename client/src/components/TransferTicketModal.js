import React, { useEffect, useState } from 'react';

const METHODS = [
  {
    id: 'mlb',
    name: 'MLB Ballpark',
    sub: 'Recommended · official MLB app',
    glyph: '⚾',
    color: '#002D72',
  },
  {
    id: 'ticketmaster',
    name: 'Ticketmaster',
    sub: 'Forward via Ticketmaster Account Manager',
    glyph: 'TM',
    color: '#024DDF',
  },
  {
    id: 'wallet',
    name: 'Apple Wallet · SMS link',
    sub: 'Send a tap-to-add link by text',
    glyph: '',
    color: '#0e1116',
  },
];

const fmtPhoneStub = (name) => {
  const tail = Math.abs(name.split('').reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0)) % 9000 + 1000;
  return `(813) •••-${tail}`;
};

function useBodyScrollLock() {
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, []);
}

export const METHOD_LABEL = {
  mlb: 'MLB Ballpark',
  ticketmaster: 'Ticketmaster',
  wallet: 'Apple Wallet',
};

export default function TransferTicketModal({ game, transfers, onClose, onComplete }) {
  useBodyScrollLock();
  const [method, setMethod] = useState('mlb');
  const [stage, setStage] = useState('confirm');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (stage !== 'sending') return;
    const timers = [];
    timers.push(setTimeout(() => setProgress(1), 500));
    timers.push(setTimeout(() => setProgress(2), 1200));
    timers.push(setTimeout(() => setProgress(3), 2000));
    timers.push(setTimeout(() => {
      setStage('done');
      onComplete && onComplete({ method, transfers });
    }, 2400));
    return () => timers.forEach(clearTimeout);
  }, [stage, method, transfers, onComplete]);

  const chosenMethod = METHODS.find(m => m.id === method);
  const dateLabel = new Date(game.date + 'T12:00:00').toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric'
  });

  const isMulti = transfers.length > 1;
  const first = transfers[0];

  // Bundle the unique recipients for clean copy.
  const recipientList = transfers.map(t => t.person.name);
  const uniqueRecipients = [...new Set(recipientList)];
  const recipientSummary = uniqueRecipients.length === 1
    ? uniqueRecipients[0]
    : uniqueRecipients.length === 2
      ? `${uniqueRecipients[0]} and ${uniqueRecipients[1]}`
      : `${uniqueRecipients.slice(0, -1).join(', ')}, and ${uniqueRecipients.slice(-1)}`;

  return (
    <div className="modal-overlay" onClick={stage !== 'sending' ? onClose : undefined}>
      <div className="modal modal-transfer" onClick={e => e.stopPropagation()}>
        {/* TICKET CARD — single or stacked */}
        <div className={`transfer-ticket ${isMulti ? 'transfer-ticket-stacked' : ''}`}>
          {isMulti && <div className="transfer-stack-back" />}
          {isMulti && transfers.length > 2 && <div className="transfer-stack-back transfer-stack-back-2" />}
          <div className="transfer-ticket-stub">
            <div className="transfer-ticket-team">RAYS</div>
            <div className="transfer-ticket-label">2026</div>
          </div>
          <div className="transfer-ticket-body">
            <div className="transfer-ticket-eyebrow">
              {isMulti ? `${transfers.length} Diamond Club tickets` : `Diamond Club · Section ${first.seat.section}`}
            </div>
            <div className="transfer-ticket-matchup">{game.matchup}</div>
            <div className="transfer-ticket-meta">{dateLabel} · {game.time} · Tropicana Field</div>
            {!isMulti ? (
              <div className="transfer-ticket-grid">
                <div>
                  <div className="transfer-mini-label">Seat</div>
                  <div className="transfer-mini-value">Sec {first.seat.section}, Row {first.seat.row}, #{first.seat.number}</div>
                </div>
                <div>
                  <div className="transfer-mini-label">Transferring to</div>
                  <div className="transfer-mini-value">{first.person.name}</div>
                  <div className="transfer-mini-sub">{fmtPhoneStub(first.person.name)}</div>
                </div>
              </div>
            ) : (
              <div className="transfer-batch-list">
                {transfers.map(({ seat, person }) => (
                  <div className="transfer-batch-row" key={seat.id}>
                    <span className="transfer-batch-seat">Seat {seat.number}</span>
                    <span className="transfer-batch-arrow">→</span>
                    <span className="transfer-batch-person">{person.name}</span>
                    <span className="transfer-batch-phone">{fmtPhoneStub(person.name)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="transfer-ticket-barcode" aria-hidden>
            {Array.from({ length: 32 }).map((_, i) => (
              <span key={i} style={{ width: 1 + (i % 3) }} />
            ))}
          </div>
        </div>

        {stage === 'confirm' && (
          <>
            <div className="modal-body">
              <h3 className="transfer-section-title">Choose transfer method</h3>
              <div className="transfer-methods">
                {METHODS.map(m => (
                  <button
                    key={m.id}
                    className={`transfer-method ${method === m.id ? 'active' : ''}`}
                    onClick={() => setMethod(m.id)}
                  >
                    <span className="transfer-method-glyph" style={{ background: m.color }}>
                      {m.glyph || ''}
                      {m.id === 'wallet' && <span className="wallet-glyph" />}
                    </span>
                    <span className="transfer-method-text">
                      <span className="transfer-method-name">{m.name}</span>
                      <span className="transfer-method-sub">{m.sub}</span>
                    </span>
                    {method === m.id && <span className="transfer-method-check">✓</span>}
                  </button>
                ))}
              </div>
              <div className="transfer-disclosure">
                {isMulti
                  ? `${transfers.length} barcodes will be revoked from your wallet and reissued to each recipient's phone. Recipients have 24 hours to accept.`
                  : `The barcode for Seat ${first.seat.number} will be revoked from your wallet and reissued to ${first.person.name}'s phone. They have 24 hours to accept.`}
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn secondary" onClick={onClose}>Cancel</button>
              <button className="btn" onClick={() => { setStage('sending'); setProgress(0); }}>
                Send {isMulti ? `all ${transfers.length}` : 'ticket'} via {chosenMethod.name} →
              </button>
            </div>
          </>
        )}

        {stage === 'sending' && (
          <div className="modal-body">
            <h3 className="transfer-section-title">Transferring through {chosenMethod.name}…</h3>
            <ol className="transfer-steps">
              <li className={progress >= 1 ? 'done' : progress === 0 ? 'active' : ''}>
                <span className="step-dot" />
                Generating secure transfer link{isMulti ? 's' : ''}
              </li>
              <li className={progress >= 2 ? 'done' : progress === 1 ? 'active' : ''}>
                <span className="step-dot" />
                Notifying {isMulti ? `${uniqueRecipients.length} recipient${uniqueRecipients.length === 1 ? '' : 's'}` : first.person.name} via SMS
              </li>
              <li className={progress >= 3 ? 'done' : progress === 2 ? 'active' : ''}>
                <span className="step-dot" />
                Adding ticket{isMulti ? 's' : ''} to {isMulti ? 'their wallets' : 'their wallet'}
              </li>
            </ol>
          </div>
        )}

        {stage === 'done' && (
          <>
            <div className="modal-body">
              <div className="transfer-success">
                <div className="transfer-success-check">✓</div>
                <h3>{isMulti ? `${transfers.length} tickets transferred` : 'Transfer complete'}</h3>
                <p>{recipientSummary} {uniqueRecipients.length === 1 ? 'has' : 'have'} been notified — tickets are in {uniqueRecipients.length === 1 ? 'their' : 'their'} Apple Wallet.</p>
              </div>

              <div className="transfer-sms-preview">
                <div className="sms-bubble-header">SMS · {fmtPhoneStub(first.person.name)}</div>
                <div className="sms-bubble">
                  ⚾ Pat Cowan sent you a Rays ticket: <strong>{game.matchup}</strong> · {dateLabel} · Sec {first.seat.section} Row {first.seat.row}, Seat {first.seat.number}.
                  Tap to add to your wallet: <span className="sms-link">mlb.app/t/9k3{first.seat.number}</span>
                </div>
                {isMulti && (
                  <div className="sms-and-others">
                    + {transfers.length - 1} similar message{transfers.length - 1 === 1 ? '' : 's'} sent to other recipient{transfers.length - 1 === 1 ? '' : 's'}.
                  </div>
                )}
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn" onClick={onClose}>Done</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
