import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { checkForRouteCookies } from '../middlewares/verify-cookie-routes'
import { FastifyInstance } from 'fastify'

export async function UsersRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: checkForRouteCookies }, async (request) => {
    const { sessionId } = request.cookies

    const tables = await knex('users')
      .where('session_id', sessionId)
      .select('*')

    return { tables }
  })

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

  app.get(
    '/metrics',
    { preHandler: checkForRouteCookies },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const meals = await knex('diets').where('user_id', sessionId)

      const metrics = meals.reduce(
        (acc, current) => {
          if (current.this_diet) {
            acc.qtdDietsIn++
          } else {
            acc.qtdDietsOut++
          }

          acc.qtdMeals++

          return acc
        },
        {
          qtdMeals: 0,
          qtdDietsIn: 0,
          qtdDietsOut: 0,
        },
      )

      let currentSequence = 0
      let bestSequence = 0

      for (const meal of meals) {
        if (meal.this_diet) {
          currentSequence++
          if (currentSequence > bestSequence) {
            bestSequence++
          }
        } else {
          currentSequence = 0
        }
      }

      return reply.status(200).send({
        ...metrics,
        bestSequence,
      })
    },
  )
}
