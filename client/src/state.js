import { useEffect, useState, useCallback } from 'react';
import { SEATS } from './data/seats';
import { GAMES } from './data/games';
import { DEFAULT_PEOPLE } from './data/people';
import { DEFAULT_NONPROFITS } from './data/nonprofits';
import { SEED_MESSAGES } from './data/messages';
import { buildSeedAssignments, buildSeedMessages } from './data/seed';

const STORAGE_KEY = 'sharemyseats.v2';

// Assignment shape: { kind: 'person'|'nonprofit'|'unused'|'claimed'|null, id?: string }
// Game state shape: { [seatId]: assignment }

function freshDemoState() {
  const assignments = buildSeedAssignments();
  const messages = buildSeedMessages(assignments, SEED_MESSAGES);
  return {
    assignments,
    people: DEFAULT_PEOPLE,
    nonprofits: DEFAULT_NONPROFITS,
    messages,
  };
}

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        assignments: parsed.assignments || {},
        people: parsed.people || DEFAULT_PEOPLE,
        nonprofits: parsed.nonprofits || DEFAULT_NONPROFITS,
        messages: parsed.messages || SEED_MESSAGES,
      };
    }
  } catch (e) {
    // ignore
  }
  // First load — seed past games with demo data so the app feels lived-in.
  return freshDemoState();
}

export function useAppState() {
  const [state, setState] = useState(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // ignore
    }
  }, [state]);

  const assignSeat = useCallback((gameId, seatId, assignment) => {
    setState(s => {
      const gameMap = { ...(s.assignments[gameId] || {}) };
      if (!assignment) {
        delete gameMap[seatId];
      } else {
        gameMap[seatId] = assignment;
      }
      return { ...s, assignments: { ...s.assignments, [gameId]: gameMap } };
    });
  }, []);

  const addPerson = useCallback((person) => {
    setState(s => ({ ...s, people: [...s.people, person] }));
  }, []);

  const removePerson = useCallback((personId) => {
    setState(s => ({ ...s, people: s.people.filter(p => p.id !== personId) }));
  }, []);

  const reset = useCallback(() => {
    setState(freshDemoState());
  }, []);

  const clearAll = useCallback(() => {
    setState({
      assignments: {},
      people: DEFAULT_PEOPLE,
      nonprofits: DEFAULT_NONPROFITS,
      messages: SEED_MESSAGES,
    });
  }, []);

  // Record that a donation was made — nonprofit hasn't posted yet.
  const recordDonation = useCallback((gameId, nonprofitId, seatCount) => {
    setState(s => {
      // Merge with an existing pending message for the same game+np if present.
      const existing = s.messages.find(
        m => m.gameId === gameId && m.nonprofitId === nonprofitId && m.status === 'pending'
      );
      if (existing) {
        const updated = s.messages.map(m =>
          m.id === existing.id ? { ...m, seatCount } : m
        );
        return { ...s, messages: updated };
      }
      const id = 'm-' + Math.random().toString(36).slice(2, 9);
      const newMsg = {
        id,
        gameId,
        nonprofitId,
        seatCount,
        status: 'pending',
        createdDate: new Date().toISOString().slice(0, 10),
      };
      return { ...s, messages: [newMsg, ...s.messages] };
    });
  }, []);

  // Demo helper: simulate the nonprofit posting their thank-you.
  const simulateUpload = useCallback((messageId) => {
    setState(s => {
      const messages = s.messages.map(m => {
        if (m.id !== messageId) return m;
        return {
          ...m,
          status: 'received',
          receivedDate: new Date().toISOString().slice(0, 10),
          photoSeed: 'rays-' + m.id,
          caption: 'A wonderful afternoon at the Trop, thanks to you.',
          note:
            'We can\'t thank you enough for these tickets. Our group had a fantastic time and the kids were still talking about it on the bus ride home. We will absolutely be sending more details and photos through your portal in the coming days.',
          contactName: (s.nonprofits.find(n => n.id === m.nonprofitId)?.name || 'Nonprofit') + ' Team',
        };
      });
      return { ...s, messages };
    });
  }, []);

  return {
    games: GAMES,
    seats: SEATS,
    people: state.people,
    nonprofits: state.nonprofits,
    assignments: state.assignments,
    messages: state.messages,
    assignSeat,
    addPerson,
    removePerson,
    recordDonation,
    simulateUpload,
    reset,
    clearAll,
  };
}

// Helpers — operate on a games + assignments view.
export function gameStatus(game, assignments, seats) {
  const map = assignments[game.id] || {};
  const total = seats.length;
  let assigned = 0, donated = 0, unused = 0, claimed = 0;
  for (const seat of seats) {
    const a = map[seat.id];
    if (!a) continue;
    if (a.kind === 'person') assigned++;
    else if (a.kind === 'nonprofit') donated++;
    else if (a.kind === 'unused') unused++;
    else if (a.kind === 'claimed') claimed++;
  }
  const handled = assigned + donated + unused + claimed;
  const open = total - handled;
  let key = 'warn'; // default: needs action
  let label = `${open} seat${open === 1 ? '' : 's'} open`;
  if (open === 0) {
    if (donated > 0 && assigned === 0) {
      key = 'donate';
      label = donated === total ? 'All donated' : 'Set';
    } else {
      key = 'good';
      label = 'Set';
    }
  }
  return { key, label, total, assigned, donated, unused, claimed, open };
}

export function totalSeatStats(games, assignments, seats) {
  let totalSeats = 0, assigned = 0, donated = 0, unused = 0, claimed = 0, open = 0;
  for (const g of games) {
    const s = gameStatus(g, assignments, seats);
    totalSeats += s.total;
    assigned += s.assigned;
    donated += s.donated;
    unused += s.unused;
    claimed += s.claimed;
    open += s.open;
  }
  return { totalSeats, assigned: assigned + claimed, donated, unused, open };
}
