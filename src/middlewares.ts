import { Response, Request, NextFunction} from 'express'
import {body, validationResult, query} from 'express-validator'
import {blogRepository} from './blogs/blogRepository'
import {SETTINGS} from './settings'
import { SortDirection } from './types/common_types';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirection.DESC;

export function paginationAndSortingValidation<T extends string>(sortFieldsEnum: Record<string, T>) {//Record<string, T> - тип объекта, где ключи типа string, значения типа Т
  return [
    query('pageNumber')
      .default(DEFAULT_PAGE)
      .isInt({ min: 1 })
      .withMessage('Page number must be a positive integer')
      .toInt(),
 
    query('pageSize')
      .default(DEFAULT_PAGE_SIZE)
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100')
      .toInt(),
 
    query('sortBy')
      .default(Object.values(sortFieldsEnum)[0]) // Дефолтное значение - первое поле
      .isIn(Object.values(sortFieldsEnum))
      .withMessage(`Allowed sort fields: ${Object.values(sortFieldsEnum).join(', ')}`),
 
    query('sortDirection')
      .default(DEFAULT_SORT_DIRECTION)
      .isIn(Object.values(SortDirection))
      .withMessage(`Sort direction must be one of: ${Object.values(SortDirection).join(', ')}`),
  ];
 }
 
 
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
      return;
    }
    const formattedErrors = errors.array({ onlyFirstError: true })
    .map(err => {
        const field = (err as any).param ?? (err as any).path ?? '';
        return {
            field,
            message: err.msg
        }
    });
    res.status(400).json({ errorsMessages: formattedErrors });
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