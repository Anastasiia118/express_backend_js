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
exports.usersQwRepository = void 0;
const mongoDb_1 = require("../../db/mongoDb");
const mongodb_1 = require("mongodb");
exports.usersQwRepository = {
    findAllUsers(sortQueryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm, } = sortQueryDto;
            const loginAndEmailFilter = {};
            if (searchLoginTerm || searchEmailTerm) {
                const orConditions = [];
                if (searchLoginTerm) {
                    orConditions.push({
                        login: { $regex: searchLoginTerm, $options: 'i' }
                    });
                }
                if (searchEmailTerm) {
                    orConditions.push({
                        email: { $regex: searchEmailTerm, $options: 'i' }
                    });
                }
                loginAndEmailFilter.$or = orConditions;
            }
            const totalCount = yield mongoDb_1.usersCollection.countDocuments(loginAndEmailFilter);
            const users = yield mongoDb_1.usersCollection.find(loginAndEmailFilter)
                .sort({ [sortBy]: sortDirection })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray();
            return {
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount,
                items: users.map((u) => this._getInView(u)),
            };
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield mongoDb_1.usersCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            return user ? this._getInView(user) : null;
        });
    },
    _getInView(user) {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt.toISOString(),
        };
    },
    _checkObjectId(id) {
        return mongodb_1.ObjectId.isValid(id);
    },
};
