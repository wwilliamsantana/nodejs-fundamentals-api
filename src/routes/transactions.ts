import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { verifyExistsSessionId } from '../middlewares/verify-exists-session-id'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [verifyExistsSessionId] }, async (request) => {
    const { sessionId } = request.cookies

    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select()

    return { transactions }
  })

  app.get('/:id', { preHandler: [verifyExistsSessionId] }, async (request) => {
    const getTransactionIdSchema = z.object({
      id: z.string().uuid(),
    })
    const { sessionId } = request.cookies
    const { id } = getTransactionIdSchema.parse(request.params)

    const transaction = await knex('transactions')
      .where({
        id,
        session_id: sessionId,
      })
      .first()

    return { transaction }
  })

  app.get(
    '/summary',
    { preHandler: [verifyExistsSessionId] },
    async (request) => {
      const { sessionId } = request.cookies
      const sum = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return { sum }
    },
  )

  app.post('/', async (request, reply) => {
    const createTransactionSchemaBody = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { amount, title, type } = createTransactionSchemaBody.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
