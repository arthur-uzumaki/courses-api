import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

export const createCourseRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/courses',
    {
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
        },
      },
    },
    async (request, reply) => {
      const { title } = request.body

      const result = await db
        .insert(schema.courses)
        .values({
          title,
        })
        .returning()

      const insertCourser = result[0]

      if (!insertCourser) {
        throw new Error('Failed to create new course.')
      }

      return reply.status(201).send({ courseId: insertCourser.id })
    }
  )
}
