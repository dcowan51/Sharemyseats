# ShareMySeats

## A season-ticket utility app for the Tampa Bay Rays

**Tagline:** Never let a season ticket go to waste.

**Status:** Working interactive demo. This document accompanies a clickable build that demonstrates the end-to-end product flow.

---

## Executive Summary

ShareMySeats is a software product that turns Tampa Bay Rays season ticket holders into active managers of their inventory rather than passive owners. It addresses a quiet but expensive problem in every Major League Baseball franchise: season tickets that go unused — neither attended, transferred to friends or family, nor donated to community organizations.

The product gives a season ticket holder, or their assistant, one place to make weekly picks for every game: assign each seat to a person, donate it to a vetted nonprofit, or mark it taken. Once a recipient is assigned, the actual ticket transfer happens through MLB Ballpark, Ticketmaster, or Apple Wallet — using infrastructure the Rays organization already pays for.

Wrapped around the workflow are two differentiated capabilities that are not present in any current ticket-management product: automated tax-deduction receipts ready for a CPA, and a closed-loop impact feed where nonprofits send back photos and notes from the families who got the seats.

The pitch to the Rays organization is not "buy software." It is "co-brand and pilot a retention engine that pays for itself through reduced season-ticket-holder churn, increased community throughput, and a defensible local narrative."

---

## The Problem

### What Major League Baseball franchises do not measure well

Every franchise tracks attendance. Most franchises track ticket revenue. Almost none of them track the gap between **tickets sold** and **tickets actually used by a human in a seat**. That gap — the wasted-seat percentage — is the single most expensive number in the season-ticket-holder business and almost no one reports it.

For a typical Diamond Club season ticket holder at Tropicana Field with four seats and 81 home games, the annual seat-utilization picture looks roughly like this:

- They personally attend 22 to 30 games.
- They give a few games to friends, family, and clients informally.
- The remaining 100 to 200 individual seats simply sit empty — not resold, not transferred, not donated.

That is hundreds of unused seats per holder, per year. Multiplied across the season-ticket-holder base, the visible empty rows during nationally televised games are not a marketing problem — they are an artifact of friction in the redistribution layer.

### Why holders churn

Season ticket holders renew based on perceived value. The two most cited reasons for non-renewal at major-league franchises are:

1. **"I couldn't use enough of my games."** The package felt wasteful.
2. **"It became too much work to manage."** Coordinating with friends, family, and assistants every week became a chore.

Both of these problems are software problems. Neither is currently solved by any existing tool the franchise gives to the holder.

### The stakes

For the Rays organization, season-ticket renewal is the highest-leverage line in the team's operating P&L. A one percent improvement in renewal rate at scale is a multi-million-dollar annual outcome. Anything that meaningfully reduces the felt wastefulness or felt friction of being a season ticket holder protects that revenue.

---

## The Solution

### What ShareMySeats is

ShareMySeats is a single-screen workflow application designed for the season ticket holder, or the assistant who manages tickets on their behalf. It surfaces every home game on a calendar, shows what is handled and what is open, and lets the user make all four picks for an upcoming game in one popup.

The four pick options for any seat are:

- **Assign to a person.** Family member, friend, business contact.
- **Donate to a nonprofit.** From a vetted list of Tampa Bay-area 501(c)(3) organizations.
- **Mark taken.** A handled seat where the user does not need to track a specific name.
- **Mark unused.** Last-resort option, displayed as the failure case.

Once a seat is assigned to a person, the user can transfer the actual ticket through one of three channels: MLB Ballpark (the official MLB app and the recommended path), Ticketmaster, or an Apple Wallet SMS link. The transfer flow is a multi-stage modal that mimics the real ticket-system experience — selecting a method, generating a secure transfer link, notifying the recipient by SMS, and adding the ticket to their wallet.

After a ticket has been transferred, the seat is locked from further edits to prevent double-booking.

### What makes it different

Two capabilities elevate ShareMySeats from a tracker into a product the Rays organization should want to brand and promote:

