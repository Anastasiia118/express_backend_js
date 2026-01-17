"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.usersCollection = exports.postsCollection = exports.blogsCollection = void 0;
exports.runDb = runDb;
const mongodb_1 = require("mongodb");
const settings_1 = require("../settings");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
function runDb(url) {
    return __awaiter(this, void 0, void 0, function* () {
        let client = new mongodb_1.MongoClient(url);
        let db = client.db(settings_1.SETTINGS.DB_NAME);
        exports.blogsCollection = db.collection(settings_1.SETTINGS.PATH.BLOGS);
        exports.postsCollection = db.collection(settings_1.SETTINGS.PATH.POSTS);
        exports.usersCollection = db.collection(settings_1.SETTINGS.PATH.USERS);
        try {
            yield client.connect();
            yield db.command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
            return client;
        }
        catch (e) {
            console.error(e);
            yield client.close();
            return false;
        }
    });
}
// export async function deleteDuplicates(url: string): Promise<void> {
//     let client = new MongoClient(url);
//     let db = client.db(SETTINGS.DB_NAME);
//     blogsCollection = db.collection<BlogDBType>(SETTINGS.PATH.BLOGS);
//     postsCollection = db.collection<PostDBType>(SETTINGS.PATH.POSTS);
//     try {
//         await client.connect();
//         // Delete duplicate blogs
//         const deleteBlogsResult = await blogsCollection.deleteMany({
//             name: 'Blog 1',
//             description: 'Description 1',
//             websiteUrl: 'http://blog1.com'
//         });
//         console.log(`Deleted ${deleteBlogsResult.deletedCount} duplicate blogs.`);
//         // Delete duplicate posts
//         const deletePostsResult = await postsCollection.deleteMany({
//             title: 'Post 1',
//             shortDescription: 'Short description 1',
//             content: 'Content 1',
//             blogId: '1',
//         });
//         console.log(`Deleted ${deletePostsResult.deletedCount} duplicate posts.`);
//     } finally {
//         await client.close();
//     }
// }
