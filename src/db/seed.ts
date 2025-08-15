import { fakerPT_BR } from '@faker-js/faker'
import { hash } from 'argon2'
import { db } from './connection.ts'
import { schema } from './schema/index.ts'

async function seed() {
  const passwordHas = await hash('123456')
  const usersInsert = await db
    .insert(schema.users)
    .values([
      {
        name: fakerPT_BR.person.fullName(),
        email: fakerPT_BR.internet.email(),
        role: 'student',
        password: passwordHas,
      },
      {
        name: fakerPT_BR.person.fullName(),
        email: fakerPT_BR.internet.email(),
        role: 'student',
        password: passwordHas,
      },
      {
        name: fakerPT_BR.person.fullName(),
        email: fakerPT_BR.internet.email(),
        role: 'student',
        password: passwordHas,
      },
      {
        name: fakerPT_BR.person.fullName(),
        email: fakerPT_BR.internet.email(),
        role: 'student',
        password: passwordHas,
      },
      {
        name: fakerPT_BR.person.fullName(),
        email: fakerPT_BR.internet.email(),
        role: 'student',
        password: passwordHas,
      },
    ])
    .returning()

  const coursesInsert = await db
    .insert(schema.courses)
    .values([
      { title: fakerPT_BR.lorem.words(4) },
      { title: fakerPT_BR.lorem.words(4) },
      { title: fakerPT_BR.lorem.words(4) },
      { title: fakerPT_BR.lorem.words(4) },
      { title: fakerPT_BR.lorem.words(4) },
    ])
    .returning()

  await db.insert(schema.enrollments).values([
    {
      courseId: coursesInsert[0].id,
      userId: usersInsert[0].id,
    },
    {
      courseId: coursesInsert[0].id,
      userId: usersInsert[1].id,
    },
    {
      courseId: coursesInsert[1].id,
      userId: usersInsert[2].id,
    },
  ])
}

seed()
