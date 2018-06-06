import express from 'express'
import api from './api'

const router = express.Router()

router.use('/api/v1', api)
router.get('/', (req, res) => {
  res.render('index')
})

export default router
