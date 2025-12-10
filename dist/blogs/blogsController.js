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
exports.mapToBlogsListPaginatedOutput = mapToBlogsListPaginatedOutput;
const express_1 = require("express");
const blogsService_1 = require("./application/blogsService");
const express_validator_1 = require("express-validator");
const middlewares_1 = require("../middlewares");
const express_validator_2 = require("express-validator");
const post_types_1 = require("../types/post_types");
exports.blogsRouter = (0, express_1.Router)();
const BlogSortFields = {
    name: 'name',
    createdAt: 'createdAt',
    websiteUrl: 'websiteUrl'
};
function mapToBlogsListPaginatedOutput(blogs, meta) {
    return {
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        totalCount: meta.totalCount,
        items: blogs
    };
}
exports.blogController = {
    getBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sanitizedQuery = (0, express_validator_2.matchedData)(req, {
                    locations: ['query'],
                    includeOptionals: true
                });
                console.log('Sanitized query:', sanitizedQuery);
                const { blogs, totalCount } = yield blogsService_1.blogsService.getAllBlogs(sanitizedQuery);
                const blogsListOutput = mapToBlogsListPaginatedOutput(blogs, {
                    totalCount,
                    pageSize: sanitizedQuery.pageSize,
                    pageNumber: sanitizedQuery.pageNumber,
                });
                res.status(200).json(blogsListOutput);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to retrieve blogs' });
            }
        });
    },
    createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = req.body;
            try {
                const createdBlog = yield blogsService_1.blogsService.createBlog(newBlog);
                res.status(201).json(createdBlog);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to create blog' });
            }
        });
    },
    getBlogsPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogId = req.params.blogId;
            try {
                const sanitizedQuery = (0, express_validator_2.matchedData)(req, {
                    locations: ['query'],
                    includeOptionals: true,
                });
                const result = yield blogsService_1.blogsService.getPostsByBlogId(sanitizedQuery, blogId);
                if ('error' in result) {
                    res.status(404).json({ error: result.error });
                    return;
                }
                const { posts, totalCount } = result;
                const postsListOutput = (0, post_types_1.mapToPostsListPaginatedOutput)(posts, {
                    totalCount,
                    pageSize: sanitizedQuery.pageSize,
                    pageNumber: sanitizedQuery.pageNumber,
                });
                res.status(200).json(postsListOutput);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to retrieve posts' });
            }
        });
    },
    createPostForBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogId = req.params.blogId;
            const postData = req.body;
            try {
                const result = yield blogsService_1.blogsService.createPostForBlog(Object.assign(Object.assign({}, postData), { blogId }));
                if ('error' in result) {
                    res.status(404).json({ error: result.error });
                    return;
                }
                res.status(201).json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to create post for blog' });
            }
        });
    },
    getBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const result = yield blogsService_1.blogsService.getBlogById(id);
                if (result.error) {
                    res.status(404).json(result.error);
                    return;
                }
                res.status(200).json(result.blog);
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
                const result = yield blogsService_1.blogsService.updateBlog(updateData, id);
                if (result.error) {
                    res.status(404).json(result);
                    return;
                }
                res.status(204).json();
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
                const result = yield blogsService_1.blogsService.deleteBlog(id);
                if (result.error) {
                    res.status(404).json(result);
                    return;
                }
                res.status(204).json();
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to delete blog' });
            }
        });
    }
};
exports.blogsRouter.get("/", (0, middlewares_1.paginationAndSortingValidation)(BlogSortFields), (0, express_validator_1.query)('searchNameTerm')
    .optional()
    .isString()
    .trim()
    .withMessage('Search name term must be a string'), middlewares_1.inputCheckErrorsMiddleware, exports.blogController.getBlogs);
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
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 15 })
    .withMessage("Name must be between 1 and 15 characters"), (0, express_validator_1.body)("description")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 500 })
    .withMessage("Description must be between 1 and 500 characters"), (0, express_validator_1.body)("websiteUrl")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 100 })
    .matches('https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
    .withMessage('Invalid URL'), middlewares_1.inputCheckErrorsMiddleware, exports.blogController.updateBlog);
exports.blogsRouter.get("/:id", (0, express_validator_1.param)("id")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("the id is required"), middlewares_1.inputCheckErrorsMiddleware, exports.blogController.getBlogById);
exports.blogsRouter.get("/:blogId/posts", (0, express_validator_1.param)("blogId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("the id is required"), (0, middlewares_1.paginationAndSortingValidation)(post_types_1.PostSortFields), middlewares_1.inputCheckErrorsMiddleware, exports.blogController.getBlogsPosts);
exports.blogsRouter.post("/:blogId/posts", middlewares_1.authorizationMiddleware, (0, express_validator_1.param)("blogId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("the id is required"), (0, express_validator_1.body)("title")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 30 })
    .withMessage("Title must be between 1 and 30 characters"), (0, express_validator_1.body)("shortDescription")
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Description must be between 1 and 100 characters"), (0, express_validator_1.body)("content")
    .isString()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Content must be between 1 and 1000 characters"), middlewares_1.inputCheckErrorsMiddleware, exports.blogController.createPostForBlog);
exports.blogsRouter.delete("/:id", middlewares_1.authorizationMiddleware, (0, express_validator_1.param)("id")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("the id is required"), middlewares_1.inputCheckErrorsMiddleware, exports.blogController.deleteBlog);
