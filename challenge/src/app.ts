import fastify from 'fastify'
import { DietDailyRoutes } from './routes/daily'
import cookie from '@fastify/cookie'

export const app = fastify()

app.register(cookie)
app.register(DietDailyRoutes, {
  prefix: 'diet',
})
