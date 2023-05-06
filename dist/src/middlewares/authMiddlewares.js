"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.not_authorized = exports.is_authorized = void 0;
const is_authorized = (req, res, next) => {
    if (req.headers.authorization)
        return next();
    return res.status(401).json({ message: "Unauthorized" }).end();
};
exports.is_authorized = is_authorized;
const not_authorized = (req, res, next) => {
    if (!req.headers.authorization)
        return next();
    return res.status(401).json({ message: "Unauthorized" }).end();
};
exports.not_authorized = not_authorized;
