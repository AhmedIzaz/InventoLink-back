"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configurationRoutes_1 = __importDefault(require("./configurationRoutes"));
const routes = [...configurationRoutes_1.default];
exports.default = (app) => {
    routes.forEach((item) => app.use(item === null || item === void 0 ? void 0 : item.pathName, item === null || item === void 0 ? void 0 : item.controller));
};
