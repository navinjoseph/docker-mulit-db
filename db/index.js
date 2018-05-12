import Knex from 'knex'
import { Model } from 'objection'
import knexConfig from './knexfile'
// Initialize knex.

const knex = Knex(knexConfig[process.env.NODE_ENV])
Model.knex(knex)

export default knex
