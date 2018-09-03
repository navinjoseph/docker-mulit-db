exports.up = (knex, Promise) => {
  return knex.schema.table('price', table => {
    table
      .integer('source_id')
      .references('id')
      .inTable('source')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.table('price', table => {
    if (process.env.NODE_ENV !== 'production') {
      table.dropColumn('source_id')
    }
  })
}
