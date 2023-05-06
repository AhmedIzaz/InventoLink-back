"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.use((req, res, next) => {
        const error = new Error("Not found");
        next(error);
    });
    app.use((error, req, res, next) => {
        res.status(404).json({ message: error.message }).end();
    });
};
