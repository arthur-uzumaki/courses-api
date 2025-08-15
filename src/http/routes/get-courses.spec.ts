import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { expect, test } from 'vitest'
import { makeCourse } from '../../tests/factories/make-course.ts'
import { app } from '../app.ts'

test('get  a course by id', async () => {
  await app.ready()

  const titleId = randomUUID()

  const course = await makeCourse(titleId)
  const response = await request(app.server).get(
    `/courses?search=${course.title}`
  )

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
