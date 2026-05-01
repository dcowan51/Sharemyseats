// Demo nonprofits for ticket donations. Each has eligibility rules
// describing WHEN they can accept tickets.
//
// Eligibility fields:
//   weekday:   true if they accept Mon-Fri games
//   weekend:   true if they accept Sat-Sun games
//   minAdvanceDays:  tickets must be donated at least N days before game
//   minAdvanceHours: optional finer cutoff (e.g. 4 = up to 4 hours before first pitch).
//                    When set, this overrides minAdvanceDays for same-day windows.
//   maxAdvanceDays:  optional cap — won't accept tickets too far out
//
// All organizations below are realistic Tampa Bay-area examples used
// for demo purposes only.

export const DEFAULT_NONPROFITS = [
  {
    id: 'np-bbbs',
    name: 'Big Brothers Big Sisters of Tampa Bay',
    mission: 'Mentorship for youth across the Tampa Bay region.',
    eligibility: {
      weekday: true,
      weekend: true,
      minAdvanceDays: 3,
      maxAdvanceDays: 60,
      notes: 'Accepts most games; 3+ days notice needed to match a Big & Little.',
    },
  },
  {
    id: 'np-bgc',
    name: 'Boys & Girls Clubs of the Suncoast',
    mission: 'After-school programs for kids ages 6-18.',
    eligibility: {
      weekday: true,
      weekend: false,
      minAdvanceDays: 7,
      maxAdvanceDays: 45,
      notes: 'Weekday games only — pairs with after-school transport.',
    },
  },
  {
    id: 'np-metmin',
    name: 'Metropolitan Ministries',
    mission: 'Support for families experiencing homelessness and poverty.',
    eligibility: {
      weekday: false,
      weekend: true,
      minAdvanceDays: 5,
      maxAdvanceDays: null,
      notes: 'Weekend games only — fits family programming schedule.',
    },
  },
  {
    id: 'np-pepin',
    name: 'Pepin Academies',
    mission: 'Schools for students with learning differences.',
    eligibility: {
      weekday: true,
      weekend: false,
      minAdvanceDays: 14,
      maxAdvanceDays: null,
      notes: 'Weekday games — needs 2 weeks notice for parent permission slips.',
    },
  },
  {
    id: 'np-stpfree',
    name: 'St. Pete Free Clinic',
    mission: 'Free healthcare and food programs for under-resourced neighbors.',
    eligibility: {
      weekday: true,
      weekend: true,
      minAdvanceDays: 2,
      maxAdvanceDays: 30,
      notes: 'Flexible scheduling — accepts last-minute donations.',
    },
  },
  {
    id: 'np-akp',
    name: 'A Kid’s Place of Tampa Bay',
    mission: 'Residential care for children removed from their homes.',
    eligibility: {
      weekday: false,
      weekend: true,
      minAdvanceDays: 10,
      maxAdvanceDays: null,
      notes: 'Weekend games only — coordinates with house parent schedules.',
    },
  },
  {
    id: 'np-tbfrf',
    name: 'Tampa Bay First Responders Foundation',
    mission:
      'Supports active police, firefighters, EMS, and military veterans across the Tampa Bay region — modeled on Arizona’s 100 Club.',
    eligibility: {
      weekday: true,
      weekend: true,
      minAdvanceDays: 0,
      minAdvanceHours: 4,
      maxAdvanceDays: null,
      notes:
        'Same-day pickup — accepts donations up to 4 hours before first pitch. Tickets are routed to on-duty crews coming off shift.',
    },
  },
];

// Decide whether a nonprofit can accept a given game right now.
export function nonprofitCanAccept(np, game, now = new Date()) {
  const reasons = [];
  const e = np.eligibility;

  if (game.isWeekend && !e.weekend) reasons.push('does not accept weekend games');
  if (!game.isWeekend && !e.weekday) reasons.push('does not accept weekday games');

  // Compute how far out the actual first pitch is.
  const firstPitch = new Date(`${game.date}T${game.timeRaw || '19:10'}:00`);
  const ms = firstPitch - now;
  const hoursOut = ms / (1000 * 60 * 60);
  const daysOut = Math.floor(hoursOut / 24);

  // Hour-level cutoff (e.g. same-day groups). If set, it's authoritative.
  if (e.minAdvanceHours != null) {
    if (hoursOut < e.minAdvanceHours) {
      reasons.push(`needs ${e.minAdvanceHours}+ hours notice before first pitch`);
    }
  } else if (daysOut < (e.minAdvanceDays ?? 0)) {
    reasons.push(`needs ${e.minAdvanceDays}+ days notice`);
  }

  if (e.maxAdvanceDays != null && daysOut > e.maxAdvanceDays) {
    reasons.push(`won’t accept more than ${e.maxAdvanceDays} days out`);
  }
  return { ok: reasons.length === 0, reasons, daysOut, hoursOut };
}
