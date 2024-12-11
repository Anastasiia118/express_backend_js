"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogController = exports.blogsRouter = void 0;
const express_1 = require("express");
const blogRepository_1 = require("./blogRepository");
const express_validator_1 = require("express-validator");
const middlewares_1 = require("../middlewares");
exports.blogsRouter = (0, express_1.Router)();
exports.blogController = {
    getBlogs: (req, res) => {
        const blogs = blogRepository_1.blogRepository.getBlogs();
        if (!blogs.length) {
            res.status(404).send("No blogs found");
            return;
        }
        res.status(200).json(blogs);
    },
    createBlog: (req, res) => {
        const result = blogRepository_1.blogRepository.create(req.body);
        res.status(201).json(result);
    },
    getBlogById: (req, res) => {
        const blog = blogRepository_1.blogRepository.findForOutput(req.params.id);
        if (!blog) {
            res.status(404).send("Blog not found");
            return;
        }
        res.status(200).json(blog);
    },
    updateBlog: (req, res) => {
        const result = blogRepository_1.blogRepository.update(req.body, req.params.id);
        res.status(200).json(result);
    },
    deleteBlog: (req, res) => {
        const result = blogRepository_1.blogRepository.delete(req.params.id);
        if (result.error) {
            res.status(404).json(result);
            return;
        }
        res.status(204).json(result);
    }
};
exports.blogsRouter.get("/", exports.blogController.getBlogs);
exports.blogsRouter.post("/", (0, express_validator_1.body)("name")
    .isString()
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage("Name must be between 3 and 15 characters"), (0, express_validator_1.body)("description")
    .isString()
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage("Description must be between 3 and 500 characters"), (0, express_validator_1.body)("websiteUrl")
    .isString()
    .trim()
    .isLength({ min: 3, max: 100 })
    .matches('https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
    .withMessage('Invalid URL'), middlewares_1.inputCheckErrorsMiddleware, middlewares_1.authorizationMiddleware, exports.blogController.createBlog);
exports.blogsRouter.put("/:id", (0, express_validator_1.param)("id")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("the id is required"), (0, express_validator_1.body)("name")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage("Name must be between 3 and 15 characters"), (0, express_validator_1.body)("description")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage("Description must be between 3 and 500 characters"), (0, express_validator_1.body)("websiteUrl")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 100 })
    .matches('https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
    .withMessage('Invalid URL'), middlewares_1.inputCheckErrorsMiddleware, middlewares_1.authorizationMiddleware, exports.blogController.updateBlog);
exports.blogsRouter.get("/:id", exports.blogController.getBlogById);
exports.blogsRouter.delete("/:id", (0, express_validator_1.param)("id")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("the id is required"), middlewares_1.inputCheckErrorsMiddleware, middlewares_1.authorizationMiddleware, exports.blogController.deleteBlog);
