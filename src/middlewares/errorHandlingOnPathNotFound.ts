import { Express, NextFunction, Request, Response } from "express";
export default (app: Express) => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const error: Error = new Error("Not found");
    next(error);
  });
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: error.message }).end();
  });
};
