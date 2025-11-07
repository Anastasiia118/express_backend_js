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
            return yield blogRepository_1.blogRepository.findForOutput(id);
        });
    },
    getAllBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogRepository_1.blogRepository.getBlogs(query);
        });
    },
    updateBlog(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogRepository_1.blogRepository.update(input, id);
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogRepository_1.blogRepository.delete(id);
        });
    }
};
