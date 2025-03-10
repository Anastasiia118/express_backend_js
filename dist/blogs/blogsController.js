"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogController = exports.blogsRouter = void 0;
const express_1 = require("express");
const blogRepository_1 = require("./blogRepository");
const express_validator_1 = require("express-validator");
const middlewares_1 = require("../middlewares");
exports.blogsRouter = (0, express_1.Router)();
exports.blogController = {
    getBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogs = yield blogRepository_1.blogRepository.getBlogs();
                if (!blogs.length) {
                    res.status(404).send("No blogs found");
                    return;
                }
                res.status(200).json(blogs);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to retrieve blogs' });
            }
        });
    },
    // async createBlog(req: Request, res: Response) {
    //   const result = await blogRepository.create(req.body);
    //   res.status(201).json(result);
    // },
    createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = req.body;
            try {
                const createdBlog = yield blogRepository_1.blogRepository.create(newBlog);
                res.status(201).json(createdBlog);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to create blog' });
            }
        });
    },
    // async getBlogById(req: Request, res: Response) {
    //   const result = await blogRepository.findForOutput(req.params.id as string);
    //   if (result.error) {
    //     res.status(404).json(result);
    //     return;
    //   }
    //   res.status(200).json(result);
    // },
    getBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const result = yield blogRepository_1.blogRepository.findForOutput(id);
                if (result.error) {
                    res.status(404).json(result);
                    return;
                }
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to retrieve blog' });
            }
        });
    },
    updateBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const updateData = req.body;
            try {
                const result = yield blogRepository_1.blogRepository.update(updateData, id);
                if (result.error) {
                    res.status(404).json(result);
                    return;
                }
                res.status(204).json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to update blog' });
            }
        });
    },
    deleteBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const result = yield blogRepository_1.blogRepository.delete(id);
                if (result.error) {
                    res.status(404).json(result);
                    return;
                }
                res.status(204).json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to delete blog' });
            }
        });
    }
};
exports.blogsRouter.get("/", exports.blogController.getBlogs);
exports.blogsRouter.post("/", middlewares_1.authorizationMiddleware, (0, express_validator_1.body)("name")
    .isString()
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage("Name must be between 1 and 15 characters"), (0, express_validator_1.body)("description")
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Description must be between 1 and 500 characters"), (0, express_validator_1.body)("websiteUrl")
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .matches('https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
    .withMessage('Invalid URL'), middlewares_1.inputCheckErrorsMiddleware, exports.blogController.createBlog);
exports.blogsRouter.put("/:id", middlewares_1.authorizationMiddleware, (0, express_validator_1.param)("id")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("the id is required"), (0, express_validator_1.body)("name")
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage("Name must be between 1 and 15 characters"), (0, express_validator_1.body)("description")
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Description must be between 1 and 500 characters"), (0, express_validator_1.body)("websiteUrl")
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .matches('https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
    .withMessage('Invalid URL'), middlewares_1.inputCheckErrorsMiddleware, exports.blogController.updateBlog);
exports.blogsRouter.get("/:id", exports.blogController.getBlogById);
exports.blogsRouter.delete("/:id", middlewares_1.authorizationMiddleware, (0, express_validator_1.param)("id")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("the id is required"), middlewares_1.inputCheckErrorsMiddleware, exports.blogController.deleteBlog);
