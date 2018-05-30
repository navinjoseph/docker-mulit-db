# TokenTax Historical Price API

[![CircleCI](https://circleci.com/gh/TokenTax/history.svg?style=svg&circle-token=ff5098f80351de679401cbf3df5dda2809c54c5f)](https://circleci.com/gh/TokenTax/history) [![codecov](https://codecov.io/gh/TokenTax/pricing/branch/master/graph/badge.svg?token=yxwGf6lKVR)](https://codecov.io/gh/TokenTax/pricing)

## Documentation

Example API URL: https://tt-history-db.herokuapp.com/api/v1/history?symbol=ven&timestamp=1527034971544

| Query Parameter | Description                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------- |
| `symbol`        | Cryptocurrency ticker symbol                                                                   |
| `timestamp`     | A timestamp in js. You can get this date format from doing `Date.now()` or `dateVar.getTime()` |

## Develop locally

Create local databases

```
createdb tt_history_test
createdb tt_history_dev
```

Install and start app

```
yarn install
yarn run start
```

Run scraper script

```
yarn run scrape
```

## Testing

Run all tests

```
yarn test:watch
```

See code coverage

```
yarn test:coverage
```

## Production scripts

Run historical scraper in production

```
heroku run:detached node build/historicalScraper.js
```
