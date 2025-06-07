import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { UserDietDailyRoutes } from './routes/users'
import { DietsRoutes } from './routes/diets'

export const app = fastify()

app.register(cookie)

app.register(
  (instance) => {
    instance.register(UserDietDailyRoutes)
    instance.register(DietsRoutes, { prefix: 'meals' })
  },
  { prefix: '/diet' },
)
