"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAuthCookie = void 0;
const Errors_1 = require("../Errors");
const generateAuthCookie = (res, sessionToken) => {
    if (!sessionToken) {
        throw new Errors_1.InternalServerError("Missing session id");
    }
    const now = new Date().getTime();
    let extra = now + (60 * 60 * 1000);
    const expiresAt = new Date(extra); //1 hour
    console.log(expiresAt, now);
    let authCookie = "";
    if (process.env.AUTH_COOKIE) {
        authCookie = process.env.AUTH_COOKIE;
        res.cookie(authCookie, sessionToken, {
            sameSite: "none",
            secure: true,
            httpOnly: true,
        });
    }
    else {
        throw new Errors_1.InternalServerError("Cannot access auth cookie name");
    }
};
exports.generateAuthCookie = generateAuthCookie;
