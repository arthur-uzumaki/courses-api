import { faker } from '@faker-js/faker'
import request from 'supertest'
import { expect, test } from 'vitest'
import { makeCourse } from '../../tests/factories/make-course.ts'
import { makeAuthenticateUser } from '../../tests/factories/make-user.ts'
import { app } from '../app.ts'

test('create a course', async () => {
  await app.ready()

  const { token } = await makeAuthenticateUser('manager')

  const response = await request(app.server)
    .post('/courses')
    .set('Content-Type', 'application/json')
    .set('Authorization', token)
    .send({ title: faker.lorem.words(4) })

  expect(response.status).toEqual(201)
  expect(response.body).toEqual({
    courseId: expect.any(String),
  })
})

test('400, not creste course', async () => {
  await app.ready()
  const { token } = await makeAuthenticateUser('manager')
  const { title } = await makeCourse()

  const response = await request(app.server)
    .post(`/courses`)
    .set('Authorization', token)
    .send({ title })
  expect(response.status).toEqual(400)
  expect(response.body).toEqual({ message: 'Failed to create new course.' })
})
