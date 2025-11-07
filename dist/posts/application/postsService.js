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
exports.postsService = void 0;
const postRepository_1 = require("../postRepository");
const blogRepository_1 = require("../../blogs/blogRepository");
exports.postsService = {
    createPost(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const relatedBlog = yield blogRepository_1.blogRepository.findForOutput(input.blogId);
            if ('error' in relatedBlog) {
                return { error: 'Related blog not found' };
            }
            return yield postRepository_1.postRepository.create(input, relatedBlog.name);
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield postRepository_1.postRepository.findForOutput(id);
        });
    },
    getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield postRepository_1.postRepository.getPosts();
        });
    },
    updatePost(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield postRepository_1.postRepository.update(input, id);
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield postRepository_1.postRepository.delete(id);
        });
    }
};
