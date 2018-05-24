exports.seed = function (knex, Promise) {
  return knex('price')
    .del()
    .then(() => {
      return knex('price').insert([
        {
          timestamp: new Date('2017-12-17T03:24:00').toISOString(),
          usdPrice: 1300,
          coinId: 1
        },
        {
          timestamp: new Date('2017-12-18T03:24:00').toISOString(),
          usdPrice: 1400,
          coinId: 1
        }
      ])
    })
}
