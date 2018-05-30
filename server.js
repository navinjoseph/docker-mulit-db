// 💃 This is where it all starts
import {} from 'dotenv/config'
import app from './app'
import winston from 'winston'

const port = process.env.PORT || 3000

app.listen(port, () => {
  winston.info('Magic happens on port ' + port)
})
