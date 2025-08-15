import request from 'supertest'
import { expect, test } from 'vitest'
import { makeCourse } from '../../tests/factories/make-course.ts'
import { makeAuthenticateUser } from '../../tests/factories/make-user.ts'
import { app } from '../app.ts'

test('get  a course by id', async () => {
  await app.ready()

  const course = await makeCourse()
  const { token } = await makeAuthenticateUser('student')
  const response = await request(app.server)
    .get(`/courses/${course.id}`)
    .set('Authorization', token)

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    course: {
      id: expect.any(String),
      title: expect.any(String),
      description: null,
    },
  })
})

test('404  for non existing courses', async () => {
  await app.ready()
  const { token } = await makeAuthenticateUser('student')

  const response = await request(app.server)
    .get(`/courses/c987a986-3316-43d8-93e4-bf0723cef92a`)
    .set('Authorization', token)

  expect(response.status).toEqual(404)
})
