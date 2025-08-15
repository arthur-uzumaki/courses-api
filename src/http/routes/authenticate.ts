import { verify } from 'argon2'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import jsonWebToken from 'jsonwebtoken'
import z from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import { env } from '../../env/env.ts'

export const authenticateRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/sessions',
    {
      schema: {
        tags: ['authenticate'],
        summary: 'Login',
        body: z.object({
          email: z.email(),
          password: z.string(),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body
      const { sign } = jsonWebToken

      const result = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email))

      if (result.length === 0) {
        return reply.status(400).send({ message: 'Credenciais inválidos' })
      }

      const user = result[0]

      const doesPasswordsMatch = await verify(user.password, password)

      if (!doesPasswordsMatch) {
        return reply.status(400).send({ message: 'Credenciais inválidos' })
      }

      const token = sign({ sub: user.id, role: user.role }, env.JWT_SECRET)

      return reply.status(200).send({ token })
    }
  )
}