#### 1. Automated Tax-Deduction Receipts

Every donated seat generates a properly formatted IRS-ready receipt with the Rays Foundation lockup, donor information, recipient organization, fair-market value, and required tax-deductibility language. Holders can export a single combined receipt bundle for their CPA — one PDF with a cover summary table and one numbered receipt per donation.

For high-net-worth holders this is a non-trivial financial asset. A Diamond Club holder donating thirty seats per year at $150 face value is creating $4,500 in claimable charitable deduction value annually. Today that paperwork is informal at best. ShareMySeats makes it automatic.

#### 2. Closed-Loop Impact Stories

When a seat is donated, the receiving nonprofit posts a photo and short note from the people who used the seats. The donor sees this in the app's Impact tab — turning an abstract donation into a specific, emotional, shareable moment.

Demo content includes families from Big Brothers Big Sisters of Tampa Bay, Metropolitan Ministries, Boys and Girls Clubs of the Suncoast, the Tampa Bay First Responders Foundation, and others. Every story is tied to a specific game and a specific donation.

This loop is the strongest retention mechanism in the product. A holder who has received eight thank-you stories from families they will never meet does not churn the next renewal.

---

## What Utilization Looks Like

### The user persona

The product is designed primarily for the **season ticket holder's executive assistant or office manager** — the person who actually does the weekly work of moving tickets to people. The interface uses a 17 to 18 pixel base font, large tap targets, high-contrast Rays-branded color palette, and explicit textual labels rather than tiny icon-only buttons. It is deliberately accessible for older users without feeling like an accommodation.

The secondary persona is the season ticket holder themselves, checking the app occasionally to see their season's progress and impact.

### The weekly workflow

A typical user session takes ninety seconds:

1. **Open the dashboard.** A personalized welcome bar shows the holder's name, package details, and current status. A status pill announces whether all upcoming games are handled or how many need attention.

2. **See the weekly mission.** A prominent card titled "Mission Control" lists every game in the next seven days that has open seats. Each row shows the days until the game, a numeric rating tier, the matchup, the open seat count, and a yellow "Pick →" call to action.

3. **Make picks.** Clicking any row opens a single popup that manages all four seats for that game. Three quick-action buttons handle the common cases: mark all four taken, donate all four to a chosen nonprofit, or clear all four. A per-seat dropdown allows individual assignments to specific family, friends, or eligible nonprofits.

4. **Save and transfer.** The dialog footer offers two save options. "Save" stores the assignments. "Save & transfer" stores the assignments and immediately opens the ticket transfer modal, where the user picks MLB Ballpark, Ticketmaster, or Apple Wallet, and sends all assigned tickets in one batch.

5. **See the loop close.** When recipients receive their transfers, the dashboard reflects it. When nonprofits post their thank-you stories, the Impact tab fills with photos and notes.

The mission progress bar updates in real time as picks are saved. Completing the weekly mission triggers a brief confetti animation and a celebration toast.

### Key engagement mechanics

The product uses three overlapping behavioral levers to incentivize early, consistent action:

- **Loss aversion.** A "Seats missed" counter ticks up when a past game went unhandled. It is impossible to ignore.
- **Streak preservation.** A "no-miss streak" counts consecutive past games where every seat was filled. Holders fight to protect it.
- **Lead-time identity.** An "Early Bird" / "On Time" / "Last Minute" status badge based on average lead time creates an identity worth maintaining.

### Game rating system

Games are rated on a one-to-five tier system based on opponent demand, day of week, time of day, and promotional schedule. The rating is displayed as a colored numeric badge with a tier label (Marquee, Hot, Solid, Quiet, Sparse) and a one-line insight hint ("Sells itself — high demand" or "Hardest to fill — donate or invite friends early").

The rating helps users decide which games to handle first. Marquee games (Yankees, Red Sox, Cubs, Dodgers on a Friday or Saturday with a fireworks promo) are easy to give away last-minute. Sparse games (a Wednesday afternoon against a bottom-tier opponent) need to be planned weeks ahead or donated.

