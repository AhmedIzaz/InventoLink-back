"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const middlewareList = [
    express_1.default.json({ limit: "1mb" }),
    (0, cors_1.default)({
        origin: "*",
    }),
    (0, helmet_1.default)(),
    express_1.default.urlencoded({ extended: true, limit: "1mb" }),
    express_1.default.json({ limit: "1mb" }),
];
exports.default = (app) => {
    middlewareList.forEach((item) => app.use(item));
};
