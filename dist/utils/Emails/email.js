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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = exports.sendPasswordResetEmail = void 0;
const nodemailer_1 = require("nodemailer");
const ResetPassword_1 = require("./Templates/Email/ResetPassword/ResetPassword");
const VerfiyEmail_1 = require("./Templates/Email/VerifyEmail/VerfiyEmail");
const transporter = (0, nodemailer_1.createTransport)({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: "williambrobertsemail@gmail.com",
        pass: "XfFHsYyICBURAhzN"
    }
});
//makes your email nice and full of css
function sendPasswordResetEmail(toEmail, resetToken) {
    return __awaiter(this, void 0, void 0, function* () {
        yield transporter.sendMail({
            from: "williambrobertsemail@gmail.com",
            to: toEmail,
            subject: "Reset your password",
            html: (0, ResetPassword_1.ResetPasswordTemplate)({ toEmail, resetToken })
        });
    });
}
exports.sendPasswordResetEmail = sendPasswordResetEmail;
function sendVerificationEmail({ toEmail, verifcationToken }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield transporter.sendMail({
            from: "williambrobertsemail@gmail.com",
            to: toEmail,
            subject: "Verify your email",
            html: (0, VerfiyEmail_1.VerifyEmailTemplate)({ toEmail, verifcationToken })
        });
    });
}
exports.sendVerificationEmail = sendVerificationEmail;
