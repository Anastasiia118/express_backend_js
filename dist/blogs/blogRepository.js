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
exports.blogRepository = void 0;
const mongoDb_1 = require("../db/mongoDb");
const mongodb_1 = require("mongodb");
const getBlogViewModel = (blog) => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
    };
};
exports.blogRepository = {
    create(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdAt = new Date().toISOString();
            const newBlog = Object.assign(Object.assign({}, input), { createdAt, isMembership: false });
            const result = yield mongoDb_1.blogsCollection.insertOne(newBlog);
            const insertedId = result.insertedId.toString();
            const { _id } = newBlog, blogWithoutId = __rest(newBlog, ["_id"]);
            return Object.assign(Object.assign({}, blogWithoutId), { id: insertedId });
        });
    },
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield mongoDb_1.blogsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            return blog ? blog : undefined;
        });
    },
    findForOutput(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.find(id);
            if (!blog || !mongodb_1.ObjectId.isValid(id)) {
                return { error: 'Blog not found' };
            }
            return getBlogViewModel(blog);
        });
    },
    getBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield mongoDb_1.blogsCollection.find().toArray();
            return blogs.map(blog => {
                const { _id } = blog, blogWithoutId = __rest(blog, ["_id"]);
                return Object.assign(Object.assign({}, blogWithoutId), { id: blog._id.toString() });
            });
        });
    },
    update(input, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.blogsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: input });
            if (result.matchedCount === 0) {
                return { error: 'Blog not found' };
            }
            const updatedBlog = yield this.find(id);
            return updatedBlog ? { id: updatedBlog._id.toString() } : { error: 'Blog not found' };
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield mongoDb_1.blogsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
                if (result.deletedCount === 0) {
                    return { error: 'Blog not found' };
                }
            }
            catch (e) {
                return { error: e.message };
            }
            return { id };
        });
    },
};
