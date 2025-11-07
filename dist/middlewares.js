"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationMiddleware = exports.inputCheckErrorsMiddleware = exports.blogIdValidation = void 0;
exports.paginationAndSortingValidation = paginationAndSortingValidation;
const express_validator_1 = require("express-validator");
const blogRepository_1 = require("./blogs/blogRepository");
const settings_1 = require("./settings");
const common_types_1 = require("./types/common_types");
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = common_types_1.SortDirection.DESC;
function paginationAndSortingValidation(sortFieldsEnum) {
    return [
        (0, express_validator_1.query)('pageNumber')
            .optional()
            .default(DEFAULT_PAGE)
            .isInt({ min: 1 })
            .withMessage('Page number must be a positive integer')
            .toInt(),
        (0, express_validator_1.query)('pageSize')
            .optional()
            .default(DEFAULT_PAGE_SIZE)
            .isInt({ min: 1, max: 100 })
            .withMessage('Page size must be between 1 and 100')
            .toInt(),
        (0, express_validator_1.query)('sortBy')
            .optional()
            .default(Object.values(sortFieldsEnum)[0]) // Дефолтное значение - первое поле
            .isIn(Object.values(sortFieldsEnum))
            .withMessage(`Allowed sort fields: ${Object.values(sortFieldsEnum).join(', ')}`),
        (0, express_validator_1.query)('sortDirection')
            .optional()
            .default(DEFAULT_SORT_DIRECTION)
            .isIn(Object.values(common_types_1.SortDirection))
            .withMessage(`Sort direction must be one of: ${Object.values(common_types_1.SortDirection).join(', ')}`),
    ];
}
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
        var _a, _b;
        const field = (_b = (_a = err.param) !== null && _a !== void 0 ? _a : err.path) !== null && _b !== void 0 ? _b : '';
        return {
            field,
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
