import { NextFunction, Request, Response } from "express";

export const is_authorized = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authorization) return next();
  return res.status(401).json({ message: "Unauthorized" }).end();
};

export const not_authorized = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) return next();
  return res.status(400).json({ message: "Already authorized!" }).end();
};
