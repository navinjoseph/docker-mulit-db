exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('history')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('history').insert([
        {
          ticker: 'BTC',
          name: 'Bitcoin',
          usdPrice: '12000',
          timestamp: new Date().toISOString()
        },
        {
          ticker: 'ETH',
          name: 'Ethereum',
          usdPrice: '600',
          timestamp: new Date().toISOString()
        }
      ])
    })
}