The rating logic incorporates Trop-realistic attendance estimates internally to drive the math, but those numbers are intentionally not displayed on user-facing screens. The app is a tool for the holder, not a public attendance tracker.

---

## Financial Value to the Rays Organization

### 1. Direct retention impact

The single largest financial argument is renewal-rate improvement. Holders who feel they are using their full package — through a combination of attendance, transfers, and donations — renew at materially higher rates than holders who feel they are wasting seats.

A conservative one-percent improvement in season-ticket renewal at scale produces a multi-million-dollar annual revenue protection effect. ShareMySeats is the most direct mechanism available to the franchise to move that number.

### 2. Community-narrative asset

The Impact tab generates an ongoing stream of documented community-impact stories tied to specific Tampa Bay families and specific Rays games. This content is a marketing and public-relations asset. It is also a defensible community narrative for the franchise during ongoing stadium and municipal-funding conversations.

In eighteen months of moderate adoption, the franchise would have thousands of donor-sanctioned stories of Rays seats reaching local families through vetted nonprofits. That is content the marketing department would otherwise spend significant budget to manufacture.

### 3. High-net-worth holder lock-in via tax substantiation

Diamond Club and premium-tier holders donate a meaningful percentage of their seats annually. Today that giving is undocumented and unclaimed. The automated tax-receipt bundle turns informal goodwill into a concrete annual financial benefit for the holder, deliverable as a CPA-ready PDF.

This single feature creates a renewal lock-in argument that current ticket products do not offer — the holder loses an automated five-figure annual deduction-substantiation benefit if they don't renew.

### 4. CRM and analytics asset

In a future production rollout, the team-side analytics layer surfaces:

- Real seat-utilization data per holder, broken down by attended, transferred, donated, and missed
- At-risk renewal flags based on engagement patterns
- Donation pattern data identifying which nonprofits to formalize as Rays Foundation partners
- Engagement scoring to route specific holders to specific account representatives

This is CRM functionality the franchise would otherwise pay six figures annually to a Salesforce or Tessitura integration to provide.

### 5. Defensive brand positioning

Both MLB Advanced Media (through the MLB Ballpark app) and StubHub have ambitions to own the secondary-ticket experience. Neither has any incentive to optimize for the franchise's primary STH relationship. Building or licensing ShareMySeats keeps the holder's primary management surface within the Rays brand rather than ceding it to MLB or a third-party reseller.

### 6. Future revenue paths

Setting retention aside, four credible revenue lines exist in the eighteen-to-thirty-six-month horizon:

- **Resale commission** when STHs cannot fill or donate a seat — a small percentage of face value, captured rather than ceded to StubHub
- **Local sponsor integration** — Publix-matched donations, BayCare-sponsored nonprofit partnerships, etc.
- **White-label licensing** to other MLB clubs, with the Rays as the originating franchise
- **Premium analytics tier** for STH operations at peer organizations

None of these would underwrite the project alone. Together they represent a genuine secondary revenue argument once the primary retention case is proven.

---

## Implementation Roadmap

### Phase 0 — Pilot scope (first 90 days)

- Select 50 to 75 top-tier Diamond Club season ticket holders for an invite-only pilot
- Provision real authentication and connect to the franchise's existing STH database
- Wire MLB Ballpark transfer integration through MLB Advanced Media's existing API
- Onboard four to six Rays Foundation-vetted nonprofit partners with their own login portal
- Provide one-on-one onboarding through the existing Rays account-rep team

Pilot success metrics:

- Percent of pilot holders who use the app at least weekly
- Average seats handled per holder per week
- Donation volume during the pilot half-season
- Pre-pilot vs in-pilot self-reported satisfaction with package value

### Phase 1 — Full STH rollout (months 4-9)

