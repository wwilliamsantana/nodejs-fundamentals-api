import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('diets', (table) => {
    table
      .integer('user_id')
      .unsigned()
      .references('session_id')
      .inTable('users')
      .onDelete('CASCADE')
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.boolean('this_diet').notNullable().defaultTo(false)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('diets')
}
