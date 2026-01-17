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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRepository = void 0;
const post_types_1 = require("../../types/post_types");
const mongoDb_1 = require("../../db/mongoDb");
const mongodb_1 = require("mongodb");
exports.postRepository = {
    create(input, blogName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newPost = Object.assign(Object.assign({}, input), { createdAt: new Date().toISOString(), blogName });
                const result = yield mongoDb_1.postsCollection.insertOne(Object.assign({}, newPost));
                const insertedId = result.insertedId.toString();
                const { _id } = newPost, postWithoutId = __rest(newPost, ["_id"]);
                const post = Object.assign(Object.assign({}, postWithoutId), { id: insertedId });
                return post;
            }
            catch (e) {
                return { error: e.message };
            }
        });
    },
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongodb_1.ObjectId.isValid(id)) {
                return undefined;
            }
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
            return (0, post_types_1.getPostViewModel)(post);
        });
    },
    getPosts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection, } = query;
            const skip = (pageNumber - 1) * pageSize;
            const filter = {};
            const posts = yield mongoDb_1.postsCollection
                .find(filter)
                .skip(skip)
                .limit(pageSize)
                .sort({ [sortBy]: sortDirection })
                .toArray();
            const totalCount = yield mongoDb_1.postsCollection.countDocuments(filter);
            return {
                posts: posts.map(post => (0, post_types_1.getPostViewModel)(post)),
                totalCount
            };
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
