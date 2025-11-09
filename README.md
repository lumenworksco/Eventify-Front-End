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

The app includes three implemented stories; for grading you should pick two (one overview + one add/modify with validation and relationship). We recommend marking the first two below as "finished":

### 1) Add / Modify Event (required: add or modify with validation + relationship)

- Implemented in: `app/events/new/page.tsx` and `services/data.js`.
- What it does: Client-side form to create an Event. The form includes a Venue selector (relationship: Event -> Venue). The `addEvent` function in `services/data.js` validates title (min 3 chars), venue existence, and that the date/time is valid and in the future. On success the new event is added to the in-memory `events` array.
- How to verify: Start the app and open `/events/new`. Fill a title (≥3 chars), select a venue, choose a future date/time, and submit. Expect a success message and then find the event on `/events` or the relevant venue schedule (`/city?id=<venueId>`).

### 2) Events Overview (required: overview of entities)

- Implemented in: `app/events/page.tsx` (reads from `services/data.js`).
- What it does: Lists all upcoming events, with filters for city and type. It resolves venue and city names using the `venues` and `cities` data and sorts events by date.
- How to verify: Open `/events`. Use the "Filter by city" and "Filter by type" dropdowns and confirm the list updates accordingly.

Additional implemented story (extra, not chosen for grading):

- Cities / venues overview: `app/cities/page.tsx` — shows cities and venue cards with upcoming events. This is implemented and can be demonstrated, but the two stories above are the ones we ask the assessor to grade.

## Data & constraints

- All data is hard-coded in `services/data.js` (cities, venues, events).
- `addEvent` stores events in-memory for demo purposes (no back-end persistence).

## Run & verify locally

Prerequisites: Node.js and npm installed.

1. Install dependencies:

```bash
npm install
```

2. Run development server (default port 8080):

```bash
npm run dev
# app will be available at http://localhost:8080
```

3. (Optional) Create a production build:

```bash
npm run build
```

Pages to check in the app:

- `/` — home and links
- `/cities` — Overview of cities → venues → upcoming events
- `/city?id=<venueId>` — Venue schedule
- `/events` — Events overview with filters
- `/events/new` — Add event (admin form with validation)

## Submission note

Selected stories to review (2 of 3 implemented):

1) Add / Modify Event — `app/events/new/page.tsx` + `services/data.js` (validation + Event→Venue relationship)

2) Events Overview — `app/events/page.tsx` (display-only overview)

Additional implemented story (bonus): Cities overview — `app/cities/page.tsx`.

Commands to prepare the submission ZIP (run from the project root):

```bash
# Remove build and install folders
rm -rf node_modules
rm -rf .next
# If a back-end exists, remove its build folders (example: backend/target)
# rm -rf backend/target

# Create zip (place the zip in the parent folder)
cd ..
zip -r front-end-project-group-2-15-submission.zip "Full Stack Development/front-end-project-2-15" "Full Stack Development/Assignment 1/Project_Analysis_Group_2-15.pdf"
```

If you'd like, I can create the ZIP for you now (I will remove `node_modules` and `.next` in the repo working tree first). If you'd rather create the ZIP yourself, run the commands above and tell me when you're ready.
