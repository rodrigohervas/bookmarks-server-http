//const express = require('express')
const config = require('../config')
const { fetchData } = require('../fetcher')
const logger = require('../../src/logger')
const { isWebUri } = require('valid-url')

function getBookmarks(req, res, next) {
    try {        
        const url = config.URL
        const options = {
            method: 'GET', 
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${config.REMOTE_SERVER_API_KEY}`
            }
        }        
        //fetchData returns a promise, and we have to wait promise resolve with a then()
        fetchData(url, options)
            .then( bookmarks => {

                if(!bookmarks){
                    throw({ message:'no bookmarks found' })    
                }
                
                res.status(200).json(bookmarks)

            })
            .catch(error => {
                logger.error(`${error.message} at bookmarks.controller.getBookmarks.fetchData`)
                next({message: error.message})
            })
    } catch (error) {
        logger.error(`${error.message} at bookmarks.controller.getBookmarks`)
        throw({message: error.message, status:error.status})
    }
}

function getBookmark(req, res, next) {
    try {        
        const id = req.params.id
        const url = config.URL
        const options = {
            method: 'GET', 
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${config.REMOTE_SERVER_API_KEY}`
            }
        } 
        if (!id) {
            throw( {message: 'id is mandatory', status: '400'} )
        }

        fetchData(url, options)
            .then( bookmarks => {

                if(!bookmarks){
                    throw({ message:'no bookmark found' })    
                }

                const bookmark = bookmarks.filter(item => item.id === id)

                if(!bookmark.length) {
                    throw({message: '404 - Bookmark Not Found', status: '404'})
                }

                res.status(200).json(bookmark)
            })
            .catch(error => {
                logger.error(`${error.message} at bookmarks.controller.getBookmark.fetchData`)
                next({message: error.message})
        })
    } catch (error) {
        logger.error(`${error.message} at bookmarks.controller.getBookmark`)
        throw({message: error.message, status:error.status})
    }
}

function postBookmark(req, res, next) {
    try {
        const {title, url, description, rating} = req.body
        const bookmark = {
            title: title, 
            description: description, 
            url: url, 
            rating: rating
        }

        const uri = config.URL
        const options = {
            method: 'POST', 
            body: JSON.stringify(bookmark), 
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${config.REMOTE_SERVER_API_KEY}`
            }
        }

        if (!title) {
            throw( {message: 'title is mandatory', status: '400'} )
        }
        if (!url) {
            throw( {message: 'url is mandatory', status: '400'} )
        }
        if(!isWebUri(url)) {
            throw( {message: 'url must have a valid format', status: '400'} )
        }
        if (!description) {
            throw( {message: 'description is mandatory', status: '400'} )
        }
        if (!rating) {
            throw( {message: 'rating is mandatory', status: '400'} )
        }
        if(!Number.isInteger(rating) || rating < 0 || rating > 5) {
            throw( {message: 'rating must be a number, and between 1 and 5', status: '400'} )
        }

        fetchData(uri, options)
            .then( bookmark => {
                if(!bookmark){
                    throw({ message: 'no post done' })
                }               
                res.status(200).json(bookmark)
            })
            .catch(error => {
                logger.error(`${error.message} at bookmarks.controller.postBookmark.fetchData`)
                next({message: error.message})
            }) 

    } catch (error) {
        logger.error(`${error.message} at bookmarks.controller.postBookmark`)
        throw({message: error.message, status:error.status})
    }
}

//TODO: there seems to be a bug with PATCH/POST at the API with the 'description' field:
//      - POST: requires description field to be named 'description'
//      - PATCH: requires description field to be named 'desc'
function updateBookmark(req, res, next) {
    try {
        const {title, url, description, rating} = req.body
        const id = req.params.id
        const bookmark = {
            title: title, 
            //desc: description, 
            url: url, 
            rating: rating
        }
        const uri = `${config.URL}/${id}`
        const options = {
            method: 'PATCH', 
            body: JSON.stringify(bookmark), 
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${config.REMOTE_SERVER_API_KEY}`
            }
        }

        if (!id) {
            throw( {message: 'id is mandatory', status: '400'} )
        }
        if (!title) {
            throw( {message: 'title is mandatory', status: '400'} )
        }
        if (!url) {
            throw( {message: 'url is mandatory', status: '400'} )
        }
        if(!isWebUri(url)) {
            throw( {message: 'url must have a valid format', status: '400'} )
        }
        if (!description) {
            throw( {message: 'description is mandatory', status: '400'} )
        }
        if (!rating) {
            throw( {message: 'rating is mandatory', status: '400'} )
        }
        if(!Number.isInteger(rating) || rating < 0 || rating > 5) {
            throw( {message: 'rating must be a number, and between 1 and 5', status: '400'} )
        }
        

        fetchData(uri, options)
            .then( bookmark => {
                if(!bookmark){
                    throw({ message: 'no post done' })
                }               
                res.status(200).json(bookmark)
            })
            .catch(error => {
                logger.error(`${error.message} at bookmarks.controller.updateBookmark.fetchData`)
                next({message: error.message})
            }) 

    } catch (error) {
        console.log('update error: ', error)
        logger.error(`${error.message} at bookmarks.controller.updateBookmark`)
        throw({message: error.message, status:error.status})
    }
}

function deleteBookmark(req, res, next) {
    try {
        const id = req.params.id
        const url = `${config.URL}/${id}`
        const options = {
            method: 'DELETE', 
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${config.REMOTE_SERVER_API_KEY}`
            }
        }

        if (!id) {
            throw( {message: 'id is mandatory', status: '400'} )
        }

        fetchData(url, options)
            .then( bookmark => {
                res.status(200).json(bookmark)
            })
            .catch(error => {
                logger.error(`${error.message} at bookmarks.controller.deleteBookmark.fetchData`)
                next({message: error.message})
            })

    } catch (error) {
        logger.error(`${error.message} at bookmarks.controller.deleteBookmark`)
        throw({message: error.message, status:error.status})
    }
}


module.exports = {
    getBookmarks, 
    getBookmark, 
    postBookmark, 
    deleteBookmark, 
    updateBookmark
}