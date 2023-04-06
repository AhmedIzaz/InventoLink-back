import express from "express";
import cors from "cors";
import helmet from "helmet";
const app = express();
import mainRoutes from "./routers/index";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import swaggerSpecWithOptions from "./utils/swaggerSpecWithOptions";
export const globalPrisma = new PrismaClient();
app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin: "*",
  })
);
app.use(helmet());
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerSpecWithOptions));
mainRoutes(app);

const port = process.env.DEV_SERVER_PORT || 4000;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
