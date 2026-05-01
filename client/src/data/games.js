// Regular-season home games at Tropicana Field, 2026.
// Source: GameTicketPromotionPrice.csv (Tropicana Field rows only).
// Times are local (ET). Spring Training games are not included.

const RAW = [
  ['2026-04-06', '16:10', 'Cubs'],
  ['2026-04-07', '18:40', 'Cubs'],
  ['2026-04-08', '18:40', 'Cubs'],
  ['2026-04-10', '19:10', 'Yankees'],
  ['2026-04-11', '18:10', 'Yankees'],
  ['2026-04-12', '13:40', 'Yankees'],
  ['2026-04-20', '18:40', 'Reds'],
  ['2026-04-21', '18:40', 'Reds'],
  ['2026-04-22', '13:10', 'Reds'],
  ['2026-04-24', '19:10', 'Twins'],
  ['2026-04-25', '16:10', 'Twins'],
  ['2026-04-26', '13:40', 'Twins'],
  ['2026-05-01', '19:10', 'Giants'],
  ['2026-05-02', '18:10', 'Giants'],
  ['2026-05-03', '13:40', 'Giants'],
  ['2026-05-04', '18:40', 'Blue Jays'],
  ['2026-05-05', '18:40', 'Blue Jays'],
  ['2026-05-06', '13:10', 'Blue Jays'],
  ['2026-05-15', '19:10', 'Marlins'],
  ['2026-05-16', '16:10', 'Marlins'],
  ['2026-05-17', '12:15', 'Marlins'],
  ['2026-05-18', '18:40', 'Orioles'],
  ['2026-05-19', '18:40', 'Orioles'],
  ['2026-05-20', '13:10', 'Orioles'],
  ['2026-05-29', '19:10', 'Angels'],
  ['2026-05-30', '16:10', 'Angels'],
  ['2026-05-31', '13:40', 'Angels'],
  ['2026-06-01', '18:40', 'Tigers'],
  ['2026-06-02', '18:40', 'Tigers'],
  ['2026-06-03', '13:10', 'Tigers'],
  ['2026-06-08', '18:40', 'Red Sox'],
  ['2026-06-09', '18:40', 'Red Sox'],
  ['2026-06-10', '13:10', 'Red Sox'],
  ['2026-06-19', '19:10', 'Nationals'],
  ['2026-06-20', '16:10', 'Nationals'],
  ['2026-06-21', '13:40', 'Nationals'],
  ['2026-06-22', '18:40', 'Royals'],
  ['2026-06-23', '18:40', 'Royals'],
  ['2026-06-24', '18:40', 'Royals'],
  ['2026-06-25', '12:10', 'Royals'],
  ['2026-06-26', '19:10', 'D-backs'],
  ['2026-06-27', '18:10', 'D-backs'],
  ['2026-06-28', '13:40', 'D-backs'],
  ['2026-07-06', '18:40', 'Yankees'],
  ['2026-07-07', '18:40', 'Yankees'],
  ['2026-07-08', '18:40', 'Yankees'],
  ['2026-07-09', '13:10', 'Yankees'],
  ['2026-07-10', '19:10', 'Mariners'],
  ['2026-07-11', '16:10', 'Mariners'],
  ['2026-07-12', '13:40', 'Mariners'],
  ['2026-07-24', '19:10', 'Guardians'],
  ['2026-07-25', '18:10', 'Guardians'],
  ['2026-07-26', '12:15', 'Guardians'],
  ['2026-07-28', '18:40', 'Rangers'],
  ['2026-07-29', '18:40', 'Rangers'],
  ['2026-07-30', '12:10', 'Rangers'],
  ['2026-07-31', '19:10', 'White Sox'],
  ['2026-08-01', '16:10', 'White Sox'],
  ['2026-08-02', '13:40', 'White Sox'],
  ['2026-08-14', '19:10', 'Orioles'],
  ['2026-08-15', '18:10', 'Orioles'],
  ['2026-08-16', '12:15', 'Orioles'],
  ['2026-08-17', '18:40', 'Orioles'],
  ['2026-08-18', '18:40', 'Blue Jays'],
  ['2026-08-19', '18:40', 'Blue Jays'],
  ['2026-08-20', '13:10', 'Blue Jays'],
  ['2026-08-28', '19:10', 'Padres'],
  ['2026-08-29', '16:10', 'Padres'],
  ['2026-08-30', '13:40', 'Padres'],
  ['2026-08-31', '18:40', 'Mets'],
  ['2026-09-01', '18:40', 'Mets'],
  ['2026-09-02', '18:40', 'Mets'],
  ['2026-09-11', '19:10', 'Astros'],
  ['2026-09-12', '18:10', 'Astros'],
  ['2026-09-13', '13:40', 'Astros'],
  ['2026-09-15', '18:40', 'Athletics'],
  ['2026-09-16', '18:40', 'Athletics'],
  ['2026-09-17', '13:10', 'Athletics'],
  ['2026-09-18', '19:10', 'Red Sox'],
  ['2026-09-19', '16:10', 'Red Sox'],
  ['2026-09-20', '13:40', 'Red Sox'],
];

