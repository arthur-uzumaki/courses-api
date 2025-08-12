import fastify from 'fastify'
import { randomUUID } from 'node:crypto'

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
})


const courses = [
  { id: '1', title: 'Curso de Node.js' },
  { id: '2', title: 'Curso de React' },
  { id: '3', title: 'Curso de React Native' },
]

app.get('/courses', async () => {
  return { courses }
})

app.post('/courses', async (request, reply) => {
  type Body = {
    title: string
  }
  const body = request.body as Body

  const courseId = randomUUID()

  const title = body.title

  if (!title) {
    return reply.status(400).send({ message: "Título é obrigatório" })
  }

  courses.push({ id: courseId, title })

  return reply.status(201).send({ courseId })

})


app.get('/courses/:id', async (request, reply) => {
  type Param = {
    id: string
  }

  const param = request.params as Param


  const courser = courses.find((item) => item.id === param.id)

  if (!courser) {
    return reply.status(404).send()
  }

  return { courser }
})


app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("Running server!");

})