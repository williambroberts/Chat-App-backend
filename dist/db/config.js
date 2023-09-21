"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tables = exports.dbOptions = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//todo config the options to the pool with connection number
exports.dbOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};
if (!process.env.DATABASE_URL) {
    throw new Error("missing db env variable");
}
const pool = mysql2_1.default.createPool(process.env.DATABASE_URL).promise();
exports.default = pool;
const tables = {
    users: "chat_users",
    messages: "chat_messages",
    chats: "chats",
    resetPasswordTokens: "chat_resetPasswordTokens"
};
exports.tables = tables;
