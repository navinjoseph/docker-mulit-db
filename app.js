import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import routes from './routes'
import './db'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(routes)

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.json({
    message: err.message,
    error: {}
  })
})

export default app
