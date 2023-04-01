import express, { Request } from "express";
import cors from "cors";
import helmet from "helmet";
const app = express();
import mainRoutes from "./routers/index"
import { PrismaClient } from "@prisma/client";
export const globalPrisma = new PrismaClient();
app.use(express.json({ limit: "1mb" }));
app.use(cors({
  origin:"*"
}));
app.use(helmet());
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
mainRoutes(app)

app.listen(4000, () => {
  console.log("server is running on port 4000");
});
