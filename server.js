import express from 'express'
import morgan from 'morgan'
import './db'

const app = express()
const port = process.env.PORT || 3000

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

app.get('/', (req, res) => res.send('History DB'))

app.listen(port, () => {
  console.log('Magic happens on port ' + port)
})
