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

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  test('Creating of a user', async () => {
    await request(app.server)
      .post('/diet')
      .send({
        name: 'William',
        age: 25,
      })
      .expect(201)
  })

  test('List all users', async () => {
    const createUserResponse = await request(app.server)
      .post('/diet')
      .send({
        name: 'William',
        age: 25,
      })
      .expect(201)

    const cookies = createUserResponse.get('Set-Cookie') || []

    const getUserListResponse = await request(app.server)
      .get('/diet')
      .set('Cookie', cookies)
      .expect(200)

    expect(getUserListResponse.body.tables).toEqual([
      expect.objectContaining({
        name: 'William',
        age: 25,
      }),
    ])
  })
})
