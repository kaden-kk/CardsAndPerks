# Cards & Perks

A credit card rewards optimizer that helps you figure out which card in your wallet to use for any purchase, compare transfer partners across your point currencies, and discover perks and protections you didn't know you had.

## Features

### Card wallet
- Add cards from a normalized catalog of 18+ major cards (Chase, Amex, Capital One, Citi, Bilt, Discover, Apple Card)
- Each card shows earn rates, annual fee, foreign transaction fee, and point currency at a glance
- Combined "Benefits" view merges perks and protections into one card face — including coverage amounts, welcome bonuses, and statement credits
- Try the app without an account: add cards as a guest (stored locally in the browser session) and migrate them into a real account on sign-up

### Optimizer
- See the best card in your wallet for every spend category — dining, travel, groceries, gas, streaming, and more
- Categories are grouped into Everyday / Travel / Lifestyle sections, sorted by effective return
- Handles ties by showing every card that matches the best rate

### Transfer Partners
- Browse every transfer partner reachable from your point currencies, grouped by partner rather than by card — so overlapping access across issuers is obvious at a glance
- Search and filter by airline/hotel, sort by best transfer ratio
- Airline alliance data (Star Alliance, SkyTeam, Oneworld) tracked per partner

### Account & data model
- Email/password auth with confirmation flow, password reset, and account deletion
- Guest mode: browse and build a wallet with zero account, with data stored only for the session (not persisted to the database until sign-up)
- Row-level security on every table — card catalog data is public-read, personal data (saved cards, profile) is scoped to the authenticated user

## Tech Stack

**Frontend**
- React + TypeScript
- Tailwind CSS
- Vite
- Lucide React (icons)

**Backend**
- Supabase (Postgres + Auth + Row-Level Security)
- Email delivery via Supabase's built-in sender (Resend SMTP integration in progress for production volume)

**Deployment**
- Vercel

## Data Model

The database is normalized to avoid duplicating shared benefit data across dozens of cards:

| Table | Purpose |
|---|---|
| `cards` | Core card facts — issuer, network, annual fee, foreign transaction fee, point currency |
| `earn_rates` | Per-category earning rates for each card |
| `perk_definitions` / `card_perks` | Reusable perk catalog (e.g. Priority Pass, Global Entry credit) linked to cards via a junction table |
| `protection_definitions` / `card_protections` | Same pattern for insurance-type benefits (purchase protection, trip cancellation, extended warranty) |
| `transfer_partners` / `card_transfer_partners` | Airline and hotel transfer partners, with per-card transfer ratios and alliance membership |
| `redemption_values` | Cents-per-point value for different redemption paths (cash back, travel portal, points transfer) |
| `user_cards` | Join table linking a user's account to the cards in their wallet |
| `profiles` | Display name and avatar preferences |

Unique constraints on every junction table (`card_perks`, `card_protections`, `card_transfer_partners`) prevent duplicate rows from being inserted for the same card/benefit pair.

## Card Data Verification

Every card's earn rates, perks, protections, and redemption values are sourced from official issuer documentation (Guides to Benefits, cardmember agreements, and rewards program terms) rather than secondary sources. Time-limited promotional offers (e.g. temporary statement credits with a fixed expiration date) are intentionally excluded to avoid the database going stale — the catalog focuses on standing card features.

## Status

Actively in development. Card catalog verification is ongoing across the full card list; guest mode and the transfer partners redesign shipped this session.