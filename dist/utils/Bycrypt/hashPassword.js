"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hashPassword = (raw) => {
    const salt = bcryptjs_1.default.genSaltSync(12);
    const hash = bcryptjs_1.default.hashSync(raw, salt);
    return hash;
};
exports.hashPassword = hashPassword;
