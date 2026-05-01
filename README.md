# ShareMySeats

A season-ticket utility app for the Tampa Bay Rays.
**Tagline:** Never let a season ticket go to waste.

This is an interactive demo built to pitch the concept to the Tampa Bay Rays organization. It demonstrates the complete product flow — managing seats, transferring tickets through MLB Ballpark / Ticketmaster / Apple Wallet, donating to vetted Tampa-area nonprofits, generating CPA-ready tax receipts, and closing the loop with photo stories from the families who got the seats.

See [PITCH.md](./PITCH.md) for the full executive pitch document.

## Run locally

```bash
cd client
npm install
npm start
```

Opens at http://localhost:3000.

## Production build

```bash
cd client
npm run build
```

Outputs a static bundle to `client/build/` ready to deploy.

## Deploy to Netlify

The repo includes a `netlify.toml` configured for Netlify out of the box. Two paths:

**Option A — Drag and drop (fastest)**

1. Run `cd client && npm run build`
2. Visit https://app.netlify.com/drop
3. Drag the `client/build/` folder onto the page
4. Get an instant shareable URL

**Option B — Connect a repo**

1. Push this repo to GitHub
2. On netlify.com, "Add new site → Import from Git"
3. Pick the repo. Netlify reads `netlify.toml` and configures itself.
4. Future pushes auto-deploy.

## What's in the demo

- 80 home games for the 2026 season at Tropicana Field
- 4 premium seats (Diamond Club, Section 108, Row C)
- 10 demo family + friends and 7 vetted Tampa-area nonprofits with eligibility rules
- Pre-seeded past games with realistic mixed assignments
- Full transfer flow with locked-after-transfer state
- Tax-receipt generation (single + bundled for CPA)
- Closed-loop nonprofit thank-you stories with simulated upload
- Rays Foundation 2× early-donation match
- Mission Control flow on the dashboard
- Achievements, streak, and lead-time tracking

## Tech

- React 18 (Create React App)
- Vanilla CSS with custom properties (Rays palette)
- localStorage persistence
- No backend — pure client-side demo

## Status

Prototype demo. Not for production use without auth, real ticket integration, and a nonprofit-side portal.
