exports.up = function (knex, Promise) {
  return knex.schema.createTable('coin', table => {
    table.increments('id').primary()
    table.string('name')
    table.string('ticker')
    table.timestamps(true, true)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('coin')
}
