import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { env } from '../env/env.ts'

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

export const db = drizzle(pool, {
  logger: env.NODE_ENV === 'development',
})
