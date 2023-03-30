import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
const app = express();

app.use(express.json({ limit: "20mb" }));
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.listen(4000, () => {
  console.log("server is running on port 5000");
});
