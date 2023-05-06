import express, { Request, Response } from "express";
import { IUser } from "../../../interfaces/configurationInterfaces";
import {
  get_user_permitted_business_unit_menu,
  userLogin,
} from "../../controllers/configurationControllers/userConfigurationController/userController";

const router = express.Router();

router.post("/signup", (req: Request<{}, {}, IUser>, res: Response) => {
  const { id, name, email, password } = req.body;
  res.json({ id, name, email, password }).end();
});
router.post("/login", userLogin);
router.get("/user-permitted-menu", get_user_permitted_business_unit_menu);
export default router;
