import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkForRouteCookies(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sessionId } = request.cookies

  if (!sessionId) {
    return reply.status(404).send({
      error: 'Unauthorized',
    })
  }
}
