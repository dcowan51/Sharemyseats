// Generates demo seed assignments so the app feels lived-in for a meeting demo.
// Strategy: every game on or before "today" gets all 4 seats filled with a
// realistic mix of family, friends, nonprofit donations, and "taken" entries.
// Future games are left open so the demo has open seats to interact with.

import { GAMES } from './games';
import { SEATS } from './seats';
import { DEFAULT_PEOPLE } from './people';
import { DEFAULT_NONPROFITS } from './nonprofits';

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Seeded RNG so the demo is deterministic across reloads and devices.
function rngFor(seedStr) {
  let s = hashStr(seedStr) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return ((s >>> 0) % 100000) / 100000;
  };
}

export function buildSeedAssignments() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const family = DEFAULT_PEOPLE.filter(p => p.group === 'Family');
  const friends = DEFAULT_PEOPLE.filter(p => p.group === 'Friends');

  const assignments = {};
  for (const game of GAMES) {
    const gameDate = new Date(game.date + 'T12:00:00');
    if (gameDate >= today) continue; // future games left open

    const rng = rngFor('seed:' + game.id);
    const map = {};
    for (let i = 0; i < SEATS.length; i++) {
      const seat = SEATS[i];
      const roll = rng();

      if (roll < 0.55) {
        // 55% — assigned to a family member or friend
        const pool = rng() < 0.45 ? family : friends;
        const person = pool[Math.floor(rng() * pool.length)];
        map[seat.id] = { kind: 'person', id: person.id };
      } else if (roll < 0.80) {
        // 25% — donated to an eligible-by-rule nonprofit
        const eligible = DEFAULT_NONPROFITS.filter(np => {
          const e = np.eligibility;
          if (game.isWeekend && !e.weekend) return false;
          if (!game.isWeekend && !e.weekday) return false;
          return true;
        });
        if (eligible.length > 0) {
          const np = eligible[Math.floor(rng() * eligible.length)];
          map[seat.id] = { kind: 'nonprofit', id: np.id };
        } else {
          map[seat.id] = { kind: 'claimed' };
        }
      } else if (roll < 0.95) {
        // 15% — marked taken (no specific name)
        map[seat.id] = { kind: 'claimed' };
      } else {
        // 5% — unused (rare)
        map[seat.id] = { kind: 'unused' };
      }
    }
    assignments[game.id] = map;
  }
  return assignments;
}

// Build seed messages tied to past donations so the Impact tab feels populated too.
export function buildSeedMessages(assignments, baseSeeds) {
  const out = [...baseSeeds];
  const seen = new Set(baseSeeds.map(m => `${m.gameId}:${m.nonprofitId}`));

  for (const gameId of Object.keys(assignments)) {
    const map = assignments[gameId];
    const counts = {};
    for (const sid of Object.keys(map)) {
      const a = map[sid];
      if (a && a.kind === 'nonprofit') {
        counts[a.id] = (counts[a.id] || 0) + 1;
      }
    }
    for (const npId of Object.keys(counts)) {
      const key = `${gameId}:${npId}`;
      if (seen.has(key)) continue;
      // ~70% of past donations have already received a thank-you, rest pending.
      const rng = rngFor('msg:' + gameId + ':' + npId);
      const received = rng() < 0.70;
      const game = GAMES.find(g => g.id === gameId);
      const baseDate = game ? game.date : '2026-04-15';
      out.push({
        id: 'm-auto-' + Math.random().toString(36).slice(2, 8) + npId.slice(-3),
        nonprofitId: npId,
        gameId,
        seatCount: counts[npId],
        status: received ? 'received' : 'pending',
        ...(received ? {
          receivedDate: baseDate,
          photoSeed: 'rays-' + gameId + '-' + npId,
          caption: pickCaption(rng),
          note: pickNote(rng),
          contactName: 'Programs Team',
        } : {
          createdDate: baseDate,
        }),
      });
      seen.add(key);
    }
  }
  return out;
}

const CAPTIONS = [
  'A wonderful afternoon at the Trop, thanks to you.',
  'First MLB game ever for everyone in our group!',
  'Look at those smiles — straight from Diamond Club seats.',
  'A perfect Sunday, thanks for thinking of us.',
  'Our group had the time of their lives.',
];
const NOTES = [
  'We can\'t thank you enough — these seats made an unforgettable day for our group. The kids are still talking about the on-deck circle being right there.',
  'The whole crew came home buzzing. One of our youth said it was the best day of his year. Truly grateful.',
  'These tickets meant so much. Our families don\'t get experiences like this often, and your generosity made it happen.',
  'Thank you, thank you, thank you. We are sending this photo with the biggest smiles you have ever seen.',
];

function pickCaption(rng) { return CAPTIONS[Math.floor(rng() * CAPTIONS.length)]; }
function pickNote(rng)    { return NOTES[Math.floor(rng() * NOTES.length)]; }
