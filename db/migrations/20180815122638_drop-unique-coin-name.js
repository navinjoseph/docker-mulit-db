exports.up = function (knex, Promise) {
  return knex.schema.alterTable('coin', function (table) {
    table.dropUnique('name')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('coin', function (table) {
    table.unique('name')
  })
}
