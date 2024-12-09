import { Request, Response, Router } from 'express';
import { postRepository } from './postRepository';
import { body, param, validationResult } from 'express-validator';
import { inputCheckErrorsMiddleware, blogIdValidation } from './middlewares';

export const postsRouter = Router();

export const postController = {
  getPosts: (req: Request, res: Response) => {
    const posts = postRepository.getPosts();
    if (!posts.length) {
      res.status(404).send('No videos found');
      return;
    }
    res.status(200).json(posts);
  },
  createPost: (req: Request, res: Response) => {
    const body = req.body;
    const result = postRepository.create(body);
    res.status(201).json(result);
  },
  getPostById: (req: Request, res: Response) => {
    const post = postRepository.findForOutput(req.params.id);
    if (!post) {
      res.status(404).send('Post not found');
      return;
    }
    res.status(200).json(post);
  },
  updatePost: (req: Request, res: Response) => {
    const body = req.body;
    const result = postRepository.update(body, req.params.id as string);
    
    res.status(200).json(result);
  },
  deletePost: (req: Request, res: Response) => {
    const result = postRepository.delete(req.params.id as string);
    if (result.error) {
      res.status(404).json(result);
      return;
    }
    res.status(204).json(result);
  }
}

postsRouter.get('/', postController.getPosts);
postsRouter.post(
  '/',
  body('title')
    .isString()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Title must be between 3 and 30 characters'),
  body('shortDescription')
    .isString()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Description must be between 3 and 100 characters'),
  body('content')
    .isString()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Content must be between 3 and 100 characters'),
  blogIdValidation,
  inputCheckErrorsMiddleware,
  postController.createPost
);
postsRouter.get('/:id', postController.getPostById);
postsRouter.put(
  '/:id',
  param("id")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("the id is required"),
  body('title')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Title must be between 3 and 30 characters'),
  body('shortDescription')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Description must be between 3 and 100 characters'),
  body('content')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Content must be between 3 and 100 characters'),
  body('blogId')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Blog ID is required'),
  inputCheckErrorsMiddleware,
  postController.updatePost
);
postsRouter.delete('/:id',
  param("id")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("the id is required"),
  inputCheckErrorsMiddleware,
  postController.deletePost
);

