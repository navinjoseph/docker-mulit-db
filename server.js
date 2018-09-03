// 💃 This is where it all starts
import 'newrelic'
import {} from 'dotenv/config'
import app from './app'
import logger from './utils/logger'
import throng from 'throng'

const port = process.env.PORT || 3000
const { NODE_ENV } = process.env

function startApp () {
  app.listen(port, () => {
    logger.info('Magic happens on port ' + port)
  })
}

if (NODE_ENV !== 'production') {
  startApp()
} else {
  throng(
    {
      workers: 1,
      lifetime: Infinity
    },
    startApp
  )
}
