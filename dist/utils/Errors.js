"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.ConflictError = exports.ForbiddenError = exports.NotFoundError = exports.UnauthorizedError = exports.BadRequestError = void 0;
//missing parameters, data or headers so the api cannot process the request
//eg no password or no email
class BadRequestError extends Error {
    constructor(message, cause) {
        super(message);
        this.name = "BadRequestError",
            this.statusCode = 400;
        this.cause = cause !== null && cause !== void 0 ? cause : "request";
    }
}
exports.BadRequestError = BadRequestError;
//the client's request lacks valid authentication 
// credentials or the provided credentials are invalid
// eg wrong password 
class UnauthorizedError extends Error {
    constructor(message, cause) {
        super(message);
        this.name = "UnauthorizedError",
            this.statusCode = 401;
        this.cause = cause !== null && cause !== void 0 ? cause : "request";
    }
}
exports.UnauthorizedError = UnauthorizedError;
//403 indicates that even with valid authentication, 
//the client does not have sufficient
// permissions to access the requested resource.
//eg cant delete another users blog post    
class ForbiddenError extends Error {
    constructor(message, cause) {
        super(message);
        this.name = "ForbiddenError",
            this.statusCode = 403;
        this.cause = cause !== null && cause !== void 0 ? cause : "request";
    }
}
exports.ForbiddenError = ForbiddenError;
//It indicates that the server could not find the requested resource. 
class NotFoundError extends Error {
    constructor(message, cause) {
        super(message);
        this.name = "NotFoundError",
            this.statusCode = 404;
        this.cause = cause !== null && cause !== void 0 ? cause : "request";
    }
}
exports.NotFoundError = NotFoundError;
//eg email already in use
class ConflictError extends Error {
    constructor(message, cause) {
        super(message);
        this.name = "ConflictError",
            this.statusCode = 409;
        this.cause = cause !== null && cause !== void 0 ? cause : "request";
    }
}
exports.ConflictError = ConflictError;
class InternalServerError extends Error {
    constructor(message, cause) {
        super(message);
        this.name = "InternalServerError",
            this.statusCode = 500;
        this.cause = cause !== null && cause !== void 0 ? cause : "internal error";
    }
}
exports.InternalServerError = InternalServerError;
