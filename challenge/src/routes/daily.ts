import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function DietDailyRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const tables = await knex('users').select('*')

    return tables
  })

  app.post('/', async (request, reply) => {
    const { name, age } = request.body

    await knex('users').insert({
      id: randomUUID(),
      name,
      age,
    })

    return reply.status(201).send()
  })
}
