import { Request, Response, Router } from 'express';
import { postRepository } from './postRepository';
import { body, query, validationResult } from 'express-validator';

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
  }
}

postsRouter.get('/', postController.getPosts)

