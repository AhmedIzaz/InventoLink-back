"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
/**
 * @swagger
 * /users:
 *   post:
 *     summary: create user.
 *     description: creating user with id, name, email, password.
 *     responses:
 *       200:
 *         description: user signup successfully.
 */
router.post("/signup", (req, res) => {
    const { id, name, email, password } = req.body;
    res.json({ id, name, email, password }).end();
});
exports.default = router;
