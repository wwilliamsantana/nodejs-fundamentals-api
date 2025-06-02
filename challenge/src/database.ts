import { Knex, knex as setupKnex } from 'knex'

export const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: './db/app.sqlite',
  },
  useNullAsDefault: true,
  migrations: {
    directory: './db/migrations',
    extension: 'ts',
  },
}

export const knex = setupKnex(config)
