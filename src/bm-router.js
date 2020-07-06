const express = require('express')
const { v4: uuid } = require('uuid');
const logger = require('./logger.js');
const { xssFilter } = require('helmet');
const xss = require('xss')
const BookmarksService = require('./bm-service')
const bmRouter = express.Router()
const bodyParser = express.json()


const saniBookmarks = (bookmark) => ({
  title: xss(bookmark.title),
  description: xss(bookmark.description),
  id: bookmark.id,
  url: bookmark.url,
  rating: Number(bookmark.rating),
})



bmRouter
  // return list of bookmarks
  .route('/bookmarks')
  .get((req, res, next) => {
    BookmarksService.getAllBookmarks(req.app.get('db'))
      .then(bookmark => {
        res.json(bookmark.map(saniBookmarks))
      })
      .catch(next)
  })
  // adds bookmarks to list
  .post(bodyParser, (req, res, next) => {
    for (const field of ['title', 'url', 'rating']) {
      if (!req.body[field]) {
        logger.error(`${field} is required`)
        return res.status(400).send({error: {message: `'${field}' is required`}})
      }
    }

    const { title, url, description, rating } = req.body

    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      logger.error(`Invalid rating ${rating} supplied`)
      return res.status(400).send(`'rating' must be a number between 0 and 5`)
    }

    const newBookmark = { title, url, description, rating }
    BookmarksService.insertBookmark(
      req.app.get('db'), newBookmark
    )
    .then(bookmark => {
      logger.info(`bookmark with id ${bookmark.id} created`)
      res
        .status(201)
        .location(`/bookmarks/${bookmark.id}`)
        .json(saniBookmarks(bookmark))
    })
    .catch(next)
  })

bmRouter
  .route('/bookmarks/:bookmark_id')
  .all((req, res, next) => {
    const { bookmark_id } = req.params
    BookmarksService.getById(req.app.get('db'), bookmark_id)
      .then(bookmark => {
        if (!bookmark) {
          logger.error(`Bookmark with id ${bookmark_id} not found.`)
          return res.status(404).json({
            error: { message: `Bookmark Not Found` }
          })
        }
        res.bookmark = bookmark
        next()
      })
      .catch(next)
  })
  // returns single bookmark given and ID or error
  .get((req, res) => {
    res.json(saniBookmark(res.bookmark))
  })
  // deletes bookmarks with given ID
  .delete((req, res, next) => {
    const { bookmark_id } = req.params
    BookmarksService.deleteBookmark(req.app.get('db'), bookmark_id)
    .then(blah => {
      logger.info(`Bookmark with id: ${bookmark_id} has been deleted`)
      res.status(204).end()
    })
    .catch(next)
  })

module.exports = bmRouter