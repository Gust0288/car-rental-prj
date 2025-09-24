// backend/src/index.ts
import 'dotenv/config'
import express, { Request, Response } from 'express'
import cors from 'cors'
import { Pool } from 'pg'

const app = express()
app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173' }))

// create a DB pool (re-uses connections)
const useSSL = process.env.NODE_ENV === 'production'
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
})

// health
app.get('/health', async (_req: Request, res: Response) => {
  const { rows } = await pool.query('select now()')
  res.json({ ok: true, time: rows[0].now })
})

// get cars
app.get('/cars', async (_req: Request, res: Response) => {
  const { rows } = await pool.query(
    'select id, brand, model from public.cars order by id asc'
  )
  res.json(rows)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))