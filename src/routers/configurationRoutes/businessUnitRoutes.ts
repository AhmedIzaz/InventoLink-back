import express from "express";
import { is_authorized } from "../../middlewares/authMiddlewares";
import { create_business_unit } from "../../controllers/configurationControllers/basicConfigurationControllers/businessUnitControllers";
const router = express.Router();

router.post("/create-business-unit", is_authorized, create_business_unit);

export default router;
