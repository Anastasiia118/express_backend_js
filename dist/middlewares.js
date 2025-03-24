"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationMiddleware = exports.inputCheckErrorsMiddleware = exports.blogIdValidation = void 0;
const express_validator_1 = require("express-validator");
const blogRepository_1 = require("./blogs/blogRepository");
const settings_1 = require("./settings");
exports.blogIdValidation = [
    (0, express_validator_1.body)('blogId').custom((blogId) => {
        const blog = blogRepository_1.blogRepository.find(blogId);
        if (!blog) {
            new Error('no blog!');
            return false;
        }
        return true;
    }),
];
const inputCheckErrorsMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    console.log('inputCheckErrorsMiddleware errors: ', errors);
    if (errors.isEmpty()) {
        next();
        return;
    }
    const formattedErrors = errors.array({ onlyFirstError: true })
        .map(err => {
        return {
            field: err.path,
            message: err.msg
        };
    });
    res.status(400).json({ errorsMessages: formattedErrors });
    return;
};
exports.inputCheckErrorsMiddleware = inputCheckErrorsMiddleware;
const authorizationMiddleware = (req, res, next) => {
    const auth = req.headers.authorization;
    const data = `${settings_1.SETTINGS.AUTHORIZATION}`;
    const buff = Buffer.from(data).toString('base64');
    const validAuthValue = `Basic ${buff}`;
    if (auth && auth === validAuthValue) {
        next();
    }
    else {
        res.sendStatus(401);
    }
};
exports.authorizationMiddleware = authorizationMiddleware;
