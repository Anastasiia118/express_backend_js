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
            const newBlog = Object.assign(Object.assign({}, input), { createdAt, isMembership: true });
            const result = yield mongoDb_1.blogsCollection.insertOne(newBlog);
            const insertedId = result.insertedId.toString();
            return Object.assign(Object.assign({}, newBlog), { id: insertedId });
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
            return blogs.map(blog => (Object.assign(Object.assign({}, blog), { id: blog._id.toString() })));
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
