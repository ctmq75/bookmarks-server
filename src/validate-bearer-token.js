  
const { API_TOKEN } = require('./config.js')
const logger = require('./logger.js')


function validateBearerToken(req, res, next) {
  console.log(API_TOKEN)
  const authToken = req.get('Authorization')
  logger.error(`Unauthorized request to path: ${req.path}`)

  if (authToken !== API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorizeddd request' })
  }
  next()
}

module.exports = validateBearerToken


/*
app.use(function validateBearerToken(req, res, next) {

  const authToken = req.get('Authorization')
  const apiToken = 'Bearer ' + process.env.API_TOKEN

  if ( authToken !== apiToken) {
    return res.status(401).json({ error: 'unauthorized' })
  }
  next()
})
*/