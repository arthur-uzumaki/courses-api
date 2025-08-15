import { fastifySwagger } from '@fastify/swagger'
import scalarAPIReference from '@scalar/fastify-api-reference'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from '../env/env.ts'
import { createCourseRoute } from './routes/create-course.ts'
import { getCourseByIdRoute } from './routes/get-course-by-id.ts'
import { getCoursesRoute } from './routes/get-courses.ts'

const app = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

if (env.NODE_ENV === 'development') {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Courses-api',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  })
  app.register(scalarAPIReference, {
    routePrefix: '/docs',
    configuration: {},
  })
}

app.register(createCourseRoute)
app.register(getCoursesRoute)
app.register(getCourseByIdRoute)

export { app }
