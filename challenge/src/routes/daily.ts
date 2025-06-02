import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function DietDailyRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const tables = await knex('users').select('*')

    return tables
  })
}
