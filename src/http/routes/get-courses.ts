import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

export const getCoursesRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/courses',
    {
      schema: {
        tags: ['courses'],
        summary: 'Get all courses',
        response: {
          200: z
            .object({
              courses: z.array(
                z.object({
                  id: z.uuid(),
                  title: z.string(),
                  description: z.string().nullable(),
                })
              ),
            })
            .describe('Obter todos os cursos'),
        },
      },
    },
    async (_, reply) => {
      const courses = await db
        .select({
          id: schema.courses.id,
          title: schema.courses.title,
          description: schema.courses.description,
        })
        .from(schema.courses)
      return reply.status(200).send({ courses })
    }
  )
}
