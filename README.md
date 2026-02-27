# Eventify

[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?logo=render&logoColor=white)](https://eventify-xrz7.onrender.com)
[![Database on Supabase](https://img.shields.io/badge/Database-Supabase-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A full-stack event management platform for discovering events, browsing venues, and purchasing tickets across Belgium. Built with **Spring Boot** (Java 21) and **Next.js** (React 19, TypeScript).

> **Live Demo:** [eventify-xrz7.onrender.com](https://eventify-xrz7.onrender.com)
>
> *Note: The app is hosted on Render's free tier, so the first request may take ~30 seconds while the services spin up.*

## Features

- Browse and search events with real-time filtering
- Detailed event pages with venue info, artists, and ticket links
- User authentication with JWT (role-based: User, Organizer, Admin)
- Ticket purchasing with availability tracking
- Multi-language support (English, French, German)
- Personalized home feed based on preferred city
- Swagger/OpenAPI documentation for the REST API
- Responsive design for mobile and desktop

## Tech Stack

| Layer      | Technology                                     |
|------------|------------------------------------------------|
| Frontend   | Next.js 15, React 19, TypeScript, SWR          |
| Backend    | Spring Boot 3, Java 21, Hibernate, JWT          |
| Database   | PostgreSQL 16 (hosted on Supabase)              |
| Deployment | Render (frontend + backend)                     |
| Docs       | SpringDoc OpenAPI / Swagger UI                  |

## Deployment Architecture

```
                     ┌─────────────────┐
                     │   GitHub Repo   │
                     │   (monorepo)    │
                     └────────┬────────┘
                              │ auto-deploy
               ┌──────────────┴──────────────┐
               ▼                             ▼
      ┌─────────────────┐          ┌─────────────────┐
      │  Render          │          │  Render          │
      │  Static Site     │          │  Web Service     │
      │  (Next.js)       │─────────▶│  (Spring Boot)   │
      │  Port 3000       │  API     │  Port 8080       │
      └─────────────────┘          └────────┬─────────┘
                                            │
                                            ▼
                                   ┌─────────────────┐
                                   │   Supabase       │
                                   │   PostgreSQL     │
                                   │  (Session Pooler)│
                                   └─────────────────┘
```

### Render

Both the frontend and backend are deployed on [Render](https://render.com) with auto-deploy from the `main` branch.

| Service   | Type          | Root Directory         | Build Command                  | Start Command                          |
|-----------|---------------|------------------------|--------------------------------|----------------------------------------|
| Frontend  | Web Service   | `Eventify-Front-End`   | `npm install && npm run build` | `npm start`                            |
| Backend   | Web Service   | `Eventify-Back-End`    | `./mvnw clean package -DskipTests` | `java -jar target/*.jar`          |

### Supabase

The PostgreSQL database is hosted on [Supabase](https://supabase.com) (free tier, no 30-day expiry). The backend connects via the **Session Pooler** endpoint for IPv4 compatibility with Render.

**Required backend environment variables on Render:**

| Variable     | Value                                        |
|--------------|----------------------------------------------|
| `PGHOST`     | `aws-0-[region].pooler.supabase.com`         |
| `PGPORT`     | `5432`                                       |
| `PGDATABASE` | `postgres`                                   |
| `PGUSER`     | `postgres.[project-ref]`                     |
| `PGPASSWORD` | Your Supabase database password              |
| `JWT_SECRET` | A strong random string (256+ bits)           |

> **Important:** Use the Supabase **Session Pooler** connection (not the direct connection) because Render's free tier only supports IPv4, while Supabase's direct connection is IPv6 only.

## Project Structure

```
Eventify/
  Eventify-Back-End/    # Spring Boot REST API
  Eventify-Front-End/   # Next.js web application
  docker-compose.yml    # Full-stack local development
```

## Quick Start

### Using Docker Compose

```bash
docker compose up --build
```

This starts PostgreSQL, the backend (port 8080), and the frontend (port 3000).

### Manual Setup

#### Prerequisites

- Java 21
- Node.js 20+
- PostgreSQL 16

#### Backend

```bash
cd Eventify-Back-End

# Create a local PostgreSQL database named 'eventify'
# Then run:
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080/api` and Swagger UI at `http://localhost:8080/swagger-ui.html`.

See [`Eventify-Back-End/.env.example`](Eventify-Back-End/.env.example) for environment variables.

#### Frontend

```bash
cd Eventify-Front-End
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

See [`Eventify-Front-End/.env.example`](Eventify-Front-End/.env.example) for environment variables.

## Environment Variables

### Backend

| Variable     | Description           | Default     |
|--------------|-----------------------|-------------|
| `PGHOST`     | PostgreSQL host       | `localhost` |
| `PGPORT`     | PostgreSQL port       | `5432`      |
| `PGDATABASE` | Database name         | `eventify`  |
| `PGUSER`     | Database user         | `postgres`  |
| `PGPASSWORD` | Database password     | `postgres`  |
| `JWT_SECRET` | JWT signing secret    | (dev default) |
| `PORT`       | Server port           | `8080`      |

### Frontend

| Variable              | Description      | Default                                        |
|-----------------------|------------------|------------------------------------------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL  | `https://eventify-back-end.onrender.com/api`   |

## API Documentation

When the backend is running, visit `/swagger-ui.html` for interactive API docs.

## License

[MIT](LICENSE)
