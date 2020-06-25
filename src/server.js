const app = require('./app')
require('dotenv').config()
const { PORT } = require('./config')

app.listen(PORT, () => {
  console.log(process.env.API_TOKEN)
  console.log(`Server listening at http://localhost:${PORT}`)
})