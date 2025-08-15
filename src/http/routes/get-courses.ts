import { and, asc, count, eq, ilike, type SQL } from 'drizzle-orm'
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
        querystring: z.object({
          search: z.string().optional(),
          orderBy: z.enum(['title']).optional().default('title'),
          page: z.coerce.number().optional().default(1),
        }),
        response: {
          200: z
            .object({
              courses: z.array(
                z.object({
                  id: z.uuid(),
                  title: z.string(),
                  description: z.string().nullable(),
                  enrollments: z.number(),
                })
              ),
              totalPage: z.number(),
            })
            .describe('Obter todos os cursos'),
        },
      },
    },
    async (request, reply) => {
      const { search, orderBy, page } = request.query

      const conditions: SQL[] = []

      if (search) {
        conditions.push(ilike(schema.courses.title, `%${search}%`))
      }

      const [courses, totalPage] = await Promise.all([
        db
          .select({
            id: schema.courses.id,
            title: schema.courses.title,
            description: schema.courses.description,
            enrollments: count(schema.enrollments.id),
          })
          .from(schema.courses)
          .leftJoin(
            schema.enrollments,
            eq(schema.enrollments.courseId, schema.courses.id)
          )
          .orderBy(asc(schema.courses[orderBy]))
          .offset((page - 1) * 2)
          .limit(10)
          .where(and(...conditions))
          .groupBy(schema.courses.id),
        db.$count(schema.courses, and(...conditions)),
      ])

      return reply.status(200).send({ courses, totalPage })
    }
  )
}
