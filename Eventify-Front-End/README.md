# Eventify Frontend

[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?logo=render&logoColor=white)](https://eventify-xrz7.onrender.com)

Next.js web application for the Eventify event management platform.

## Tech

- Next.js 15 (App Router), React 19, TypeScript
- SWR for data fetching, dayjs for dates
- Multi-language support (EN, FR, DE)
- Custom CSS (no UI framework)

## Running Locally

1. Copy `.env.example` to `.env.local` and adjust the API URL if needed
2. Install and run:

```bash
npm install
npm run dev
```

App: `http://localhost:3000`

## Pages

| Route           | Description                         |
|-----------------|-------------------------------------|
| `/`             | Home with hero, stats & upcoming events |
| `/login`        | User login                          |
| `/register`     | User registration                   |
| `/profile`      | User preferences & city selection   |
| `/events`       | Events overview with search & filters |
| `/events/[id]`  | Event detail with venue, artists & tickets |
| `/events/new`   | Create new event (organizer/admin)  |
| `/venue/[id]`   | Venue details & schedule            |
| `/venue/new`    | Create new venue (admin)            |

## Deployment

Deployed on [Render](https://render.com) as a Web Service with auto-deploy from `main`.

| Setting        | Value                          |
|----------------|--------------------------------|
| Root Directory | `Eventify-Front-End`           |
| Build Command  | `npm install && npm run build` |
| Start Command  | `npm start`                    |

**Environment variable:** `NEXT_PUBLIC_API_URL` = your backend API URL.

## Docker

```bash
docker build -t eventify-frontend .
docker run -p 3000:3000 eventify-frontend
```
