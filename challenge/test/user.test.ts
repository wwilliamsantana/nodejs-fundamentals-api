import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'child_process'

describe('User routes', () => {
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

  test('Creating of a user', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'William',
        age: 25,
      })
      .expect(201)

    const cookies = response.get('Set-Cookie')

    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining('sessionId')]),
    )
  })

  test('List all users', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'William',
        age: 25,
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie') || []

    const getUserListResponse = await request(app.server)
      .get('/users')
      .set('Cookie', cookies)
      .expect(200)

    expect(getUserListResponse.body.tables).toEqual([
      expect.objectContaining({
        name: 'William',
        age: 25,
      }),
    ])
  })

  test('List metrics', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'William',
        age: 25,
      })
      .expect(201)

    await request(app.server)
      .post('/users/meals')
      .send({
        name: 'Sushi',
        description: 'Low Carbo',
        this_diet: true,
      })
      .set('Cookie', userResponse.get('Set-Cookie') || [])
      .expect(201)

    await request(app.server)
      .post('/users/meals')
      .send({
        name: 'Lasagna',
        description: 'High carbo',
        this_diet: false,
      })
      .set('Cookie', userResponse.get('Set-Cookie') || [])
      .expect(201)

    const metricsResponse = await request(app.server)
      .get('/users/metrics')
      .set('Cookie', userResponse.get('Set-Cookie') || [])
      .expect(200)

    expect(metricsResponse.body).toEqual({
      qtdMeals: 2,
      qtdDietsIn: 1,
      qtdDietsOut: 1,
      bestSequence: 1,
    })
  })
})
