import fastify from 'fastify'
import { DietDailyRoutes } from './routes/daily'

export const app = fastify()

app.register(DietDailyRoutes, {
  prefix: 'diet',
})
