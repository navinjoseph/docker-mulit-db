# TokenTax Pricing API

**Example API URL:**

[https://pricing.tokentax.us/api/v1/history?symbol=ven&timestamp=1527034971544&access_token=xxx](https://pricing.tokentax.us/api/v1/history?symbol=ven&timestamp=1527034971544&access_token=xxx)

### /api/v1/history

| Query Parameter | Description                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------- |
| `symbol`        | Cryptocurrency ticker symbol.                                                                  |
| `timestamp`     | A timestamp in js. You can get this date format from doing `Date.now()` or `dateVar.getTime()` |
| `access_token`  | Token to access the API                                                                        |

**Response**

```
{
  "price": {
    "USD": 0.321454,
    "BTC": 0.00003816270441931559,
    "ETH": 0.000458577990812862
  },
  "timestamp": "2018-05-22T16:00:00.000Z",
  "ticker": "XLM",
  "name": "Stellar"
}
```

### /api/v1/range

| Query Parameter | Description                                                                                                    |
| --------------- | -------------------------------------------------------------------------------------------------------------- |
| `symbol`        | Cryptocurrency ticker symbol. Accepts single currency or comma seperated list.                                 |
| `start`         | Start of range. A timestamp in js. You can get this date format from doing `Date.now()` or `dateVar.getTime()` |
| `end`           | End of range. A timestamp in js. You can get this date format from doing `Date.now()` or `dateVar.getTime()`   |
| `access_token`  | Token to access the API                                                                                        |

**Response**

```
{
  "LTC": [
    {
      "id": 1027,
      "timestamp": "2017-01-01T14:30:00.000Z",
      "usdPrice": 963.66,
      "coinId": 1,
      "createdAt": "2018-05-30T02:57:26.071Z",
      "updatedAt": "2018-05-30T02:57:26.078Z",
      "sourceId": 1
    },
  ],
  "BTC": [
    {
      "id": 4743,
      "timestamp": "2017-01-01T14:30:00.000Z",
      "usdPrice": 4.33,
      "coinId": 2,
      "createdAt": "2018-05-30T02:58:26.494Z",
      "updatedAt": "2018-05-30T02:58:26.503Z",
      "sourceId": 1
    },
  ]
}
```

## API Support

For support or sales inquiries email: [alex@tokentax.us](mailto:alex@tokentax.us)
