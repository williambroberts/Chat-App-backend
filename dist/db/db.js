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
const config_1 = __importDefault(require("./config"));
const db = {
    emailExists: ({ email, table }) => __awaiter(void 0, void 0, void 0, function* () {
        const [result] = yield config_1.default.query(`select * 
            from ${table}
            WHERE email = ?
            `, [email]);
        return result;
    }),
    register: ({ table, email, username, hash }) => __awaiter(void 0, void 0, void 0, function* () {
        const [row] = yield config_1.default.query(`
        insert into ${table} (email,password,username)
        values (?, ?,?)
        `, [email, hash, username]);
        return row;
    }),
    logout: ({ table, email }) => __awaiter(void 0, void 0, void 0, function* () {
        const now = new Date(Date.now());
        const [row] = yield config_1.default.query(`
        update  ${table}
        set last_logout = ?
        where email = ?
        `, [now, email]);
        return row;
    }),
    login: ({ table, email }) => __awaiter(void 0, void 0, void 0, function* () {
        const now = new Date(Date.now());
        const [row] = yield config_1.default.query(`
        update ${table}
        set last_login = ?
        where email = ?
        `, [now, email]);
        return row;
    }),
    invalidateAllResetTokens: ({ table, email }) => __awaiter(void 0, void 0, void 0, function* () {
        const [result] = yield config_1.default.query(`
        update ${table}
        set used = 1
        where email = ?
        `, [email]);
        return result;
    }),
    updateEmailVerificationToken: ({ table, email, hash }) => __awaiter(void 0, void 0, void 0, function* () {
        const [row] = yield config_1.default.query(`
        update ${table}
        set verificationHash = ?
        where email = ?
        `, [hash, email]);
        return row;
    }),
    verifyEmail: ({ table, email }) => __awaiter(void 0, void 0, void 0, function* () {
        const [row] = yield config_1.default.query(`
        update ${table}
        set verified = 1
        where email = ?
        `, [email]);
        return row;
    })
};
// db.register = async ({email,password}:{email:string,password:string})=>{
// }
exports.default = db;