// Plausible 2026 starting rotations (DEMO DATA — not actual lineups).
const ROTATIONS = {
  'Rays':       ['Shane McClanahan', 'Drew Rasmussen', 'Taj Bradley', 'Ryan Pepiot', 'Shane Baz'],
  'Yankees':    ['Gerrit Cole', 'Carlos Rodón', 'Max Fried', 'Marcus Stroman', 'Luis Gil'],
  'Red Sox':    ['Garrett Crochet', 'Brayan Bello', 'Tanner Houck', 'Lucas Giolito', 'Kutter Crawford'],
  'Blue Jays':  ['Kevin Gausman', 'José Berríos', 'Chris Bassitt', 'Bowden Francis', 'Jeff Hoffman'],
  'Orioles':    ['Corbin Burnes', 'Grayson Rodriguez', 'Zach Eflin', 'Dean Kremer', 'Cade Povich'],
  'Astros':     ['Framber Valdez', 'Hunter Brown', 'Spencer Arrighetti', 'Ronel Blanco', 'Cristian Javier'],
  'Mets':       ['Kodai Senga', 'Sean Manaea', 'Clay Holmes', 'Tylor Megill', 'David Peterson'],
  'Cubs':       ['Justin Steele', 'Shota Imanaga', 'Jameson Taillon', 'Ben Brown', 'Javier Assad'],
  'Tigers':     ['Tarik Skubal', 'Jack Flaherty', 'Casey Mize', 'Reese Olson', 'Keider Montero'],
  'Twins':      ['Pablo López', 'Joe Ryan', 'Bailey Ober', 'Chris Paddack', 'Simeon Woods Richardson'],
  'Mariners':   ['Logan Gilbert', 'George Kirby', 'Luis Castillo', 'Bryan Woo', 'Bryce Miller'],
  'Rangers':    ['Jacob deGrom', 'Nathan Eovaldi', 'Tyler Mahle', 'Jon Gray', 'Jack Leiter'],
  'Guardians':  ['Tanner Bibee', 'Shane Bieber', 'Gavin Williams', 'Ben Lively', 'Joey Cantillo'],
  'Royals':     ['Cole Ragans', 'Seth Lugo', 'Michael Wacha', 'Brady Singer', 'Alec Marsh'],
  'White Sox':  ['Garrett Crochet', 'Jonathan Cannon', 'Davis Martin', 'Sean Burke', 'Drew Thorpe'],
  'Athletics':  ['JP Sears', 'Joey Estes', 'Osvaldo Bido', 'Mitch Spence', 'Luis Medina'],
  'Angels':     ['Tyler Anderson', 'Reid Detmers', 'Griffin Canning', 'José Soriano', 'Patrick Sandoval'],
  'Reds':       ['Hunter Greene', 'Nick Lodolo', 'Andrew Abbott', 'Graham Ashcraft', 'Frankie Montas'],
  'Giants':     ['Logan Webb', 'Robbie Ray', 'Justin Verlander', 'Jordan Hicks', 'Kyle Harrison'],
  'D-backs':    ['Zac Gallen', 'Merrill Kelly', 'Brandon Pfaadt', 'Eduardo Rodriguez', 'Ryne Nelson'],
  'Marlins':    ['Sandy Alcantara', 'Jesús Luzardo', 'Edward Cabrera', 'Ryan Weathers', 'Max Meyer'],
  'Nationals':  ['MacKenzie Gore', 'Jake Irvin', 'DJ Herz', 'Mitchell Parker', 'Trevor Williams'],
  'Padres':     ['Yu Darvish', 'Dylan Cease', 'Joe Musgrove', 'Michael King', 'Matt Waldron'],
};

