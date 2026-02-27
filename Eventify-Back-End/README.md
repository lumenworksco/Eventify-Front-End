# Eventify Backend

[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?logo=render&logoColor=white)](https://eventify-back-end.onrender.com)
[![Database on Supabase](https://img.shields.io/badge/Database-Supabase-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)

Spring Boot REST API for the Eventify event management platform.

## Tech

- Java 21, Spring Boot 3, Hibernate/JPA
- PostgreSQL (Supabase), JWT authentication, SpringDoc OpenAPI

## Running Locally

1. Ensure PostgreSQL is running with a database named `eventify`
2. Copy `.env.example` values or set environment variables
3. Run:

```bash
./mvnw spring-boot:run
```

API: `http://localhost:8080/api`
Swagger UI: `http://localhost:8080/swagger-ui.html`

## API Endpoints

| Resource            | Endpoints                          |
|---------------------|------------------------------------|
| Users / Auth        | `POST /api/users/register`, `POST /api/users/login`, `GET /api/users/{id}` |
| Events              | `GET/POST/PUT/DELETE /api/events`  |
| Venues              | `GET/POST/PUT/DELETE /api/venues`  |
| Cities              | `GET/POST/PUT/DELETE /api/cities`  |
| Tickets             | `POST /api/tickets/purchase`, `DELETE /api/tickets/{id}` |
| Event Descriptions  | `GET/POST/PUT/DELETE /api/event-descriptions` |

## Deployment

Deployed on [Render](https://render.com) as a Web Service with auto-deploy from `main`.

| Setting        | Value                                |
|----------------|--------------------------------------|
| Root Directory | `Eventify-Back-End`                  |
| Build Command  | `./mvnw clean package -DskipTests`   |
| Start Command  | `java -jar target/*.jar`             |

The database is hosted on [Supabase](https://supabase.com) using the **Session Pooler** endpoint for IPv4 compatibility.

See `.env.example` for required environment variables.

## Docker

```bash
docker build -t eventify-backend .
docker run -p 8080:8080 --env-file .env eventify-backend
```
