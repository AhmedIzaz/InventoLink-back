import express, { NextFunction, Request, Response } from "express";
import { IUser } from "../../../interfaces/configurationInterfaces";
import {
  get_user_permitted_business_unit_menu,
  userLogin,
} from "../../controllers/configurationControllers/userConfigurationController/userController";
import {
  is_authorized,
  not_authorized,
} from "../../middlewares/authMiddlewares";

const router = express.Router();

router.post("/login", not_authorized, userLogin);
router.get(
  "/user-permitted-menu",
  is_authorized,
  get_user_permitted_business_unit_menu
);
export default router;
