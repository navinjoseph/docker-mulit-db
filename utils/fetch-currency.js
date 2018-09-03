export const getPrice = (html, cheerio) => {
  const $ = cheerio.load(html)
  const priceString = $('[data-currency-price][data-usd]').text()
  const price = Number(priceString.split('\n')[1].replace(/,/g, ''))
  return price
}

export const getPriceHistorical = (html, cheerio) => {
  const $ = cheerio.load(html)

  const prices = []

  $('#historical-data .table-responsive tbody tr.text-right').each((i, elem) => {
    const date = $(elem)
      .find('td.text-left')
      .text()
    const open = $(elem)
      .children()
      .eq(1)
      .text()
    const close = $(elem)
      .children()
      .eq(2)
      .text()

    prices.push({
      date,
      open: Number(open),
      close: Number(close)
    })
  })

  return prices
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

export const sanatizeTicker = ticker => {
  return String(ticker)
    .replace(/\s/g, '-')
    .toLowerCase()
}

const fetchCurrency = (cryptoString, request) => {
  const currency = sanatizeTicker(cryptoString)
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

export const fetchCurrencyHistorical = (cryptoString, request, moment) => {
  const currency = sanatizeTicker(cryptoString)
  const now = moment().format('YYYYMMDD')

  return new Promise((resolve, reject) => {
    request
      .get(`https://coinmarketcap.com/currencies/${currency}/historical-data/?start=19990101&end=${now}`)
      .then(res => {
        resolve(res.text)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export default fetchCurrency
