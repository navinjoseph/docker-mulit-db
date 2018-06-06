# TokenTax Pricing API

**Example API URL:**

[https://pricing.tokentax.us/api/v1/history?symbol=ven&timestamp=1527034971544&access_token=xxx](https://pricing.tokentax.us/api/v1/history?symbol=ven&timestamp=1527034971544&access_token=xxx)

| Query Parameter | Description                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------- |
| `symbol`        | Cryptocurrency ticker symbol                                                                   |
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

## API Support

For support or sales inquiries email: [alex@tokentax.us](mailto:alex@tokentax.us)
