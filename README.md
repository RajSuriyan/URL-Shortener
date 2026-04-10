# Micro URL

Production-grade URL shortening platform built as a scalable monorepo with separate frontend, backend, and worker services.

Micro URL is designed to provide secure authenticated URL shortening, low-latency redirects, analytics processing, and distributed background job execution using modern full-stack architecture.

---

## Live Demo
https://url-shortener-three-pi.vercel.app/

---

## Repository Structure

```bash
URL-Shortener/
├── frontend/        # React frontend client
├── backend/         # Express REST API server
├── worker/          # Background async worker
├── package.json
└── README.md
```

---

## Architecture

### Frontend

* React + TypeScript UI
* Dashboard for managing shortened URLs
* Authentication flows
* Analytics visualization

### Backend

* Node.js + Express REST API
* JWT authentication
* URL creation and redirect APIs
* Redis caching layer
* MongoDB persistence

### Worker

* Async background processing service
* Click analytics aggregation
* Cleanup jobs
* Scheduled maintenance tasks

### Data Stores

* **MongoDB** → persistent storage
* **Redis** → cache, rate limiting, queue broker

This architecture follows production patterns commonly used in scalable distributed web systems.

---

## Features

* Secure JWT authentication with refresh token rotation
* URL shortening with collision-safe short code generation
* Redis-powered low-latency redirect caching
* IP-based rate limiting for abuse prevention
* Per-user URL analytics tracking
* Background worker queue processing
* Monorepo modular service separation
* Scalable cache-first redirect design

---

## Tech Stack

### Backend

* Node.js
* Express.js
* TypeScript

### Frontend

* React
* TypeScript

### Database & Cache

* MongoDB
* Redis

### Auth & Security

* JWT
* HTTP-only cookies

### Deployment

* Vercel / Render / Railway

---

## Redirect Flow Design

1. User requests short URL
2. Backend checks Redis cache
3. Cache hit → instant redirect
4. Cache miss → fetch MongoDB record
5. Store in Redis cache
6. Redirect user

This minimizes database load and improves redirect speed.

---

## Authentication Design

* Access token authentication
* Refresh token rotation
* Secure cookie token storage
* Session-safe renewal flow

---

## API Modules

### Auth

* Register
* Login
* Logout
* Refresh token

### URL Management

* Create short URL
* Delete URL
* Fetch user URLs

### Analytics

* Click counts
* Redirect statistics
* URL performance metrics

---

## Local Setup

### Prerequisites

* Node.js >= 18
* MongoDB
* Redis

---

### Clone Repository

```bash
git clone https://github.com/RajSuriyan/URL-Shortener.git
cd URL-Shortener
```

---

### Install Dependencies

```bash
npm install
```

---

### Environment Variables

#### backend/.env

```env
PORT=5000
MONGO_URI=your_mongodb_uri
REDIS_URL=your_redis_url
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

#### frontend/.env

```env
VITE_API_BASE_URL=http://localhost:5000
```

#### worker/.env

```env
REDIS_URL=your_redis_url
MONGO_URI=your_mongodb_uri
```

---

### Run Development

```bash
npm run dev
```

Or separately:

```bash
npm run dev:frontend
npm run dev:backend
npm run dev:worker
```

---

## Performance Considerations

* Redis reduces redirect latency significantly
* Mongo indexing improves lookup efficiency
* Worker offloads heavy analytics processing
* Services can scale independently

---

## Security Features

* JWT refresh rotation
* HTTP-only cookies
* Redis rate limiting
* Input validation and sanitization
* Protected API routes

---

## Future Enhancements

* Custom vanity aliases
* QR code generation
* Link expiration scheduling
* Geo-location click analytics
* Kubernetes deployment support

---

## Why This Project Matters

This project demonstrates:

* Real-world monorepo architecture
* Distributed service design
* Production authentication patterns
* Cache-first scalable backend engineering
* Full-stack system integration

---

## Author

Raj Suriyan G
Embedded Software Engineer | Backend Developer

* GitHub: https://github.com/RajSuriyan
* LinkedIn: https://www.linkedin.com/in/rajsuriyang/
