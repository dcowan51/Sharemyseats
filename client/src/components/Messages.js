import React, { useMemo, useState } from 'react';
import { getGameById } from '../data/games';

function fmtDate(d) {
  if (!d) return '';
  return new Date(d + 'T12:00:00').toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric'
  });
}

function PhotoCard({ seed }) {
  // Use picsum.photos with a seed for stable, attractive imagery in the demo.
  // If offline, the gradient fallback shows through.
  const url = `https://picsum.photos/seed/${encodeURIComponent(seed || 'rays')}/800/520`;
  return (
    <div className="msg-photo">
      <img src={url} alt="" loading="lazy" />
      <div className="msg-photo-fallback">📷</div>
    </div>
  );
}

export default function Messages({ messages, nonprofits, onSimulateUpload }) {
  const [filter, setFilter] = useState('all'); // all | received | pending

  const sorted = useMemo(() => {
    const list = [...messages].sort((a, b) => {
      const ad = a.receivedDate || a.createdDate || '';
      const bd = b.receivedDate || b.createdDate || '';
      return bd.localeCompare(ad);
    });
    if (filter === 'all') return list;
    return list.filter(m => m.status === filter);
  }, [messages, filter]);

  const counts = useMemo(() => {
    const r = messages.filter(m => m.status === 'received').length;
    const p = messages.filter(m => m.status === 'pending').length;
    return { r, p };
  }, [messages]);

  return (
    <div>
      <div className="section-title">
        <h1>Impact Stories</h1>
        <span className="hint">
          Closing the loop — when you donate seats, nonprofits send back a photo and a note from the people who went.
        </span>
      </div>

      <div className="stat-grid">
        <div className="card stat donate">
          <div className="num">{counts.r}</div>
          <div className="label">Stories received</div>
        </div>
        <div className="card stat warn">
          <div className="num">{counts.p}</div>
          <div className="label">Awaiting nonprofit upload</div>
        </div>
        <div className="card stat">
          <div className="num">{messages.reduce((n, m) => n + (m.seatCount || 0), 0)}</div>
          <div className="label">Total seats donated</div>
        </div>
      </div>

      <div className="toolbar">
        <div className="toggle">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'received' ? 'active' : ''} onClick={() => setFilter('received')}>Received</button>
          <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>Awaiting upload</button>
        </div>
      </div>

      {sorted.length === 0 && (
        <div className="card empty-msg">
          No stories yet. Donate a seat in the Schedule tab and you'll see it here.
        </div>
      )}

      <div className="msg-list">
        {sorted.map(m => {
          const np = nonprofits.find(n => n.id === m.nonprofitId);
          const game = getGameById(m.gameId);
          if (m.status === 'pending') {
            return (
              <div key={m.id} className="msg-card msg-pending">
                <div className="msg-pending-art">⏳</div>
                <div className="msg-body">
                  <div className="msg-from">
                    <strong>{np?.name || 'Nonprofit'}</strong>
                    <span className="msg-meta"> · {m.seatCount} seat{m.seatCount === 1 ? '' : 's'} donated</span>
                  </div>
                  <div className="msg-game">
                    {game?.matchup} · {fmtDate(game?.date)} · {game?.time}
                  </div>
                  <div className="msg-status">
                    Awaiting photo &amp; note from the nonprofit. They have until 7 days after the game to post.
                  </div>
                  <button className="btn small donate" onClick={() => onSimulateUpload(m.id)}>
                    Simulate nonprofit upload (demo)
                  </button>
                </div>
              </div>
            );
          }
          return (
            <div key={m.id} className="msg-card">
              <PhotoCard seed={m.photoSeed} />
              <div className="msg-body">
                <div className="msg-from">
                  <strong>{np?.name || 'Nonprofit'}</strong>
                  <span className="msg-meta"> · {fmtDate(m.receivedDate)}</span>
                </div>
                <div className="msg-game">
                  {game?.matchup} · {fmtDate(game?.date)} · {m.seatCount} seat{m.seatCount === 1 ? '' : 's'}
                </div>
                {m.caption && <div className="msg-caption">"{m.caption}"</div>}
                {m.note && <div className="msg-note">{m.note}</div>}
                {m.contactName && <div className="msg-signoff">— {m.contactName}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
