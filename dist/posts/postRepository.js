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
exports.postRepository = void 0;
const db_1 = require("../db/db");
exports.postRepository = {
    create(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const relatedBlog = db_1.db.blogs.find(b => b.id === input.blogId);
            const newPost = Object.assign(Object.assign({}, input), { id: Math.random().toString(36).substring(2, 12), blogName: (relatedBlog === null || relatedBlog === void 0 ? void 0 : relatedBlog.name) || '' });
            db_1.db.posts = [...db_1.db.posts, newPost];
            return newPost;
        });
    },
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.db.posts.find(p => p.id === id);
        });
    },
    findForOutput(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.find(id);
            if (!post) {
                return { error: 'Post not found' };
            }
            return post;
        });
    },
    getPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.db.posts;
        });
    },
    update(input, id) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    },
    mapToOutput(post) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                id: post.id,
                title: post.title,
            };
        });
    }
};
