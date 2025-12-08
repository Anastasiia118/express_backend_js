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
exports.blogsService = void 0;
const blogRepository_1 = require("../blogRepository");
exports.blogsService = {
    createBlog(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogRepository_1.blogRepository.create(input);
        });
    },
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield blogRepository_1.blogRepository.findForOutput(id);
            if ('error' in result) {
                return { error: result.error };
            }
            return { blog: result };
        });
    },
    getAllBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogRepository_1.blogRepository.getBlogs(query);
        });
    },
    getPostsByBlogId(query, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogRepository_1.blogRepository.find(blogId);
            if (!blog) {
                return { error: 'Blog not found' };
            }
            return yield blogRepository_1.blogRepository.getPostsByBlogId(query, blogId);
        });
    },
    createPostForBlog(postData) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogRepository_1.blogRepository.find(postData.blogId);
            if (!blog) {
                return { error: 'Blog not found' };
            }
            return yield blogRepository_1.blogRepository.createPostForBlog(Object.assign({}, postData), blog.name);
        });
    },
    updateBlog(updateData, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogRepository_1.blogRepository.update(updateData, id);
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogRepository_1.blogRepository.delete(id);
        });
    }
};
