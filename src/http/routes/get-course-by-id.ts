import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
export const getCourseByIdRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/courses/:courseId',
    {
      schema: {
        tags: ['courses'],
        summary: 'Get course by courseId',
        params: z.object({
          courseId: z.uuid(),
        }),
        response: {
          200: z
            .object({
              course: z.object({
                id: z.uuid(),
                title: z.string(),
                description: z.string().nullable(),
              }),
            })
            .describe('Obter curso por ID '),
          404: z.void().describe('Curso não encontrado'),
        },
      },
    },
    async (request, reply) => {
      const { courseId } = request.params

      const result = await db
        .select({
          id: schema.courses.id,
          title: schema.courses.title,
          description: schema.courses.description,
        })
        .from(schema.courses)
        .where(eq(schema.courses.id, courseId))

      if (result.length > 0) {
        return reply.status(200).send({ course: result[0] })
      }

      return reply.status(404).send()
    }
  )
}
