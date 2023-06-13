"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddlewares_1 = require("../../middlewares/authMiddlewares");
const currencyControllers_1 = require("../../controllers/configurationControllers/basicConfigurationControllers/currencyControllers");
const router = express_1.default.Router();
router.get("/get-all-currencies-ddl", authMiddlewares_1.not_authorized, currencyControllers_1.get_all_currencies_ddl);
exports.default = router;
