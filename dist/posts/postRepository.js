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
const mongoDb_1 = require("../db/mongoDb");
const mongodb_1 = require("mongodb");
const blogsController_1 = require("../blogs/blogsController");
const getPostViewModel = (post) => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
    };
};
exports.postRepository = {
    create(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const relatedBlog = yield blogsController_1.blogController.findBlog(input.blogId);
            try {
                const newPost = Object.assign(Object.assign({}, input), { createdAt: new Date().toISOString(), blogName: (relatedBlog === null || relatedBlog === void 0 ? void 0 : relatedBlog.name) || 'Unknown' });
                const result = yield mongoDb_1.postsCollection.insertOne(Object.assign({}, newPost));
                const insertedId = result.insertedId.toString();
                const post = Object.assign(Object.assign({}, newPost), { id: insertedId });
                return post;
            }
            catch (e) {
                return { error: e.message };
            }
        });
    },
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield mongoDb_1.postsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            return post ? post : undefined;
        });
    },
    findForOutput(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.find(id);
            if (!post || !mongodb_1.ObjectId.isValid(id)) {
                return { error: 'Post not found' };
            }
            return getPostViewModel(post);
        });
    },
    getPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield mongoDb_1.postsCollection.find().toArray();
            return posts.map(getPostViewModel);
        });
    },
    update(input, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.postsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: input });
            if (result.matchedCount === 0) {
                return { error: 'Post not found' };
            }
            const updatedPost = yield this.find(id);
            return updatedPost ? { id: updatedPost._id.toString() } : { error: 'Post not found' };
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield mongoDb_1.postsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
                if (result.deletedCount === 0) {
                    return { error: 'Post not found' };
                }
            }
            catch (e) {
                return { error: e.message };
            }
            return { id };
        });
    },
};
