import { Response, Request, NextFunction} from 'express'
import {body, validationResult} from 'express-validator'
import {blogRepository} from './blogs/blogRepository'
import {SETTINGS} from './settings'

 
 
export const blogIdValidation = [
    body('blogId').custom((blogId) => {
        const blog = blogRepository.find(blogId)
        if (!blog) { 
          new Error('no blog!') 
          return false
        }
        return true
    }),
]
 
export const inputCheckErrorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    console.log('inputCheckErrorsMiddleware errors: ', errors)
    if (errors.isEmpty()) {
      next();
    }
    res.status(400).json(errors.array());
    return;
}

export const authorizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization
    const data = `${SETTINGS.AUTHORIZATION}`
    const buff = Buffer.from(data).toString('base64')
    const validAuthValue = `Basic ${buff}`
    if (auth && auth === validAuthValue) {
        next()
    } else {
        res.sendStatus(401)
    }
}