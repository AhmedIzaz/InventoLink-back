import express from "express";
import { not_authorized } from "../../middlewares/authMiddlewares";
import { get_all_currencies_ddl } from "../../controllers/configurationControllers/basicConfigurationControllers/currencyControllers";

const router = express.Router();
router.get("/get-all-currencies-ddl", not_authorized, get_all_currencies_ddl);
export default router;
