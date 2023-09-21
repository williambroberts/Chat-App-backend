"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const local = __importStar(require("passport-local"));
const config_1 = require("../db/config");
const Validators_1 = require("../utils/Validators");
const authMiddleware_1 = require("../Middleware/authMiddleware");
const authController_1 = require("../Controllers/authController");
const db_1 = __importDefault(require("../db/db"));
const ComparePasswords_1 = require("../utils/Bycrypt/ComparePasswords");
const LocalStrategy = local.Strategy;
passport_1.default.serializeUser(function (user, done) {
    console.log("serializing user", user);
    done(null, user.email);
});
passport_1.default.deserializeUser(function (id, done) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(id, "desierialze");
        //this runs on each request if a user is authenticated
        try {
            // const [user] = await pool.query(`
            // select * from users
            // WHERE email = ?
            // `,[id]);
            const user = yield db_1.default.emailExists({ email: id, table: config_1.tables.users });
            console.log(user, id, "deserializing user");
            done(null, user);
        }
        catch (err) {
            done(err);
        }
        ;
    });
});
passport_1.default.use(new LocalStrategy({ usernameField: 'email' }, localVerifyFunctionasync));
function localVerifyFunctionasync(email, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(email, password, "❤️");
        //sanitize and validate first
        try {
            // const [row] = await pool.query(
            //   `select * 
            //   from store_users
            //   WHERE email = ? 
            //   `
            //   ,[email])
            //   const user = row[0]
            const result = yield db_1.default.emailExists({ email: email, table: config_1.tables.users });
            //console.log(user)
            const user = result[0];
            if (!user) {
                return done(null, false, { message: "Incorrect email" });
            }
            ;
            const passwords = { raw: password, hash: user.password };
            const match = (0, ComparePasswords_1.comparePassword)(passwords);
            if (password && !match) {
                return done(null, false, { message: "Incorrect password" });
            }
            ;
            //todo add an additional cookie here
            const row = yield db_1.default.login({ email: email, table: config_1.tables.users });
            return done(null, user);
        }
        catch (err) {
            return done(err);
        }
        ;
    });
}
const authRouter = express_1.default.Router();
authRouter.get("/fail", authController_1.failController);
authRouter.post("/register", Validators_1.registerVS, Validators_1.valitatorVS, authController_1.registerController);
//protected post /auth/logout
authRouter.post("/logout", authMiddleware_1.passportIsAuth, authController_1.logoutController);
authRouter.get("/status", authController_1.statusController);
authRouter.post("/login", Validators_1.loginVS, Validators_1.valitatorVS, passport_1.default.authenticate('local', { failureRedirect: '/auth/fail',
    failureMessage: true }), authController_1.loginController);
authRouter.post("/forgot", Validators_1.forgotPasswordVS, Validators_1.valitatorVS, authController_1.forgotPasswordController);
authRouter.post("/reset", Validators_1.resetPasswordVS, Validators_1.valitatorVS, authController_1.resetPasswordController);
//protected /auth/confirm verify email
authRouter.post("/verify", authMiddleware_1.passportIsAuth, Validators_1.verifyEmailVS, Validators_1.valitatorVS, authController_1.VerifyEmailController);
//protected generate email verification token
authRouter.post("/generate", authMiddleware_1.passportIsAuth, Validators_1.generateVs, Validators_1.valitatorVS, authController_1.generateVerificationTokenController);
//protected /auth/delete post
authRouter.post("/delete", authMiddleware_1.passportIsAuth, Validators_1.loginVS, authController_1.deleteAccountController);
authRouter.put("/changePassword", authMiddleware_1.passportIsAuth, Validators_1.changePasswordVs, Validators_1.valitatorVS, authController_1.changePasswordController);
authRouter.put("/update", authMiddleware_1.passportIsAuth, Validators_1.updateProfileVs, Validators_1.valitatorVS, authController_1.updateProfileController);
exports.default = authRouter;
