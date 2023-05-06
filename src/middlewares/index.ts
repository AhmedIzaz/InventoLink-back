import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";

const middlewareList: any[] = [
  express.json({ limit: "1mb" }),
  cors({
    origin: "*",
  }),
  helmet(),
  express.urlencoded({ extended: true, limit: "1mb" }),
  express.json({ limit: "1mb" }),
];

export default (app: Express) => {
  middlewareList.forEach((item) => app.use(item));
};
