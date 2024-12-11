import express from 'express'
import cors from 'cors'
import {SETTINGS} from './settings'
import {postsRouter, postController} from './posts/postsController'
import {blogsRouter} from './blogs/blogsController'

 
export const app = express()

app.use(express.json()) 

app.use(cors()) 

app.get('/', (req, res) => {
    res.status(200).json({version: '1.0'})
})

app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.delete(SETTINGS.PATH.TESTING, postController.deleteAllDB)

