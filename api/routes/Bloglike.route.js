import express from 'express'
import { doLike, likecount } from '../controllers/BlogLike.controller.js'
import { authenticate} from '../middleware/authenticate.js'

const BlogLikeRoute = express.Router()

BlogLikeRoute.post('/do-like',authenticate, doLike)
BlogLikeRoute.get('/get-like/:blogid/:userid',likecount)


export default BlogLikeRoute