const store = require('./store.js')
const express = require('express')
const { v4: uuid } = require('uuid');
const logger = require('./logger.js')
const bmRouter = express.Router()
const bodyParser = express.json()
const app = express()



bmRouter
  // return list of bookmarks
  .route('/bookmarks')
  .get((req, res) => {
    res.json(store.bookmarks)
  })
  // adds bookmarks to list
  .post(bodyParser, (req, res) => {
    for (const field of ['title', 'url', 'rating']) {
      if (!req.body[field]) {
        logger.error(`${field} is required`)
        return res.status(400).send(`'${field}' is required`)
      }
    }

    const { title, url, description, rating } = req.body

    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      logger.error(`Invalid rating ${rating} supplied`)
      return res.status(400).send(`'rating' must be a number between 0 and 5`)
    }

    const bm = { id: uuid(), title, url, description, rating }
    store.bookmarks.push(bm)
    logger.info(`Bookmark with id ${bm.id} created`)

    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${bm.id}`)
      .json(bm)
  })

bmRouter
  .route('/bookmarks/:bookmark_id')
  // returns single bookmark given and ID or error
  .get((req, res) => {
    const { bookmark_id } = req.params

    const bm = store.bookmarks.find(c => c.id == bookmark_id)

    if (!bm) {
      logger.error(`Bookmark with id: ${bookmark_id} not found.`)
      return res
        .status(404)
        .send('Not Found')
    }

    res.json(bm)
  })
  // deletes bookmarks with given ID
  .delete((req, res) => {

    const { bookmark_id } = req.params
    const bmIndex = store.bookmarks.findIndex(b => b.id === bookmark_id)

    if (bmIndex === -1) {
      logger.error(`Bookmark with id ${bookmark_id} not found.`)
      return res
        .status(404)
        .send('Bookmark Not Found')
    }

    store.bookmarks.splice(bmIndex, 1)
    logger.info(`Bookmark with id ${bookmark_id} deleted.`)
    res
      .status(204)
      .end()
  })

module.exports = bmRouter