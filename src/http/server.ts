import { env } from '../env/env.ts'
import { app } from './app.ts'

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log('Running server!')
})
