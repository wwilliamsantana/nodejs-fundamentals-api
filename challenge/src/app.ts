import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { UsersRoutes } from './routes/users.route'
import { MealsRoutes } from './routes/meals.route'

export const app = fastify()

app.register(cookie)

app.register(
  (instance) => {
    instance.register(UsersRoutes)
    instance.register(MealsRoutes, { prefix: 'meals' })
  },
  { prefix: '/users' },
)
