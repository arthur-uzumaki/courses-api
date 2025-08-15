import type { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import { env } from '../env/env.ts'

type PayloadJwt = {
  sub: string
  role: 'student' | 'manager'
}

export async function checkJwtRequest(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const token = request.headers.authorization

  if (!token) {
    return reply.status(401).send()
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as PayloadJwt
    request.user = payload
  } catch (error) {
    return reply.status(401).send()
  }
}
