import { execSync } from 'child_process'
import request from 'supertest'
import { app } from '../src/app'
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'

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

  test('List all meals', async () => {
    const userResponse = await request(app.server)
      .post('/diet')
      .send({ name: 'Joe', age: 25 })
      .expect(201)

    await request(app.server)
      .post('/diet/meals')
      .send({
        name: 'Breakfast',
        description: "It's Breakfast",
        this_diet: true,
      })
      .set('Cookie', userResponse.get('Set-Cookie') || [])
      .expect(201)

    await request(app.server)
      .post('/diet/meals')
      .send({
        name: 'Dinner',
        description: "It's Dinner",
        this_diet: true,
      })
      .set('Cookie', userResponse.get('Set-Cookie') || [])
      .expect(201)

    const mealsResponse = await request(app.server)
      .get('/diet/meals')
      .set('Cookie', userResponse.get('Set-Cookie') || [])
      .expect(200)

    expect(mealsResponse.body.meals).toHaveLength(2)

    expect(mealsResponse.body.meals[0].name).toBe('Breakfast')
    expect(mealsResponse.body.meals[1].name).toBe('Dinner')
  })

  test('Return of just one meal', async () => {
    const userResponse = await request(app.server)
      .post('/diet')
      .send({
        name: 'Marcos',
        age: 25,
      })
      .expect(201)

    await request(app.server)
      .post('/diet/meals')
      .send({
        name: 'Breakfast',
        description: "It's Breakfast",
        this_diet: true,
      })
      .set('Cookie', userResponse.get('Set-Cookie') || [])
      .expect(201)

    const mealsResponse = await request(app.server)
      .get('/diet/meals')
      .set('Cookie', userResponse.get('Set-Cookie') || [])
      .expect(200)

    const mealId = mealsResponse.body.meals[0].id

    const mealResponse = await request(app.server)
      .get(`/diet/meals/${mealId}`)
      .set('Cookie', userResponse.get('Set-Cookie') || [])
      .expect(200)

    expect(mealResponse.body).toEqual(
      expect.objectContaining({
        name: 'Breakfast',
        description: "It's Breakfast",
        this_diet: 1,
      }),
    )
  })

  test('Update of one meal', async () => {
    const userResponse = await request(app.server)
      .post('/diet')
      .send({
        name: 'Joe',
        age: 25,
      })
      .expect(201)

    await request(app.server)
      .post('/diet/meals')
      .send({
        name: 'Breakfast',
        description: "It's Breakfast",
        this_diet: true,
      })
      .set('Cookie', userResponse.get('Set-Cookie') || [])
      .expect(201)

    const mealsResponse = await request(app.server)
      .get('/diet/meals')
      .set('Cookie', userResponse.get('Set-Cookie') || [])
      .expect(200)

    const mealId = mealsResponse.body.meals[0].id

    await request(app.server)
      .patch(`/diet/meals/${mealId}`)
      .set('Cookie', userResponse.get('Set-Cookie') || [])
      .send({
        name: 'Dinner',
        description: "It's Dinner",
      })
      .expect(200)
  })

  test('Delete meal', async () => {
    const userResponse = await request(app.server)
      .post('/diet')
      .send({
        name: 'Joe',
        age: 25,
      })
      .expect(201)

    await request(app.server)
      .post('/diet/meals')
      .send({
        name: 'Breakfast',
        description: "It's Breakfast",
        this_diet: true,
      })
      .set('Cookie', userResponse.get('Set-Cookie') || [])
      .expect(201)

    const mealsResponse = await request(app.server)
      .get('/diet/meals')
      .set('Cookie', userResponse.get('Set-Cookie') || [])
      .expect(200)

    const mealId = mealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/diet/meals/${mealId}`)
      .set('Cookie', userResponse.get('Set-Cookie') || [])
      .expect(200)
  })
})
