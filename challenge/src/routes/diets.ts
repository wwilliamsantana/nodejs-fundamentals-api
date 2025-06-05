import { FastifyInstance } from 'fastify'
import { checkForRouteCookies } from '../middlewares/verify-cookie-routes'
import { knex } from '../database'
import z from 'zod'
import { randomUUID } from 'crypto'

export async function DietsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: checkForRouteCookies }, async (request) => {
    const { sessionId } = request.cookies

    const meals = await knex('diets').where('user_id', sessionId).select('*')

    return { meals }
  })

  app.get('/:id', { preHandler: checkForRouteCookies }, async (request) => {
    const { sessionId } = request.cookies

    const checkIdRequestSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = checkIdRequestSchema.parse(request.params)

    const meal = await knex('diets')
      .where('user_id', sessionId)
      .andWhere('id', id)

    return { meal }
  })

  app.post(
    '/',
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

      await knex('diets')
        .insert({
          id: randomUUID(),
          user_id: sessionId,
          name,
          description,
          this_diet: thisDiet,
        })
        .returning('*')

      return reply.status(201).send()
    },
  )

  app.patch(
    '/:id',
    { preHandler: checkForRouteCookies },
    async (request, reply) => {
      const { sessionId } = request.cookies
      const idMealRequestSchema = z.object({
        id: z.string().uuid(),
      })
      const dataMealRequestSchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        this_diet: z.boolean().optional(),
      })

      const { id } = idMealRequestSchema.parse(request.params)
      const {
        name,
        description,
        this_diet: thisDiet,
      } = dataMealRequestSchema.parse(request.body)

      console.log(name, description, thisDiet, id)

      const user = await knex('diets')
        .where({
          user_id: sessionId,
          id,
        })
        .first()

      await knex('diets')
        .where({
          user_id: sessionId,
          id,
        })
        .update({
          name: name || user?.name,
          description: description || user?.description,
          this_diet: thisDiet || user?.this_diet,
          update_at: String(new Date().toISOString()),
        })
      return reply.status(200).send()
    },
  )

  app.delete(
    '/:id',
    { preHandler: checkForRouteCookies },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const deleteIdRequestSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = deleteIdRequestSchema.parse(request.params)

      await knex('diets')
        .where({
          user_id: sessionId,
          id,
        })
        .del()

      return reply.status(200).send()
    },
  )
}
