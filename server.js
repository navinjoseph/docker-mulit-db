import express from 'express'
import log from 'roarr'

const PORT = process.env.PORT || 6001

const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.server = app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

module.exports = app
