import type { FastifyRequest } from 'fastify'

export function getAuthenticateUserRequest(request: FastifyRequest) {
  const user = request.user

  if (!user) {
    throw new Error('Invalid authenticate')
  }
  return user
}
