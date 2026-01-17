import { Request, Response, Router } from "express";
import { blogsService } from "../domain/blogsService";
import { body, param, query } from "express-validator";
import { inputCheckErrorsMiddleware, authorizationMiddleware, paginationAndSortingValidation } from "../../middlewares";
import { BlogDBType } from "../../types/blog_types";
import { matchedData } from 'express-validator';
import { BlogQueryInput, BlogOutputType } from "../../types/blog_types";
import { PostQueryInput, mapToPostsListPaginatedOutput, PostSortFields } from "../../types/post_types";

export const blogsRouter = Router();

const BlogSortFields = {
  name: 'name',
  createdAt: 'createdAt',
  websiteUrl: 'websiteUrl'
};

export function mapToBlogsListPaginatedOutput(
  blogs: BlogOutputType[],
  meta: { totalCount: number; pageSize: number; pageNumber: number }
) {
return {
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    totalCount: meta.totalCount,
    items: blogs
  };
}

export const blogController = {
  async getBlogs(
    req: Request, 
    res: Response
  ) {
    try {
      const sanitizedQuery = matchedData<BlogQueryInput>(req, {
         locations: ['query'] ,
         includeOptionals: true
      })
      console.log('Sanitized query:', sanitizedQuery); 
      const { blogs, totalCount } = await blogsService.getAllBlogs(sanitizedQuery);
      const blogsListOutput = mapToBlogsListPaginatedOutput(blogs, {
        totalCount,
        pageSize: sanitizedQuery.pageSize,
        pageNumber: sanitizedQuery.pageNumber,
      });
      res.status(200).json(blogsListOutput);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve blogs' });
    }
  },
  async createBlog(req: Request, res: Response): Promise<void> {
    const newBlog: BlogDBType = req.body;
    try {
        const createdBlog = await blogsService.createBlog(newBlog);
        res.status(201).json(createdBlog);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create blog' });
    }
  },
  async getBlogsPosts(req: Request, res: Response) {
    const blogId = req.params.blogId;
    try {
        const sanitizedQuery = matchedData<PostQueryInput>(req, {
            locations: ['query'] ,
            includeOptionals: true,
        })
        const result = await blogsService.getPostsByBlogId(sanitizedQuery, blogId);
        if ('error' in result) {
            res.status(404).json({ error: result.error });
            return;
        }
        const { posts, totalCount } = result;
        const postsListOutput = mapToPostsListPaginatedOutput(posts, {
          totalCount,
          pageSize: sanitizedQuery.pageSize,
          pageNumber: sanitizedQuery.pageNumber,
        });
        res.status(200).json(postsListOutput);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve posts' });
    }
  },
  async createPostForBlog(req: Request, res: Response): Promise<void> {
    const blogId = req.params.blogId;
    const postData = req.body;
    try {
        const result = await blogsService.createPostForBlog({...postData, blogId});
        if ('error' in result) {
            res.status(404).json({ error: result.error });
            return;
        }
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post for blog' });
    }
  },
  async getBlogById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    try {
        const result = await blogsService.getBlogById(id as string);
        if (result.error) {
          res.status(404).json(result.error);
          return;
        }
        res.status(200).json(result.blog);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve blog' });
    }
  },
  async updateBlog(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const updateData: Partial<BlogDBType> = req.body;
    try {
      const result = await blogsService.updateBlog(updateData, id as string);
      if (result.error) {
          res.status(404).json(result);
          return;
      }
      res.status(204).json();
    } catch (error) {
        res.status(500).json({ error: 'Failed to update blog' });
    }
  },
  async deleteBlog(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    try {
      const result = await blogsService.deleteBlog(id);
      if (result.error) {
          res.status(404).json(result);
          return;
      }
      res.status(204).json();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete blog' });
    }
  }
};

blogsRouter.get("/", 
  paginationAndSortingValidation(BlogSortFields),
  query('searchNameTerm')
      .optional()
      .isString()
      .trim()
      .withMessage('Search name term must be a string'),
  inputCheckErrorsMiddleware,
  blogController.getBlogs
);
blogsRouter.post(
  "/",
  authorizationMiddleware,
  body("name")
    .isString()
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage("Name must be between 1 and 15 characters"),
  body("description")
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Description must be between 1 and 500 characters"),
  body("websiteUrl")
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .matches('https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
    .withMessage('Invalid URL'),
  inputCheckErrorsMiddleware,
  blogController.createBlog
);
blogsRouter.put(
  "/:id",
  authorizationMiddleware,
  param("id")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("the id is required"),
  body("name")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 15 })
    .withMessage("Name must be between 1 and 15 characters"),
  body("description")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 500 })
    .withMessage("Description must be between 1 and 500 characters"),
  body("websiteUrl")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 100 })
    .matches('https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
    .withMessage('Invalid URL'),
  inputCheckErrorsMiddleware, 
  blogController.updateBlog
);
blogsRouter.get("/:id",
  param("id")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("the id is required"),
  inputCheckErrorsMiddleware,
  blogController.getBlogById);
blogsRouter.get("/:blogId/posts",
  param("blogId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("the id is required"),
  paginationAndSortingValidation(PostSortFields),
  inputCheckErrorsMiddleware,
  blogController.getBlogsPosts);
blogsRouter.post("/:blogId/posts",
  authorizationMiddleware,
  param("blogId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("the id is required"),
  body("title")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 30 })
    .withMessage("Title must be between 1 and 30 characters"),
  body("shortDescription")
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Description must be between 1 and 100 characters"),
  body("content")
    .isString()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Content must be between 1 and 1000 characters"),
  inputCheckErrorsMiddleware, 
  blogController.createPostForBlog);
blogsRouter.delete("/:id",
  authorizationMiddleware,
  param("id")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("the id is required"),
  inputCheckErrorsMiddleware,   
blogController.deleteBlog);