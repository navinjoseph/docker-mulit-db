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
        },
        {
          ticker: 'ETH',
          name: 'Ethereum'
        },
        {
          ticker: 'ZRX',
          name: '0x'
        }
      ])
    })
}
