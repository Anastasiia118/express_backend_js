import { Request, Response, Router } from "express";
import { blogRepository } from "./blogRepository";
import { body, param } from "express-validator";
import { inputCheckErrorsMiddleware, authorizationMiddleware } from "../middlewares";

export const blogsRouter = Router();

export const blogController = {
  getBlogs: (req: Request, res: Response) => {
    const blogs = blogRepository.getBlogs();
    if (!blogs.length) {
      res.status(404).send("No blogs found");
      return;
    }
    res.status(200).json(blogs);
  },
  createBlog: (req: Request, res: Response) => {
    const result = blogRepository.create(req.body);
    res.status(201).json(result);
  },
  getBlogById: (req: Request, res: Response) => {
    const blog = blogRepository.findForOutput(req.params.id);
    if (!blog) {
      res.status(404).send("Blog not found");
      return;
    }
    res.status(200).json(blog);
  },
  updateBlog: (req: Request, res: Response) => {
    const result = blogRepository.update(req.body, req.params.id as string);
    res.status(200).json(result);
  },
  deleteBlog: (req: Request, res: Response) => {
    const result = blogRepository.delete(req.params.id as string);
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
  body("name")
    .isString()
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage("Name must be between 3 and 15 characters"),
  body("description")
    .isString()
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage("Description must be between 3 and 500 characters"),
  body("websiteUrl")
    .isString()
    .trim()
    .isLength({ min: 3, max: 100 })
    .matches('https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
    .withMessage('Invalid URL'),
  inputCheckErrorsMiddleware,
  authorizationMiddleware,
  blogController.createBlog
);
blogsRouter.put(
  "/:id",
  param("id")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("the id is required"),
  body("name")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage("Name must be between 3 and 15 characters"),
  body("description")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage("Description must be between 3 and 500 characters"),
  body("websiteUrl")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 100 })
    .matches('https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
    .withMessage('Invalid URL'),
  inputCheckErrorsMiddleware, 
  authorizationMiddleware,
  blogController.updateBlog
);
blogsRouter.get("/:id", blogController.getBlogById);
blogsRouter.delete("/:id", 
  param("id")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("the id is required"),
  inputCheckErrorsMiddleware, 
  authorizationMiddleware,
blogController.deleteBlog);
