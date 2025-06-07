import { execSync } from 'child_process'
import request from 'supertest'
import { app } from '../src/app'
import { afterAll, beforeAll, beforeEach, describe, test } from 'vitest'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  test('Create new meal', async () => {
    const userResponse = await request(app.server)
      .post('/diet')
      .send({ name: 'William', age: 25 })
      .expect(201)

    await request(app.server)
      .post('/diet/meals')
      .send({
        name: 'Sushi',
        description: 'Low Carbo',
        this_diet: true,
      })
      .set('Cookie', userResponse.get('Set-Cookie') || [])
      .expect(201)
  })
})
