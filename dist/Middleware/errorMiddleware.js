"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    //console.log(err.statusCode,err.cause)
    const statusCode = err.statusCode ? err.statusCode : 500;
    res.status(statusCode).json({
        message: err.message,
        stack: err.stack,
        status: statusCode
    });
};
exports.errorHandler = errorHandler;
