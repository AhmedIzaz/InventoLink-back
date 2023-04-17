import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
const app = express();
import mainRoutes from "./routers/index";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import bcrypt from "bcrypt";
import swaggerSpecWithOptions from "../utils/swaggerSpecWithOptions";
import { hashPassword } from "../utils/encryptionOrHashing";
export const globalPrisma = new PrismaClient();
app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin: "*",
  })
);

app.use(helmet());
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.json({ limit: "1mb" }));
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerSpecWithOptions));
mainRoutes(app);
app.get("/here", async (req: Request, res: Response) => {
  res.send("here").end();
});
app.post("/demoUser", async (req: Request, res: Response) => {
  console.log("here");
  const { password } = req.body;
  const { hashedPassword } = await hashPassword(password);
  res.send(hashedPassword || "error");
});
const port = process.env.DEV_SERVER_PORT || 4000;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
