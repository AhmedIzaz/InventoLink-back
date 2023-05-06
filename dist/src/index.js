"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalPrisma = void 0;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const index_1 = __importDefault(require("./routers/index"));
const client_1 = require("@prisma/client");
const middlewares_1 = __importDefault(require("./middlewares"));
exports.globalPrisma = new client_1.PrismaClient();
(0, middlewares_1.default)(app);
(0, index_1.default)(app);
app.use((req, res, next) => {
    const error = new Error("Not found");
    next(error);
});
app.use((error, req, res, next) => {
    res.status(404).json({ message: error.message }).end();
});
const port = process.env.DEV_SERVER_PORT || 4000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
