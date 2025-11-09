# Eventify

This repository contains a small Next.js demo app for browsing venues and events. It is intentionally minimal and uses an in-memory data service so you can run it without a backend.

## Overview

- Clean, responsive UI built with simple CSS (no external UI framework).
- Demo data (cities, venues, events) lives in `services/data.js` and is editable for testing.
- Pages:
  - `/` — Home
  - `/cities` — View venues grouped by city
  - `/city?id=<venueId>` — Venue schedule and events
  - `/events` — Events overview with filters
  - `/events/new` — Add / Modify Event (admin form)

## Implemented stories

- View venues by city — shows cities, venues and upcoming events for each venue.
- Add / Modify Event — admin form to create events with validation and a venue relationship (Venue 1 → Events n).
- Events overview — browse all upcoming events with filters by city and type.

## Data & constraints

- All data is hard-coded in `services/data.js` (cities, venues, events).
- `addEvent` stores events in-memory for demo purposes (no back-end persistence).

## Run & verify locally

Prerequisites: Node.js and npm installed.

1. Install dependencies:

```bash
npm install
```

1. Run development server (default port 8080):

```bash
npm run dev
# app will be available at http://localhost:8080
```

1. (Optional) Create a production build:

```bash
npm run build
```

Pages to check in the app:

- `/` — home and links
- `/cities` — Overview of cities → venues → upcoming events
- `/city?id=<venueId>` — Venue schedule
- `/events` — Events overview with filters
- `/events/new` — Add event (admin form with validation)
