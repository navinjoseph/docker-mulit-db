exports.up = function (knex, Promise) {
  return knex.schema.createTable('source', table => {
    table.increments('id').primary()
    table
      .string('name')
      .notNullable()
      .unique()
    table.string('description')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('source')
}
