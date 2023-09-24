import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
export const is_authorized = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.headers.authorization) {
      const hasExpired = jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET_KEY || "secret key",
        {
          ignoreExpiration: false,
        }
      );
      if (!hasExpired)
        return res.status(401).send({
          message: "Token expired",
        });
      next();
    }
    return res.status(401).send({ message: "Unauthorized" });
  } catch (err) {
    return res.status(401).send({ message: "Unauthorized" });
  }
};

export const not_authorized = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.headers.authorization) {
      const hasExpired = jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET_KEY || "secret key",
        {
          ignoreExpiration: false,
        }
      );
      if (!hasExpired) next();
      return res.status(401).send({ message: "Already Looged In" });
    }
    next();
  } catch (err) {
    next();
  }
};