- Open enrollment to the full season ticket holder base
- Launch co-branded "Rays Season Ticket Member" front-end (production replaces "ShareMySeats" branding)
- Begin generating end-of-year tax receipt bundles for tax season

### Phase 2 — Community amplification (months 9-18)

- Press launch around the closed-loop impact stories
- Sponsor integration (Publix, BayCare, or local partners) for matched-donation programs
- First annual Impact Report PDF distributed to all participating holders

### Phase 3 — Defensive expansion (months 18-36)

- Resale-channel integration for genuinely unfillable seats
- White-label license conversations with peer MLB clubs
- Team-side analytics dashboard for STH operations

### What the franchise needs to provide

For the pilot to launch, the Rays organization needs to commit:

- API access to the existing MLB Ballpark transfer infrastructure (a request to MLB Advanced Media)
- Read access to the STH database for account provisioning
- One Rays Foundation point of contact for nonprofit vetting
- Marketing co-sign for the launch announcement

### What the ShareMySeats team provides

- The complete software product, white-labeled to the Rays brand
- Nonprofit-side portal and onboarding
- Pilot reporting and analytics
- First-year operations and support

---

## Risks and Realities

Three risks an executive should hear named:

### 1. Adoption is not free

Even an excellent product takes six to twelve months to reach 30 percent active usage among the holder base. The pilot must include hands-on onboarding by the Rays account-rep team, not just an email blast. Budget the rep-team time as a real cost.

### 2. The MLB Ballpark integration is non-trivial

The demo waves at MLB Ballpark and Ticketmaster integration elegantly. In production, this is real engineering work and real conversations with MLB Advanced Media regarding their willingness to support a club-branded layer atop their barcode authority. The most likely answer is yes-with-conditions, but it is not free.

### 3. The nonprofit-side portal is its own product

The donor-side experience is what is built in the demo. The nonprofit-side portal — where organizations log in, claim donated seats, upload thank-you photos, and report on attendance — is a parallel product that needs to be built before public launch. This is scope reality, not a deal-breaker.

---

## Closing

ShareMySeats is not a vendor product looking for a customer. It is a purpose-built solution to a specific, expensive, under-managed problem inside the Tampa Bay Rays season-ticket business. It uses infrastructure the franchise already pays for. It generates content the marketing department wants. It substantiates tax benefits high-net-worth holders are leaving on the table. It creates a defensible community narrative the franchise can use in stadium and municipal-funding conversations.

The ask is not to buy a product. The ask is to scope a 90-day pilot with named executives — Chief Revenue Officer, Vice President of Ticketing, Rays Foundation lead — and a defined budget line for the first half-season.

If the pilot moves the needle on holder satisfaction and donation throughput, the full rollout follows naturally. If it does not, the franchise has paid for one half-season of tightly scoped insight into its highest-leverage revenue line.

That is a worthwhile bet either way.

---

## Appendix — Demo Walkthrough

A clickable interactive build accompanies this document. The recommended demo flow is approximately ninety seconds:

1. Open the dashboard. Note the personalized welcome bar and the weekly mission card.
2. Click any open game in the mission list.
3. In the bulk seat manager dialog, assign three seats to family or friends and donate the fourth to a nonprofit.
4. Click "Save and transfer" — choose MLB Ballpark — watch the multi-stage transfer animation complete.
5. After the transfer completes, the seats are locked from further edits.
6. Open the Impact tab. Click "Simulate nonprofit upload" on a pending donation to see the closed loop complete with a photo and thank-you note.
7. Open the Nonprofits tab. Click "Print all receipts for CPA" to see the tax-bundle PDF generation.
8. Return to the dashboard. Notice the Foundation Match card has updated, the streak is preserved, and the mission progress bar reflects the picks just made.

The full demo walkthrough demonstrates the complete product loop — log in, see status, make picks, transfer tickets, see impact, generate tax documentation, return to status — without ever leaving the dashboard except for the Impact and Nonprofits tabs.

---

*Prepared for executive review at the Tampa Bay Rays organization.*
