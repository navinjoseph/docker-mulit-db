exports.up = function (knex, Promise) {
  return knex.schema.createTable('price', table => {
    table.increments('id').primary()
    table.timestamp('timestamp')
    table.float('usd_price')
    table
      .integer('coin_id')
      .notNullable()
      .references('id')
      .inTable('coin')
    table.timestamps(true, true)
  })
}

exports.down = function (knex, Promise) {
  if (process.env.NODE_ENV !== 'production') {
    return knex.schema.dropTableIfExists('price')
  }
}
