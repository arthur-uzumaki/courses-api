import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { expect, test } from 'vitest'
import { makeCourse } from '../../tests/factories/make-course.ts'
import { makeAuthenticateUser } from '../../tests/factories/make-user.ts'
import { app } from '../app.ts'

test('get  a course by id', async () => {
  await app.ready()

  const { token } = await makeAuthenticateUser('student')

  const titleId = randomUUID()

  const course = await makeCourse(titleId)
  const response = await request(app.server)
    .get(`/courses?search=${course.title}`)
    .set('Authorization', token)

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    courses: [
      {
        id: expect.any(String),
        title: expect.any(String),
        description: null,
        enrollments: expect.any(Number),
      },
    ],
    totalPage: expect.any(Number),
  })
})
