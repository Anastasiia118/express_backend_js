"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRepository = void 0;
const db_1 = require("../db/db");
exports.postRepository = {
    create(input) {
        const newPost = Object.assign(Object.assign({}, input), { id: Math.random().toString(36).substring(2, 12), blogName: 'Blog name' });
        try {
            db_1.db.posts = [...db_1.db.posts, newPost];
        }
        catch (e) {
            // log
            return { error: e.message };
        }
        return { id: newPost.id };
    },
    find(id) {
        return db_1.db.posts.find(p => p.id === id);
    },
    findForOutput(id) {
        const post = this.find(id);
        if (!post) {
            return null;
        }
        return this.mapToOutput(post);
    },
    getPosts() {
        return db_1.db.posts;
    },
    mapToOutput(post) {
        return {
            id: post.id,
            title: post.title,
        };
    }
};
