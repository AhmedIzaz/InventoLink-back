import express from "express";
import { createCategory } from "../../controllers/configurationControllers/categoryController";

const router = express.Router();

router.post("/createCategory", createCategory);
export default router;
