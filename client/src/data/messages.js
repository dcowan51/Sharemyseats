// Seed messages — DEMO DATA representing nonprofit thank-you posts
// that have been received after past donations. Each message is tied
// to a (gameId, nonprofitId) and may include a photo + note.

export const SEED_MESSAGES = [
  {
    id: 'm-seed-1',
    nonprofitId: 'np-bbbs',
    gameId: 'g-2026-04-10',
    seatCount: 2,
    status: 'received',
    receivedDate: '2026-04-11',
    photoSeed: 'rays-bbbs-littles',
    caption: 'Marcus and Tyler had their first ever Yankees game!',
    note:
      'Thank you so much! Marcus is a "Little" who has been waiting two years to see a Rays game. He and his Big Brother Eric had an unforgettable Friday night. Marcus said the fireworks were "the best part of his entire 4th-grade year."',
    contactName: 'Erica Williams, Match Coordinator',
  },
  {
    id: 'm-seed-2',
    nonprofitId: 'np-metmin',
    gameId: 'g-2026-04-12',
    seatCount: 4,
    status: 'received',
    receivedDate: '2026-04-13',
    photoSeed: 'rays-metmin-family',
    caption: 'The Hernandez family — first MLB game for all four kids.',
    note:
      'The Hernandez family has been in our family housing program for six months. Sunday at the Trop was the first time the kids had ever been to a professional game. Their mom cried when we told her the seats were Diamond Club. We can\'t thank you enough.',
    contactName: 'Robert Cole, Family Programs',
  },
  {
    id: 'm-seed-3',
    nonprofitId: 'np-bgc',
    gameId: 'g-2026-05-04',
    seatCount: 4,
    status: 'received',
    receivedDate: '2026-05-05',
    photoSeed: 'rays-bgc-kids',
    caption: 'Four club kids at Blue Jays Monday night.',
    note:
      'Our staff selected four club members who hit their reading goals this spring as a reward. They got there an hour early for batting practice and stayed until the last pitch. Wander Franco even waved to them from on-deck.',
    contactName: 'Jamal Bryant, Site Director',
  },
  {
    id: 'm-seed-4',
    nonprofitId: 'np-stpfree',
    gameId: 'g-2026-05-15',
    seatCount: 2,
    status: 'received',
    receivedDate: '2026-05-16',
    photoSeed: 'rays-stp-volunteers',
    caption: 'A volunteer thank-you for two of our longest-serving nurses.',
    note:
      'Marie has been volunteering at our clinic for 19 years. We surprised her with the Marlins game tickets as a thank-you. She and her husband had not been to a Rays game in a decade. Her exact words: "I feel like a queen." 💙',
    contactName: 'Diana Park, Volunteer Coordinator',
  },
];
