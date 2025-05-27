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

  test('get specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 2000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie') || []

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    console.log(getTransactionResponse.body.transaction.id)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New transaction',
        amount: 2000,
      }),
    )
  })

  test('list summary of transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 3500,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie') || []

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'New transaction',
        amount: 2000,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    console.log(summaryResponse.body)

    expect(summaryResponse.body.sum).toEqual({
      amount: 1500,
    })
  })
})
