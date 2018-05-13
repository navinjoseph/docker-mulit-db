export const getPrice = (html, cheerio) => {
  const $ = cheerio.load(html)
  const priceString = $('[data-currency-price][data-usd]').text()
  const price = Number(priceString.split('\n')[1].replace(/,/g, ''))
  return price
}

export const fetchSymbols = request => {
  return new Promise((resolve, reject) => {
    request
      .get('https://api.coinmarketcap.com/v2/listings/')
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

const fetchCurrency = (cryptoString, request) => {
  const currency = String(cryptoString)
    .replace(/\s/g, '-')
    .toLowerCase()

  return new Promise((resolve, reject) => {
    request
      .get(`https://coinmarketcap.com/currencies/${currency}`)
      .then(res => {
        resolve(res.text)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export default fetchCurrency
