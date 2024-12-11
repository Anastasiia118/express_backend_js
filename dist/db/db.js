"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDB = exports.db = void 0;
exports.db = {
    posts: [],
    blogs: [],
};
// функция для быстрой очистки/заполнения базы данных для тестов
const setDB = (dataset) => {
    if (!dataset) { // если в функцию ничего не передано - то очищаем базу данных
        exports.db.posts = [];
        exports.db.blogs = [];
        return;
    }
    // если что-то передано - то заменяем старые значения новыми
    exports.db.posts = dataset.posts || [];
    exports.db.blogs = dataset.blogs || [];
    // db.some = dataset.some || db.some
};
exports.setDB = setDB;
