// 💃 This is where it all starts
import 'newrelic'
import {} from 'dotenv/config'
import app from './app'
import winston from 'winston'
import throng from 'throng'

const port = process.env.PORT || 3000
const WORKERS = process.env.WEB_CONCURRENCY || 1
const { NODE_ENV } = process.env

function startApp () {
  app.listen(port, () => {
    winston.info('Magic happens on port ' + port)
  })
}

if (NODE_ENV !== 'production') {
  startApp()
} else {
  throng(
    {
      workers: WORKERS,
      lifetime: Infinity
    },
    startApp
  )
}
