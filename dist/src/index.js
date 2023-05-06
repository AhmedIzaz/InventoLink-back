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
const errorHandlingOnPathNotFound_1 = __importDefault(require("./middlewares/errorHandlingOnPathNotFound"));
exports.globalPrisma = new client_1.PrismaClient();
(0, middlewares_1.default)(app);
(0, index_1.default)(app);
(0, errorHandlingOnPathNotFound_1.default)(app);
const port = process.env.DEV_SERVER_PORT || 4000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
