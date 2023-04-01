"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes = [];
exports.default = (app) => {
    routes.forEach((item) => app.use(item === null || item === void 0 ? void 0 : item.pathName, item === null || item === void 0 ? void 0 : item.controller));
};
