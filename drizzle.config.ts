import { defineConfig } from 'drizzle-kit'
import { env } from './src/env/env.ts'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  out: './src/db/migrations',
  schema: './src/db/schema/**.ts',
})
