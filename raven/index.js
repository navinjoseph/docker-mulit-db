let Raven

if (process.env.NODE_ENV === 'production') {
  Raven = require('raven')
  Raven.config(process.env.SENTRY_DSN_SERVER, {
    environment: process.env.NODE_ENV,
    name: process.env.SENTRY_NAME
  }).install()
} else {
  const noop = () => {}
  // winston.info('mocking Raven in development')
  // Mock the Raven API in development
  Raven = {
    captureException: noop,
    setUserContext: noop,
    config: () => ({ install: noop }),
    requestHandler: () => (req, res, next) => next(),
    parsers: {
      parseRequest: noop
    }
  }
}

export default Raven
