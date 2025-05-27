import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'child_process'

describe('Transactions routes', () => {
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

  test('user can create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 2000,
        type: 'credit',
      })
      .expect(201)
  })

  test('list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 2000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie') || []

    const listAllTransactions = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listAllTransactions.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 2000,
      }),
    ])
  })
})
