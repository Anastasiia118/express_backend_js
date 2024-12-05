"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postController = exports.postsRouter = void 0;
const express_1 = require("express");
const postRepository_1 = require("./postRepository");
exports.postsRouter = (0, express_1.Router)();
exports.postController = {
    getPosts: (req, res) => {
        const posts = postRepository_1.postRepository.getPosts();
        if (posts.length === 0) {
            return res.status(404).json({ error: 'No posts found' });
        }
        return res.status(200).json(posts);
    },
};
exports.postsRouter.get('/', exports.postController.getPosts);
