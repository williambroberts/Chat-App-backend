"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordController = exports.deleteAccountController = exports.updateProfileController = exports.resetPasswordController = exports.forgotPasswordController = exports.statusController = exports.logoutController = exports.loginController = exports.registerController = exports.generateVerificationTokenController = exports.failController = exports.VerifyEmailController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Errors_1 = require("../utils/Errors");
const config_1 = require("../db/config");
const crypto_1 = __importDefault(require("crypto"));
const email_1 = require("../utils/Emails/email");
const hashPassword_1 = require("../utils/Bycrypt/hashPassword");
const ComparePasswords_1 = require("../utils/Bycrypt/ComparePasswords");
const db_1 = __importDefault(require("../db/db"));
//email,verfiyToken,used,createdAt,expriredAt
exports.VerifyEmailController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //link
    const { email, token: verificationToken } = req.matchedData;
    if (!email) {
        throw new Errors_1.BadRequestError("Email required");
    }
    if (!verificationToken) {
        throw new Errors_1.BadRequestError("Verification token required");
    }
    //todo check token format
    if (verificationToken.length !== 36) {
        throw new Errors_1.BadRequestError("Invalid token");
    }
    const [row] = yield db_1.default.emailExists({ table: config_1.tables.users, email: email });
    console.log({ row });
    if (!row) {
        throw new Errors_1.BadRequestError("Invalid email");
    }
    const match = (0, ComparePasswords_1.comparePassword)({ raw: verificationToken, hash: row.verificationHash });
    if (match) {
        //verfiy email
        const row = yield db_1.default.verifyEmail({ table: config_1.tables.users, email: email });
        console.log(row, "here will🕊️");
        if (row) {
            res.status(200);
            res.json({
                success: true,
                row: row,
                email: email
            });
        }
        else {
            throw new Errors_1.InternalServerError("Failed to verify email");
        }
    }
    else {
        //todo hide the response if bad
        // res.status(200)
        // res.json({
        //     success:true,
        //     token:verificationToken,
        //     email:email
        // })
        throw new Errors_1.BadRequestError("Invalid token");
    }
    //todo check token vs database if email and unverified and token
}));
exports.failController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    throw new Errors_1.UnauthorizedError("Failed to authenticate");
}));
//todo this controller make a new email verification token and hash it and save it to database
exports.generateVerificationTokenController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.matchedData;
    if (!email) {
        throw new Errors_1.BadRequestError("Email required");
    }
    const result = yield db_1.default.emailExists({ table: config_1.tables.users, email: email });
    console.log({ result });
    if (result.length === 0) {
        //no email in db but dont tell the request that
        res.status(200);
        res.json({ success: true,
        });
        return;
    }
    //todo if verified already
    const [user] = result;
    if (user.verified === 1) {
        throw new Errors_1.BadRequestError("Email is already verified");
    }
    const verificationToken = crypto_1.default.randomUUID();
    const hash = (0, hashPassword_1.hashPassword)(verificationToken);
    const row = yield db_1.default.updateEmailVerificationToken({ table: config_1.tables.users, email: email, hash: hash });
    yield (0, email_1.sendVerificationEmail)({ toEmail: email, verifcationToken: verificationToken });
    res.json({
        row, success: true
    });
    //generate a token for an email, and save to db and send email if not yet confirmed
}));
exports.registerController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username } = req.matchedData;
    if (!email) {
        throw new Errors_1.BadRequestError("Email required");
    }
    if (!password) {
        throw new Errors_1.BadRequestError("Password required");
    }
    if (!username) {
        throw new Errors_1.BadRequestError("Username required");
    }
    //query db for email
    // const [result] = await pool.query(`
    // SELECT DISTINCT * FROM ${table}
    // WHERE email = ?
    // LIMIT 1;
    // `,[email])
    const result = yield db_1.default.emailExists({ email: email, table: config_1.tables.users });
    if (result.length !== 0) {
        throw new Errors_1.ConflictError("Email in use already");
    }
    const hash = (0, hashPassword_1.hashPassword)(password);
    //save to db
    if (hash) {
        // const [row] =await pool.query(`
        // insert into store_users (email,password)
        // values (?, ?)
        // `,[email,hash])
        const row = yield db_1.default.register({ table: config_1.tables.users, email: email, hash: hash, username: username });
        console.log({ row });
        if (row) {
            //todo generate and send verification email
            const verificationToken = crypto_1.default.randomUUID();
            const hash = (0, hashPassword_1.hashPassword)(verificationToken);
            const row = yield db_1.default.updateEmailVerificationToken({ table: config_1.tables.users, email: email, hash: hash });
            yield (0, email_1.sendVerificationEmail)({ toEmail: email, verifcationToken: verificationToken });
            res.status(201);
            res.json({ success: true, row: row });
        }
        else {
            throw new Errors_1.InternalServerError("Failed to create user in DB");
        }
    }
    else {
        throw new Errors_1.InternalServerError("Failed to hash password");
    }
}));
exports.loginController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200);
    res.json({
        success: true
    });
}));
exports.logoutController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prev = req.isAuthenticated();
    let user = req.user;
    let now = new Date(Date.now());
    user[0].last_logout = now;
    const email = user[0].email;
    req.logout((err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error(err);
            throw new Errors_1.InternalServerError("logout failed");
        }
        //update user table last_logout
        const row = yield db_1.default.logout({ email: email, table: config_1.tables.users });
        res.status(200);
        //db.logout({table:tables.users,email:email})
        res.json({ success: true, curr: req.isAuthenticated(), prev: prev, row: row });
        // 1.clear session cookie, 2.destroy session delete 3.session from db
    }));
}));
exports.statusController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req === null || req === void 0 ? void 0 : req.user, req.session.passport, "here will💛", req.isAuthenticated());
    res.status(200);
    res.json({
        success: true, isAuth: req.isAuthenticated()
    });
}));
exports.forgotPasswordController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.matchedData;
    if (!email) {
        throw new Errors_1.BadRequestError("Email required");
    }
    // invalidate all previous tokens for this email address
    // const [result]= await pool.query(`
    // update resetPasswordTokens
    // set used = 1
    // where email = ?
    // `,[email])
    const result = yield db_1.default.invalidateAllResetTokens({ table: config_1.tables.resetPasswordTokens, email: email });
    //see if there is a valid user here
    // const [row]=await pool.query(`
    // select distinct * from store_users
    // where email = ?
    // `,[email])
    if (!result) {
        throw new Errors_1.InternalServerError("Failed to invalidate all previous user tokens");
    }
    const row = yield db_1.default.emailExists({ table: config_1.tables.users, email: email });
    console.log(row, "💛👏🏻❤️");
    if (row.length === 0) {
        //no email in db
        res.status(200);
        res.json({
            success: true, row, result
        });
    }
    else {
        //genereate reset token
        const resetToken = crypto_1.default.randomUUID();
        const hash = (0, hashPassword_1.hashPassword)(resetToken);
        //save hash to database as the token and make row entry
        const createdAt = new Date(Date.now());
        const expiresAt = new Date(Date.now() + 60 * 5 * 1000); //5mins
        const insertResult = yield db_1.default.insertNewResetToken({ hash, email, createdAt, expiresAt, table: config_1.tables.resetPasswordTokens });
        // send email with resetToken in link
        yield (0, email_1.sendPasswordResetEmail)(email, resetToken);
        const origin = req.get('origin');
        console.log(insertResult, origin, req.origin, req.originalUrl);
        res.status(200);
        res.json({
            resetToken: resetToken, email: email, result, row, insertResult
        });
    }
}));
exports.resetPasswordController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword, token: resetToken, email } = req.matchedData;
    if (!resetToken) {
        throw new Errors_1.BadRequestError("Reset Token required");
    }
    if (!newPassword) {
        throw new Errors_1.BadRequestError("New password required");
    }
    if (!email) {
        throw new Errors_1.BadRequestError("Email required");
    }
    const now = new Date(Date.now());
    //db has row with token and email and time before expired and unused token
    // const [result]=await pool.query(`
    // select distinct * from resetPasswordTokens
    // where email = ?
    // and used = 0
    // and expiresAt > ?
    // `,[email,now])
    const result = yield db_1.default.getPasswordResetTokenFromDb({ email, now, table: config_1.tables.resetPasswordTokens });
    if (result.length === 0) {
        // no db entry , either invalid email or resetToken or its too late or token is set to used already
        throw new Errors_1.BadRequestError("Invalid request");
    }
    const [row] = result;
    const { hash } = row;
    const tokens = { raw: resetToken, hash: hash };
    const match = (0, ComparePasswords_1.comparePassword)(tokens);
    if (match) {
        //todo update user password in db hash and save and return success & set used to true
        const newHash = (0, hashPassword_1.hashPassword)(newPassword);
        // const [updatePwResult]=await pool.query(`
        // update store_users
        // set password = ?
        // where email = ?
        // `,[newHash,email])
        const updatePwResult = yield db_1.default.updateUserPassword({ hash: newHash, table: config_1.tables.users, email: email });
        const row = yield db_1.default.invalidateUsedPwResetToken({ hash: hash, table: config_1.tables.resetPasswordTokens });
        console.log(updatePwResult, row);
        if (true) {
            //todo change here, redirect to login
            res.status(200);
            res.json({
                success: true, updatePwResult, row
            });
        }
    }
    else {
        // invalid token
        throw new Errors_1.BadRequestError("Invalid request");
    }
}));
exports.updateProfileController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, about } = req.matchedData;
    // if username && description 
    console.log(req.originalUrl);
    if (username && about) {
    }
    res.json({ username });
}));
exports.deleteAccountController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, email } = req.matchedData;
    if (!email) {
        throw new Errors_1.BadRequestError("Invalid email");
    }
    if (!password) {
        throw new Errors_1.BadRequestError("Password required");
    }
}));
exports.changePasswordController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, newPassword } = req.matchedData;
    res.status(200);
    res.json({ success: true });
}));
