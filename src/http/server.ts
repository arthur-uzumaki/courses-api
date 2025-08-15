import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { env } from '../env/env.ts'
import { app } from './app.ts'

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log('Running server!')
})

app.ready().then(() => {
  const spec = app.swagger()

  writeFile(
    resolve(process.cwd(), 'swagger.json'),
    JSON.stringify(spec, null, 2),
    'utf-8'
  )
})
