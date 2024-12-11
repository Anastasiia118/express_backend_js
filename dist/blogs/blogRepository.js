"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRepository = void 0;
const db_1 = require("../db/db");
exports.blogRepository = {
    create(input) {
        const newBlog = Object.assign(Object.assign({}, input), { id: Math.random().toString(36).substring(2, 12) });
        try {
            db_1.db.blogs = [...db_1.db.blogs, newBlog];
        }
        catch (e) {
            // log
            return { error: e.message };
        }
        return { id: newBlog.id };
    },
    find(id) {
        return db_1.db.blogs.find(p => p.id === id);
    },
    findForOutput(id) {
        const blog = this.find(id);
        if (!blog) {
            return null;
        }
        return this.mapToOutput(blog);
    },
    getBlogs() {
        return db_1.db.blogs;
    },
    update(input, id) {
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
    },
    delete(id) {
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
    },
    mapToOutput(blog) {
        return {
            id: blog.id,
            name: blog.name,
        };
    }
};
