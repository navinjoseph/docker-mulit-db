# TokenTax Price API

[![CircleCI](https://circleci.com/gh/TokenTax/pricing.svg?style=shield&circle-token=ff5098f80351de679401cbf3df5dda2809c54c5f)](https://circleci.com/gh/TokenTax/pricing) [![codecov](https://codecov.io/gh/TokenTax/pricing/branch/master/graph/badge.svg?token=yxwGf6lKVR)](https://codecov.io/gh/TokenTax/pricing)

## Documentation

See https://github.com/TokenTax/pricing/blob/master/views/docs.md

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
