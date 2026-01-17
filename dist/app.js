"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const settings_1 = require("./settings");
const postsController_1 = require("./posts/application/postsController");
const blogsController_1 = require("./blogs/application/blogsController");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)());
exports.app.get('/', (req, res) => {
    res.status(200).json({ version: '1.0' });
});
exports.app.use(settings_1.SETTINGS.PATH.POSTS, postsController_1.postsRouter);
exports.app.use(settings_1.SETTINGS.PATH.BLOGS, blogsController_1.blogsRouter);
exports.app.delete(settings_1.SETTINGS.PATH.TESTING, postsController_1.postController.deleteAllDB);
