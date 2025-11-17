# Deploying the backend and Postgres on Render (no Docker)

This guide walks through deploying the `backend` (Express + TypeScript) to Render using a Node Web Service (no Docker) and a Render Managed PostgreSQL instance. It assumes your repo is on GitHub and Render can access it.

Summary

- Use Render Managed Postgres for the database.
- Use Render Web Service (Environment: Node) for the backend. Do NOT select Docker.
- Set environment variables in the Render service (see list below). Build and start commands are provided for a TypeScript project.

1. Create a Render PostgreSQL instance

- In the Render dashboard, create a new PostgreSQL database (Managed Postgres).
- After creation, copy the connection string (example):

  postgres://render_user:password@HOST:PORT/dbname

- You can reuse the same connection string for both `DATABASE_URL` and `USER_DATABASE_URL` if you keep both sets of tables in the same database/schema.

2. Import the SQL schema

- The SQL scripts are in `backend/database/`:

  - `car-rental.sql`
  - `create-bookings-table.sql`
  - `add_admin_column.sql`

- Import them using the Render SQL editor (if available) or from your machine with `psql`:

```bash
psql "postgres://USER:PASS@HOST:PORT/DBNAME" -f backend/database/car-rental.sql
psql "postgres://USER:PASS@HOST:PORT/DBNAME" -f backend/database/create-bookings-table.sql
psql "postgres://USER:PASS@HOST:PORT/DBNAME" -f backend/database/add_admin_column.sql
```

3. Create the Backend Web Service on Render (Node, no Docker)

- In Render: New -> Web Service -> Connect your GitHub repo and select the branch.
- Important: Set the Root Directory to `backend` (since this repo contains both frontend and backend folders).
- Environment: Select "Node" (not Docker).
- Runtime: Use Node 18 (or compatible).
- Build Command:

  npm ci && npm run build

- Start Command:

  npm start

- Render will set a `PORT` env var automatically; your app uses `process.env.PORT || 3000` so it will bind correctly.

4. Environment variables to set in the Render service settings

- `DATABASE_URL` = postgres connection string from Render Postgres
- `USER_DATABASE_URL` = same as `DATABASE_URL` (or a separate DB if you created one)
- `NODE_ENV` = production
- `JWT_SECRET` = a secure secret string for JWT signing
- `FRONTEND_URL` = the deployed frontend origin (e.g. `https://your-frontend.onrender.com`) — used for CORS

5. Deploy and verify

- Deploy from the Render UI. Watch the build logs; the `npm run build` step will run `tsc` and copy JSON config files into `dist/config/`.
- Check service logs: the backend prints `DATABASE_URL:` and `USER_DATABASE_URL:` on startup (helpful for debugging). Ensure the server starts and binds to the assigned port.

6. Connect the frontend

- Set your frontend's API base URL to the backend's public URL (for example: `https://your-backend.onrender.com/api`).
- Ensure `FRONTEND_URL` on the backend equals the frontend's origin (including protocol) so CORS allows requests.

7. Migrations and updates

- For schema changes, re-run the SQL scripts against the managed DB (psql or GUI). For CI/CD you can add migration tooling later.

Security notes

- Never commit secrets to the repo. Use Render Environment settings to store `DATABASE_URL`, `JWT_SECRET`, etc.
- The code enables SSL for Postgres when `NODE_ENV=production`.

If you'd like, I can:

- Add a `render.yaml` to codify the Web Service and Postgres setup (still without Docker),
- Help run the SQL import if you paste the DB connection string (or give me permission to run it locally), or
- Walk through the Render UI and provide the exact values to type in.
