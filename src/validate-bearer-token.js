  
const { API_TOKEN } = require('./config.js')
const logger = require('./logger.js')


function validateBearerToken(req, res, next) {
  console.log(API_TOKEN)
  const authToken = req.get('Authorization')
  logger.error(`Unauthorized request to path: ${req.path}`)

  if (authToken !== 'Bearer ' + API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorizeddd request' })
  }
  next()
}

module.exports = validateBearerToken


