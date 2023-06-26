"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddlewares_1 = require("../../middlewares/authMiddlewares");
const businessUnitControllers_1 = require("../../controllers/configurationControllers/basicConfigurationControllers/businessUnitControllers");
const router = express_1.default.Router();
router.post("/create-business-unit", authMiddlewares_1.is_authorized, businessUnitControllers_1.create_business_unit);
exports.default = router;
