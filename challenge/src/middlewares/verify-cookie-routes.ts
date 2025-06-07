import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function checkForRouteCookies(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const checkSessionIdSchema = z.object({
    sessionId: z.string().uuid(),
  })

  const { sessionId } = checkSessionIdSchema.parse(request.cookies)

  if (!sessionId) {
    return reply.status(404).send({
      error: 'Unauthorized',
    })
  }
}
