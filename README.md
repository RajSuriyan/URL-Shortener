# Micro URL

A full-stack URL shortener built with Node.js, TypeScript, React, Redis, MongoDB, and JWT authentication.

## Features
- JWT authentication with refresh token rotation
- URL shortening with unique short codes
- Redis caching for low-latency redirects
- IP-based rate limiting
- User-specific analytics tracking

## Tech Stack
Backend: Node.js, Express, TypeScript
Frontend: React
Database: MongoDB
Cache: Redis
Auth: JWT
Deployment: Vercel

## Architecture
- React frontend communicates with REST API backend
- MongoDB stores user and URL metadata
- Redis caches redirect mappings for faster resolution
- JWT handles secure authenticated sessions

## Setup
1. Clone repo
2. Install dependencies:
   npm install
3. Configure environment variables
4. Run locally:
   npm run dev

## Future Improvements
- Custom alias support
- QR code generation
- Click geo-analytics dashboard
