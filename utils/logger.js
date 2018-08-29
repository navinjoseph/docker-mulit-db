import winston from 'winston'
// import Sentry from 'winston-raven-sentry'

// const sentryOptions = {
//   dsn: process.env.SENTRY_DSN
// }
const consoleTransport = new winston.transports.Console({
  name: 'console-transport'
})
const fileTransport = new winston.transports.File({
  name: 'file-transport',
  filename: 'logs-all.log'
})
const logger = new winston.Logger({
  transports: [consoleTransport, fileTransport]
})

logger.stream = {
  write (message) {
    logger.info(message)
  }
}

if (process.env.NODE_ENV === 'production') {
  // logger.remove('console-transport')
  // logger.remove('file-transport')
  // logger.add(Sentry, sentryOptions)
}

export default logger
