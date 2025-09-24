# Car Rental Project - Docker Setup

## 🚀 Quick Start with Docker

**One command to run everything:**
```bash
docker compose up --build
```

This starts:
- **Frontend**: http://localhost (React app)
- **Backend**: http://localhost:3000 (Node.js API)
- **Database**: PostgreSQL on port 5432

## 📁 Project Structure
```
car-rental-prj/
├── docker-compose.yml          # Orchestrates all services
├── database/
│   └── init.sql               # Database setup
├── backend/
│   ├── Dockerfile             # Backend container
│   └── src/index.ts          # TypeScript backend
└── frontend-car-rental-prj/
    ├── Dockerfile             # Frontend container
    └── src/App.tsx           # React frontend
```

## 🛠️ Docker Commands

### Start all services
```bash
docker compose up --build
```

### Stop all services
```bash
docker compose down
```

### View logs
```bash
docker compose logs -f
```

### Reset everything (clean slate)
```bash
docker compose down -v
docker system prune -a
```

### Rebuild specific service
```bash
docker compose build backend
docker compose up backend
```

## 🔧 Development vs Production

### Development (local)
- Run: `npm run dev` in each folder
- Hot reload enabled
- Direct database connection

### Production (Docker)
- Run: `docker compose up`
- Optimized builds
- Nginx serves frontend
- Container networking

## 🌐 Deployment Benefits

1. **Consistent Environment**: Same on dev, staging, production
2. **Easy Deployment**: Just run `docker compose up` on any server
3. **Team Collaboration**: No "works on my machine" issues
4. **Clean Resets**: Fresh start with `docker compose down -v`

## 📋 Environment Variables

The containers use these environment variables:
- `DATABASE_URL`: Postgres connection
- `NODE_ENV`: production/development
- `VITE_API_URL`: Frontend API endpoint

## 🚦 Health Checks

All services include health checks:
- Database: `pg_isready`
- Backend: `/health` endpoint
- Services wait for dependencies

## 📝 Notes

- Frontend runs on port 80 (nginx)
- Backend API on port 3000
- Database on port 5432
- All services communicate via Docker network