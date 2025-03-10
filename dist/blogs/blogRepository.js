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
exports.blogRepository = {
    create(newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.blogsCollection.insertOne(newBlog);
            return Object.assign(Object.assign({}, newBlog), { id: result.insertedId.toString() });
        });
    },
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield mongoDb_1.blogsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            return blog ? Object.assign(Object.assign({}, blog), { id: blog._id.toString() }) : undefined;
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
            const blogs = yield mongoDb_1.blogsCollection.find().toArray();
            return blogs.map(blog => (Object.assign(Object.assign({}, blog), { id: blog._id.toString() })));
        });
    },
    // async update(input: Partial<BlogDBType>, id: String): Promise<{ error?: string; id?: string; }> {
    //   const blog = db.blogs.find(b => b.id === id)
    //   if (!blog) {
    //     return { error: 'Blog not found' }
    //   }
    //   const updatedBlog = {
    //     ...blog,
    //     ...input
    //   }
    //   try {
    //     db.blogs = db.blogs.map(b => b.id === id ? updatedBlog : b)
    //   } catch (e: any) {
    //     // log
    //     return { error: e.message }
    //   }
    //   return blog;
    // },
    update(input, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.blogsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: input });
            if (result.matchedCount === 0) {
                return { error: 'Blog not found' };
            }
            const updatedBlog = yield this.find(id);
            return updatedBlog ? { id: updatedBlog.id } : { error: 'Blog not found' };
        });
    },
    // async delete(id: string): Promise<{ error?: string, id?: string }> {
    //   const blog = db.blogs.find(b => b.id === id)
    //   if (!blog) {
    //     return { error: 'Blog not found' }
    //   }
    //   try {
    //     db.blogs = db.blogs.filter(b => b.id !== id)
    //   } catch (e: any) {
    //     // log
    //     return { error: e.message }
    //   }
    //   return blog;
    // },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.blogsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            if (result.deletedCount === 0) {
                return { error: 'Blog not found' };
            }
            return { id };
        });
    },
    // async mapToOutput(blog: BlogDBType): Promise<BlogOutputType> {
    //   return {
    //     id: blog.id,
    //     name: blog.name,
    //   }
    // }
};
