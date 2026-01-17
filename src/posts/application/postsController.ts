import { Request, Response, Router } from 'express';
import { postsService } from '../domain/postsService';
import { body, matchedData, param } from 'express-validator';
import { inputCheckErrorsMiddleware, blogIdValidation, authorizationMiddleware, paginationAndSortingValidation } from '../../middlewares';
import { blogsCollection, postsCollection } from '../../db/mongoDb';
import { PostQueryInput,  mapToPostsListPaginatedOutput, PostSortFields} from '../post_types';


export const postsRouter = Router();

export const postController = {
  async getPosts(req: Request, res: Response) {
    try {
      const sanitizedQuery = matchedData<PostQueryInput>(req, {
          locations: ['query'] ,
          includeOptionals: true,
      })
      const {posts, totalCount} = await postsService.getAllPosts(sanitizedQuery);
      const postsListOutput = mapToPostsListPaginatedOutput(posts, {
        totalCount,
        pageSize: sanitizedQuery.pageSize,
        pageNumber: sanitizedQuery.pageNumber,
      });
      res.status(200).json(postsListOutput);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve posts' }
      )
    }
  },
  async createPost(req: Request, res: Response) {
    const body = req.body;
    const result = await postsService.createPost(body);
    res.status(201).json(result);
  },
  async getPostById(req: Request, res: Response) {
    const result = await postsService.getPostById(req.params.id as string);
    if (result.error) {
      res.status(404).json(result);
      return;
    }
    res.status(200).json(result);
  },
  async updatePost(req: Request, res: Response) {
    const body = req.body;
    const result = await postsService.updatePost(req.params.id as string, body);
    if (result.error) {
      res.status(404).json(result);
      return;
    }
    res.status(204).json(result);
  },
  async deletePost(req: Request, res: Response){
    const result = await postsService.deletePost(req.params.id as string);
    if (result.error) {
      res.status(404).json(result);
      return;
    }
    res.status(204).json(result);
  },
  async deleteAllDB(req: Request, res: Response){
    await postsCollection.deleteMany({});
    await blogsCollection.deleteMany({});
    res.sendStatus(204)
  }
}

postsRouter.get('/', 
  paginationAndSortingValidation(PostSortFields),
  inputCheckErrorsMiddleware,
  postController.getPosts
);
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
    .isLength({ min: 1, max: 100 })
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
