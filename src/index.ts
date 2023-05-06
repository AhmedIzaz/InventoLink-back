import express, { NextFunction, Request, Response } from "express";
const app = express();
import mainRoutes from "./routers/index";
import { PrismaClient } from "@prisma/client";
import middlewares from "./middlewares";
import errorHandlingOnPathNotFound from "./middlewares/errorHandlingOnPathNotFound";
export const globalPrisma = new PrismaClient();

middlewares(app);
mainRoutes(app);
errorHandlingOnPathNotFound(app);

const port = process.env.DEV_SERVER_PORT || 4000;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
