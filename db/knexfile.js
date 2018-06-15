const { knexSnakeCaseMappers } = require('objection')
const path = require('path')
// Update with your config settings.

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'tt_history_dev'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    ...knexSnakeCaseMappers()
  },

  test: {
    client: 'postgresql',
    connection: {
      user: process.env.CIRCLECI ? 'circle_test' : undefined,
      database: 'tt_history_test'
    },
    pool: {
      min: 2,
      max: 100
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, '/migrations')
    },
    seeds: {
      directory: path.join(__dirname, '/seeds')
    },
    ...knexSnakeCaseMappers()
  },

  production: {
    client: 'postgresql',
    connection: `${process.env.DATABASE_URL}?ssl=true`,
    pool: {
      min: 2,
      max: 120
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    ...knexSnakeCaseMappers()
  }
}
