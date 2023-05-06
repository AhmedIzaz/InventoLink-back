import express, { NextFunction, Request, Response } from "express";
const app = express();
import mainRoutes from "./routers/index";
import { PrismaClient } from "@prisma/client";
import middlewares from "./middlewares";
export const globalPrisma = new PrismaClient();

middlewares(app);
mainRoutes(app);
app.use((req: Request, res: Response, next: NextFunction) => {
  const error: Error = new Error("Not found");
  next(error);
});
app.use((error: Error, req: Request, res: Response, next:NextFunction) => {
  res.status(404).json({ message: error.message }).end();
});
const port = process.env.DEV_SERVER_PORT || 4000;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
