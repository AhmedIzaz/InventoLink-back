"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
const index_1 = __importDefault(require("./routers/index"));
app.use(express_1.default.json({ limit: "20mb" }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.urlencoded({ extended: true, limit: "1mb" }));
(0, index_1.default)(app);
app.listen(4000, () => {
    console.log("server is running on port 5000");
});
