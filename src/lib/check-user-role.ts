import type { FastifyReply, FastifyRequest } from 'fastify'
import { getAuthenticateUserRequest } from './get-authenticate-user-request.ts'

type Role = 'student' | 'manager'

export function checkUserRole(role: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = getAuthenticateUserRequest(request)

    if (!role.includes(user.role)) {
      return reply.status(401).send()
    }
  }
}
