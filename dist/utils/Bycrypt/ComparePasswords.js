"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const comparePassword = (passwords) => {
    return bcryptjs_1.default.compareSync(passwords.raw, passwords.hash);
};
exports.comparePassword = comparePassword;
