"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.not_authorized = exports.is_authorized = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const is_authorized = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const hasExpired = jsonwebtoken_1.default.verify(req.headers.authorization, process.env.JWT_SECRET_KEY || "secret key", {
                ignoreExpiration: false,
            });
            if (!hasExpired)
                return res.status(401).send({
                    message: "Token expired",
                });
            next();
        }
        return res.status(401).send({ message: "Unauthorized" });
    }
    catch (err) {
        return res.status(401).send({ message: "Unauthorized" });
    }
};
exports.is_authorized = is_authorized;
const not_authorized = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const hasExpired = jsonwebtoken_1.default.verify(req.headers.authorization, process.env.JWT_SECRET_KEY || "secret key", {
                ignoreExpiration: false,
            });
            if (!hasExpired)
                next();
            return res.status(401).send({ message: "Already Looged In" });
        }
        next();
    }
    catch (err) {
        next();
    }
};
exports.not_authorized = not_authorized;
