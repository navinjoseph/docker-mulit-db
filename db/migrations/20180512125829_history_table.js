exports.up = function (knex, Promise) {
  return knex.schema.createTable('history', table => {
    table.increments('id').primary()
    table.timestamp('timestamp')
    table.string('name')
    table.string('ticker')
    table.float('usd_price')
    table.timestamps(true, true)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('history')
}