// Opponent demand tiers — calibrated for Tampa Bay Rays attendance reality.
// Yankees/Red Sox/Cubs bring visiting-fan walk-up that single-handedly fills the Trop;
// White Sox / Athletics weekday games are routinely the lowest-attended in MLB.
// 5 = sellout-tier draw, 4 = strong, 3 = average, 2 = quiet, 1 = bottom-of-league
const OPP_DEMAND = {
  'Yankees': 5, 'Red Sox': 5, 'Cubs': 5, 'Dodgers': 5,
  'Mets': 4, 'Phillies': 4, 'Astros': 4, 'Braves': 4, 'Cardinals': 4,
  'Blue Jays': 3, 'Orioles': 3, 'Mariners': 3, 'Padres': 3, 'Tigers': 3,
  'Twins': 3, 'Rangers': 3, 'Guardians': 3, 'Giants': 3, 'D-backs': 3,
  'Angels': 3, 'Reds': 3,
  'Marlins': 2, 'Royals': 2, 'Nationals': 2, 'Brewers': 2, 'Netherlands': 2,
  'White Sox': 1, 'Athletics': 1, 'Pirates': 1, 'Rockies': 1,
};

const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pickPromo(dateStr, dow) {
  // Sundays = Kids Run the Bases. Fridays = Fireworks. Saturdays often = Bobblehead/Postgame.
  if (dow === 'Sunday') return 'Kids Run the Bases';
  if (dow === 'Friday') return 'Fireworks Friday';
  // Saturdays: rotate among bobbleheads/concert/jersey.
  // Weeknights: roughly 50% chance of a promo, else null.
  const seed = hashStr(dateStr);
  if (dow === 'Saturday') {
    const sat = ['Bobblehead Night — Wander Franco', 'Bobblehead Night — Yandy Díaz', 'Bobblehead Night — Brandon Lowe', 'Replica Jersey Giveaway', 'Postgame Concert', 'Marvel Super Hero Night'];
    return sat[seed % sat.length];
  }
  if ((seed % 100) < 55) {
    const weekday = ['Rays Cap Giveaway', '$1 Hot Dog Night', 'Heritage Night', 'Star Wars Night', 'College Night', 'Beach Towel Giveaway', 'Throwback Thursday'];
    return weekday[seed % weekday.length];
  }
  return null;
}

function pickPitchers(dateStr, opponent) {
  const seed = hashStr(dateStr + opponent);
  const oppRot = ROTATIONS[opponent] || ['TBD'];
  const raysRot = ROTATIONS['Rays'];
  return {
    rays: raysRot[seed % raysRot.length],
    opp: oppRot[(seed >> 3) % oppRot.length],
  };
}

