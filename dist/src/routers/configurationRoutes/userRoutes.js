"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../../controllers/configurationControllers/userController");
const router = express_1.default.Router();
router.post("/signup", (req, res) => {
    const { id, name, email, password } = req.body;
    res.json({ id, name, email, password }).end();
});
router.post("/login", userController_1.userLogin);
router.get("/user-permitted-menu", userController_1.get_user_permitted_business_unit_menu);
exports.default = router;
