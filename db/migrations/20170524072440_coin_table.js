exports.up = function (knex, Promise) {
  return knex.schema.createTable('coin', table => {
    table.increments('id').primary()
    table
      .string('name')
      .notNullable()
      .unique()
    table
      .string('ticker')
      .notNullable()
      .unique()
    table.timestamps(true, true)
  })
}

exports.down = function (knex, Promise) {
  if (process.env.NODE_ENV !== 'production') {
    return knex.schema.dropTableIfExists('coin')
  }
}
