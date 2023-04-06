import express, { Request, Response } from "express";
import { IUser } from "../../interfaces/configurationInterfaces";

const router = express.Router();
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
router.post("/signup", (req: Request<{}, {}, IUser>, res: Response) => {
  const { id, name, email, password } = req.body;
  res.json({ id, name, email, password }).end();
});

export default router;
