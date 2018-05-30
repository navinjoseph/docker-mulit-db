exports.up = (knex, Promise) => {
  return knex.schema.table('price', table => {
    table.integer('source_id')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.table('price', table => {
    table.dropColumn('source_id')
  })
}
