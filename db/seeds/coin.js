exports.seed = function (knex, Promise) {
  return knex('coin')
    .del()
    .then(() => {
      return knex('coin').insert([
        {
          ticker: 'BTC',
          name: 'Bitcoin'
        },
        {
          ticker: 'LTC',
          name: 'Litecoin'
        }
      ])
    })
}
