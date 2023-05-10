import express from "express";
import {
  get_user_permitted_business_unit_menu,
  user_login,
  user_signup,
} from "../../controllers/configurationControllers/userConfigurationController/userController";
import {
  is_authorized,
  not_authorized,
} from "../../middlewares/authMiddlewares";

const router = express.Router();

router.post("/login", not_authorized, user_login);
router.post("/signup", not_authorized, user_signup);
router.get(
  "/user-permitted-menu",
  is_authorized,
  get_user_permitted_business_unit_menu
);
export default router;
