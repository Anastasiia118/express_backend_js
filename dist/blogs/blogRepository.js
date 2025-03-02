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
exports.blogRepository = void 0;
const db_1 = require("../db/db");
exports.blogRepository = {
    create(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = Object.assign(Object.assign({}, input), { id: Math.random().toString(36).substring(2, 12) });
            try {
                db_1.db.blogs = [...db_1.db.blogs, newBlog];
            }
            catch (e) {
                // log
                return { error: e.message };
            }
            return newBlog;
        });
    },
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.db.blogs.find(p => p.id === id);
        });
    },
    findForOutput(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.find(id);
            if (!blog) {
                return { error: 'Blog not found' };
            }
            return blog;
        });
    },
    getBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.db.blogs;
        });
    },
    update(input, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = db_1.db.blogs.find(b => b.id === id);
            if (!blog) {
                return { error: 'Blog not found' };
            }
            const updatedBlog = Object.assign(Object.assign({}, blog), input);
            try {
                db_1.db.blogs = db_1.db.blogs.map(b => b.id === id ? updatedBlog : b);
            }
            catch (e) {
                // log
                return { error: e.message };
            }
            return blog;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = db_1.db.blogs.find(b => b.id === id);
            if (!blog) {
                return { error: 'Blog not found' };
            }
            try {
                db_1.db.blogs = db_1.db.blogs.filter(b => b.id !== id);
            }
            catch (e) {
                // log
                return { error: e.message };
            }
            return blog;
        });
    },
    mapToOutput(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                id: blog.id,
                name: blog.name,
            };
        });
    }
};
