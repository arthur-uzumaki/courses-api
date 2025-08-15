import { randomUUID } from 'node:crypto'
import { faker } from '@faker-js/faker'
import { hash } from 'argon2'
import jwt from 'jsonwebtoken'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import { env } from '../../env/env.ts'

type Role = 'manager' | 'student'

export async function makeUser(role?: Role) {
  const passwordBeforeHash = randomUUID()
  const result = await db
    .insert(schema.users)
    .values({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await hash(passwordBeforeHash),
      role,
    })
    .returning()

  return { user: result[0], passwordBeforeHash }
}

export async function makeAuthenticateUser(role: Role) {
  const { user } = await makeUser(role)

  const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET)

  return { user, token }
}
