import { Request, Response, Router } from "express";
import { blogRepository } from "./blogRepository";
import { body, param } from "express-validator";
import { inputCheckErrorsMiddleware, authorizationMiddleware } from "../middlewares";

export const blogsRouter = Router();

export const blogController = {
  async getBlogs(req: Request, res: Response) {
    const blogs = await blogRepository.getBlogs();
    if (!blogs.length) {
      res.status(404).send("No blogs found");
      return;
    }
    res.status(200).json(blogs);
  },
  async createBlog(req: Request, res: Response) {
    const result = await blogRepository.create(req.body);
    res.status(201).json(result);
  },
  async getBlogById(req: Request, res: Response) {
    const result = await blogRepository.findForOutput(req.params.id as string);
    if (result.error) {
      res.status(404).json(result);
      return;
    }
    res.status(200).json(result);
  },
  async updateBlog(req: Request, res: Response) {
    const result = await blogRepository.update(req.body, req.params.id as string);
    if (result.error) {
      res.status(404).json(result);
      return;
    }
    res.status(204).json(result);
  },
  async deleteBlog(req: Request, res: Response) {
    const result = await blogRepository.delete(req.params.id as string);
    if (result.error) {
      res.status(404).json(result);
      return;
    }
    res.status(204).json(result);
  }
};

blogsRouter.get("/", blogController.getBlogs);
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
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage("Name must be between 1 and 15 characters"),
  body("description")
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Description must be between 1 and 500 characters"),
  body("websiteUrl")
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .matches('https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
    .withMessage('Invalid URL'),
  inputCheckErrorsMiddleware, 
  blogController.updateBlog
);
blogsRouter.get("/:id", blogController.getBlogById);
blogsRouter.delete("/:id", 
  authorizationMiddleware,
  param("id")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("the id is required"),
  inputCheckErrorsMiddleware, 
blogController.deleteBlog);
