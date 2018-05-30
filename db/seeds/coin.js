exports.seed = function (knex, Promise) {
  return knex('coin')
    .del()
    .then(() => {
      return knex('coin').insert([
        {
          id: 1,
          ticker: 'BTC',
          name: 'Bitcoin'
        },
        {
          id: 2,
          ticker: 'LTC',
          name: 'Litecoin'
        }
      ])
    })
}
