exports.up = function (knex, Promise) {
  return knex.schema.alterTable('price', table => {
    table.index(['coin_id'], 'price_coin_id')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('price', table => {
    table.dropIndex(['coin_id'], 'price_coin_id')
  })
}
