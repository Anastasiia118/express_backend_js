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
exports.postController = exports.postsRouter = void 0;
const express_1 = require("express");
const postsService_1 = require("./application/postsService");
const express_validator_1 = require("express-validator");
const middlewares_1 = require("../middlewares");
const mongoDb_1 = require("../db/mongoDb");
const post_types_1 = require("../types/post_types");
exports.postsRouter = (0, express_1.Router)();
exports.postController = {
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sanitizedQuery = (0, express_validator_1.matchedData)(req, {
                    locations: ['query'],
                    includeOptionals: true,
                });
                const { posts, totalCount } = yield postsService_1.postsService.getAllPosts(sanitizedQuery);
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
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const result = yield postsService_1.postsService.createPost(body);
            res.status(201).json(result);
        });
    },
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield postsService_1.postsService.getPostById(req.params.id);
            if (result.error) {
                res.status(404).json(result);
                return;
            }
            res.status(200).json(result);
        });
    },
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const result = yield postsService_1.postsService.updatePost(req.params.id, body);
            if (result.error) {
                res.status(404).json(result);
                return;
            }
            res.status(204).json(result);
        });
    },
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield postsService_1.postsService.deletePost(req.params.id);
            if (result.error) {
                res.status(404).json(result);
                return;
            }
            res.status(204).json(result);
        });
    },
    deleteAllDB(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoDb_1.postsCollection.deleteMany({});
            yield mongoDb_1.blogsCollection.deleteMany({});
            res.sendStatus(204);
        });
    }
};
exports.postsRouter.get('/', (0, middlewares_1.paginationAndSortingValidation)(post_types_1.PostSortFields), middlewares_1.inputCheckErrorsMiddleware, exports.postController.getPosts);
exports.postsRouter.post('/', middlewares_1.authorizationMiddleware, (0, express_validator_1.body)('title')
    .isString()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Title must be between 1 and 30 characters'), (0, express_validator_1.body)('shortDescription')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Description must be between 1 and 100 characters'), (0, express_validator_1.body)('content')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Content must be between 1 and 100 characters'), middlewares_1.blogIdValidation, middlewares_1.inputCheckErrorsMiddleware, exports.postController.createPost);
exports.postsRouter.get('/:id', exports.postController.getPostById);
exports.postsRouter.put('/:id', middlewares_1.authorizationMiddleware, (0, express_validator_1.param)("id")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("the id is required"), (0, express_validator_1.body)('title')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 30 })
    .withMessage('Title must be between 1 and 30 characters'), (0, express_validator_1.body)('shortDescription')
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Description must be between 1 and 100 characters'), (0, express_validator_1.body)('content')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content must be between 1 and 100 characters'), (0, express_validator_1.body)('blogId')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 100 })
    .withMessage('Blog ID is required'), middlewares_1.inputCheckErrorsMiddleware, exports.postController.updatePost);
exports.postsRouter.delete('/:id', middlewares_1.authorizationMiddleware, (0, express_validator_1.param)("id")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("the id is required"), middlewares_1.inputCheckErrorsMiddleware, exports.postController.deletePost);
