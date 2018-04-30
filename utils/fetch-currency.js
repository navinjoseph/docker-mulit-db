import request from 'superagent'
// import log from 'roarr'

const fetchCurrency = (currency) => {
  return new Promise((resolve, reject) => {
    request
      .get(`https://coinmarketcap.com/currencies/${currency}`)
      .then((res) => {
        resolve(res.text)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export default fetchCurrency
