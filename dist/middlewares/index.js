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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("@fastify/cors"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const authMiddleware_1 = require("./authMiddleware");
const mainMiddleware = (fastifyInstance) => __awaiter(void 0, void 0, void 0, function* () {
    yield fastifyInstance.register(cors_1.default, {
        credentials: true,
        origin: 'http://localhost:3000',
        methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
    });
    yield fastifyInstance.register(cookie_1.default);
    // oauth middlewares
    yield (0, authMiddleware_1.googleOauthMiddleware)(fastifyInstance);
});
exports.default = mainMiddleware;
