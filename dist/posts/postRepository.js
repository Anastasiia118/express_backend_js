"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRepository = void 0;
const db_1 = require("../db/db");
exports.postRepository = {
    create(input) {
        const relatedBlog = db_1.db.blogs.find(b => b.id === input.blogId);
        const newPost = Object.assign(Object.assign({}, input), { id: Math.random().toString(36).substring(2, 12), blogName: (relatedBlog === null || relatedBlog === void 0 ? void 0 : relatedBlog.name) || '' });
        db_1.db.posts = [...db_1.db.posts, newPost];
        return newPost;
    },
    find(id) {
        return db_1.db.posts.find(p => p.id === id);
    },
    findForOutput(id) {
        const post = this.find(id);
        if (!post) {
            return { error: 'Post not found' };
        }
        return post;
    },
    getPosts() {
        return db_1.db.posts;
    },
    update(input, id) {
        const post = db_1.db.posts.find(p => p.id === id);
        if (!post) {
            return { error: 'Post not found' };
        }
        const updatedPost = Object.assign(Object.assign({}, post), input);
        try {
            db_1.db.posts = db_1.db.posts.map(p => p.id === id ? updatedPost : p);
        }
        catch (e) {
            // log
            return { error: e.message };
        }
        return post;
    },
    delete(id) {
        const post = db_1.db.posts.find(p => p.id === id);
        if (!post) {
            return { error: 'Post not found' };
        }
        try {
            db_1.db.posts = db_1.db.posts.filter(p => p.id !== id);
        }
        catch (e) {
            // log
            return { error: e.message };
        }
        return post;
    },
    mapToOutput(post) {
        return {
            id: post.id,
            title: post.title,
        };
    }
};
