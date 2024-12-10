import {Response, Request, NextFunction} from 'express'
import {validationResult} from 'express-validator'

export const inputCheckErrorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  console.log('inputCheckErrorsMiddleware errors: ', errors)
  if (errors.isEmpty()) {
    next();
  }
  res.status(400).json(errors.array());
  return;
}