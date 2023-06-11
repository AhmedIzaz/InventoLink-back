"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../../controllers/configurationControllers/userConfigurationController/userController");
const authMiddlewares_1 = require("../../middlewares/authMiddlewares");
const router = express_1.default.Router();
router.post("/login", authMiddlewares_1.not_authorized, userController_1.user_login);
router.post("/signup", authMiddlewares_1.not_authorized, userController_1.user_signup);
router.get("/user-permitted-menu", 
// is_authorized,
userController_1.get_user_permitted_business_unit_menu);
exports.default = router;
