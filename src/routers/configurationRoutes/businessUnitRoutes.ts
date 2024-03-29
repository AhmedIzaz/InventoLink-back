import express from "express";
import { is_authorized } from "../../middlewares/authMiddlewares";
import {
  create_business_unit,
  get_business_unit_landing,
  make_activity,
} from "../../controllers/configurationControllers/basicConfigurationControllers/businessUnitControllers";
const router = express.Router();

router.post("/create-business-unit", is_authorized, create_business_unit);
router.get(
  "/get-business-unit-landing",
  is_authorized,
  get_business_unit_landing
);
router.post("/activity", is_authorized, make_activity);
export default router;
