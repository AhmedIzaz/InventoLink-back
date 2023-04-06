"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "InventoLink API",
            description: "API documentation for InventoLink",
            version: "1.0.0",
        },
    },
    apis: ["./routes/*.ts"],
};
exports.default = (0, swagger_jsdoc_1.default)(swaggerOptions);