// Compute rating + estimated attendance + the human-readable reasons that drove it.
// Returns: { stars: 1..5, attendance: number, reasons: string[] }
function rateGame({ opponent, dow, promo, timeRaw }) {
  const reasons = [];
  let score = OPP_DEMAND[opponent] ?? 2;

  // Time-of-day classification
  const [hh] = (timeRaw || '19:10').split(':').map(Number);
  const isDayGame = hh < 17;
  const isWeekday = dow !== 'Saturday' && dow !== 'Sunday';

  // Marquee opponent reason
  if (score >= 5) reasons.push(`Marquee opponent (${opponent})`);
  else if (score >= 4) reasons.push(`Strong draw (${opponent})`);
  else if (score <= 1) reasons.push(`Low-demand opponent (${opponent})`);

  // Weekday day-game penalty — this is the bucket the user specifically called out.
  // Tuesday/Wednesday/Thursday day games are routinely the lowest-attended at Trop.
  if (isWeekday && isDayGame) {
    score -= 1.5;
    reasons.push(`Midweek ${dow} day game — historically low attendance`);
  }

  // Friday night boost
  if (dow === 'Friday' && !isDayGame) {
    score += 1;
    reasons.push('Friday night');
  }
  // Saturday boost (any time)
  else if (dow === 'Saturday') {
    score += 1;
    reasons.push(isDayGame ? 'Saturday afternoon family game' : 'Saturday night');
  }
  // Sunday afternoon (family draw)
  else if (dow === 'Sunday' && isDayGame) {
    score += 0.5;
    reasons.push('Sunday family game');
  }

  // Promo bump
  if (promo) {
    if (/Fireworks|Bobblehead|Jersey/.test(promo)) {
      score += 1;
      reasons.push(`Promo: ${promo}`);
    } else {
      score += 0.5;
      reasons.push(`Promo: ${promo}`);
    }
  }

  // Map raw score to 1-5
  const stars = Math.max(1, Math.min(5, Math.round(score)));

  // Estimated attendance — Trop-calibrated buckets (capacity ~25-31k depending on config).
  // We add some seeded jitter so similar games don't all show identical numbers.
  const ATTENDANCE_BANDS = {
    5: [30000, 33500],
    4: [23000, 29000],
    3: [16500, 22500],
    2: [11500, 16000],
    1: [7500, 11000],
  };
  const [lo, hi] = ATTENDANCE_BANDS[stars];
  // Stable jitter from opponent + dow + time so same matchup gives same number
  const jSeed = hashStr(`${opponent}-${dow}-${timeRaw}`);
  const attendance = lo + (jSeed % (hi - lo + 1));
  // Round to nearest 100
  const attendanceRounded = Math.round(attendance / 100) * 100;

  return { stars, attendance: attendanceRounded, reasons };
}

function fmtTime(t24) {
  const [hh, mm] = t24.split(':').map(Number);
  const am = hh < 12;
  const h = ((hh + 11) % 12) + 1;
  return `${h}:${mm.toString().padStart(2,'0')} ${am ? 'AM' : 'PM'}`;
}

export const GAMES = RAW.map(([date, time, opponent]) => {
  const d = new Date(date + 'T12:00:00');
  const dow = DOW[d.getDay()];
  const promo = pickPromo(date, dow);
  const pitchers = pickPitchers(date, opponent);
  const rating = rateGame({ opponent, dow, promo, timeRaw: time });
  return {
    id: `g-${date}`,
    date,                        // 'YYYY-MM-DD'
    dayOfWeek: dow,              // e.g. 'Friday'
    isWeekend: dow === 'Saturday' || dow === 'Sunday',
    time: fmtTime(time),
    timeRaw: time,
    opponent,                    // 'Yankees'
    matchup: `${opponent} at Rays`,
    venue: 'Tropicana Field',
    pitchers,                    // { rays, opp }
    promo,                       // string or null
    stars: rating.stars,         // 1..5
    expectedAttendance: rating.attendance,
    ratingReasons: rating.reasons,
    monthLabel: MONTHS[d.getMonth()],
    dayNum: d.getDate(),
    dowShort: dow.slice(0, 3),
  };
});

export function getGameById(id) {
  return GAMES.find(g => g.id === id);
}
