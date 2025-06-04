import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('diets', (table) => {
    table.timestamp('update_at').defaultTo(null)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('diets', (table) => {
    table.dropColumn('update_at')
  })
}
