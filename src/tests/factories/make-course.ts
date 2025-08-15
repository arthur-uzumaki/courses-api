import { faker } from '@faker-js/faker'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

export async function makeCourse(title?: string) {
  const result = await db
    .insert(schema.courses)
    .values({
      title: title ?? faker.lorem.words(5),
    })
    .returning()

  return result[0]
}
