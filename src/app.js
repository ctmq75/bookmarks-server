
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config.js')
const validateBearerToken = require('./validate-bearer-token.js')
const bmRouter = require('./bm-router.js')
const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test'
}))
app.use(cors())
app.use(helmet())
app.use(validateBearerToken)
app.use(bmRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
     let response
     if (NODE_ENV === 'production') {
       response = { error: { message: 'server error' } }
     } else {
       console.error(error)
       response = { message: error.message, error }
     }
    res.status(500).json(response)
})

app.use('/api/bookmarks', bmRouter)


module.exports = app