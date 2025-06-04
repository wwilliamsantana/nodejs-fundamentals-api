// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      age: number
      created_at: string
      session_id?: string
    }
    diets: {
      id: string
      user_id: string
      name: string
      description: string
      this_diet: boolean
      created_at: string
      update_at?: string
    }
  }
}
