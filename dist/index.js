"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalPrisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
const index_1 = __importDefault(require("./routers/index"));
const client_1 = require("@prisma/client");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerSpecWithOptions_1 = __importDefault(require("./utils/swaggerSpecWithOptions"));
exports.globalPrisma = new client_1.PrismaClient();
app.use(express_1.default.json({ limit: "1mb" }));
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use((0, helmet_1.default)());
app.use(express_1.default.urlencoded({ extended: true, limit: "1mb" }));
app.use("/api", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpecWithOptions_1.default));
(0, index_1.default)(app);
const port = process.env.DEV_SERVER_PORT || 4000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
