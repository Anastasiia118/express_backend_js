import { Request, Response, Router } from 'express';
import { postRepository } from './postRepository';
import { body, param } from 'express-validator';
import { inputCheckErrorsMiddleware, blogIdValidation, authorizationMiddleware } from '../middlewares';
import { db } from '../db/db';

export const postsRouter = Router();

export const postController = {
  async getPosts(req: Request, res: Response) {
    const posts = await postRepository.getPosts();
    if (!posts.length) {
      res.status(404).send('No videos found');
      return;
    }
    res.status(200).json(posts);
  },
  async createPost(req: Request, res: Response) {
    const body = req.body;
    const result = await postRepository.create(body);
    res.status(201).json(result);
  },
  async getPostById(req: Request, res: Response) {
    const result = await postRepository.findForOutput(req.params.id as string);
    if (result.error) {
      res.status(404).json(result);
      return;
    }
    res.status(200).json(result);
  },
  async updatePost(req: Request, res: Response) {
    const body = req.body;
    const result = await postRepository.update(body, req.params.id as string);
    if (result.error) {
      res.status(404).json(result);
      return;
    }
    res.status(204).json(result);
  },
  async deletePost(req: Request, res: Response){
    const result = await postRepository.delete(req.params.id as string);
    if (result.error) {
      res.status(404).json(result);
      return;
    }
    res.status(204).json(result);
  },
  async deleteAllDB(req: Request, res: Response){
    db.posts = []
    db.blogs = []
    res.sendStatus(204)
  }
}

postsRouter.get('/', postController.getPosts);
postsRouter.post(
  '/',
  authorizationMiddleware,
  body('title')
    .isString()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Title must be between 1 and 30 characters'),
  body('shortDescription')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Description must be between 1 and 100 characters'),
  body('content')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Content must be between 1 and 100 characters'),
  blogIdValidation,
  inputCheckErrorsMiddleware,
  postController.createPost
);
postsRouter.get('/:id', postController.getPostById);
postsRouter.put(
  '/:id',
  authorizationMiddleware,
  param("id")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("the id is required"),
  body('title')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 30 })
    .withMessage('Title must be between 1 and 30 characters'),
  body('shortDescription')
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Description must be between 1 and 100 characters'),
  body('content')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content must be between 1 and 100 characters'),
  body('blogId')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 15 })
    .withMessage('Blog ID is required'),
  inputCheckErrorsMiddleware,
  postController.updatePost
);
postsRouter.delete('/:id',
  authorizationMiddleware,
  param("id")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("the id is required"),
  inputCheckErrorsMiddleware,
  postController.deletePost
);

