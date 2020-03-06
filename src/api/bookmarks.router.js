const express = require('express')
const {getBookmarks, postBookmark, getBookmark, deleteBookmark, updateBookmark} = require('./bookmarks.controller')

const bookmarksRouter = express.Router()


bookmarksRouter
    .route('/bookmarks')
    .get(getBookmarks)
    .post(postBookmark)

bookmarksRouter
    .route('/bookmarks/:id')
    .get(getBookmark)
    .patch(updateBookmark)
    .delete(deleteBookmark)


module.exports = bookmarksRouter