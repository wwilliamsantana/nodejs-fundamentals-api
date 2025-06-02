import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { checkForRouteCookies } from '../middlewares/verify-cookie-routes'
import { FastifyInstance } from 'fastify'

export async function DietDailyRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: checkForRouteCookies }, async (request) => {
    const { sessionId } = request.cookies

    const tables = await knex('users')
      .where('session_id', sessionId)
      .select('*')

    return tables
  })

  app.post(
    '/meal',
    { preHandler: checkForRouteCookies },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const checkMealRequestSchema = z.object({
        name: z.string(),
        description: z.string(),
        this_diet: z.boolean(),
      })

      const {
        name,
        description,
        this_diet: thisDiet,
      } = checkMealRequestSchema.parse(request.body)

      const user = await knex('diets')
        .insert({
          id: randomUUID(),
          user_id: sessionId,
          name,
          description,
          this_diet: thisDiet,
        })
        .returning('*')

      console.log(user)

      return reply.status(201).send()
    },
  )

  app.post('/', async (request, reply) => {
    const dataUserCreateSchema = z.object({
      name: z.string(),
      age: z.number(),
    })

    const { name, age } = dataUserCreateSchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('users').insert({
      id: randomUUID(),
      name,
      age,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
