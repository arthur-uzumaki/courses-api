import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import { checkJwtRequest } from '../../lib/check-jwt-request.ts'
import { checkUserRole } from '../../lib/check-user-role.ts'

export const createCourseRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/courses',
    {
      preHandler: [checkJwtRequest, checkUserRole(['manager'])],
      schema: {
        tags: ['courses'],
        summary: 'Create course',
        body: z.object({
          title: z.string().min(5, 'Título precisa ter 5 caracteres.'),
        }),
        response: {
          201: z
            .object({
              courseId: z.uuid(),
            })
            .describe('Curso criado com sucesso!'),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { title } = request.body
      try {
        const result = await db
          .insert(schema.courses)
          .values({
            title,
          })
          .returning()

        const insertCourser = result[0]

        if (!insertCourser) {
          return reply
            .status(400)
            .send({ message: 'Failed to create new course.' })
        }

        return reply.status(201).send({ courseId: insertCourser.id })
      } catch (error) {
        return reply
          .status(400)
          .send({ message: 'Failed to create new course.' })
      }
    }
  )
}
