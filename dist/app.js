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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const express_mysql_session_1 = __importDefault(require("express-mysql-session"));
const config_1 = __importStar(require("./db/config"));
const SESSION = express_session_1.default;
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const errorMiddleware_1 = require("./Middleware/errorMiddleware");
const authRouter_1 = __importDefault(require("./Routers/authRouter"));
const passport_1 = __importDefault(require("passport"));
function createApp() {
    const app = (0, express_1.default)();
    const MySQLStore = (0, express_mysql_session_1.default)(SESSION);
    const sessionStore = new MySQLStore(config_1.dbOptions, config_1.default);
    let NODE_ENV = "development";
    if (process.env.NODE_ENV) {
        NODE_ENV = process.env.NODE_ENV;
    }
    let SESSION_NAME = "382734";
    let SESSION_SECRET = "wiejijea";
    if (process.env.SESSION_NAME) {
        SESSION_NAME = process.env.SESSION_NAME;
    }
    app.set('trust proxy', 1);
    app.use((0, express_session_1.default)({
        name: SESSION_NAME,
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            secure: false,
            sameSite: 'none'
        }
    }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: ['http://localhost:3000', 'https://chat-app-frontend-olive.vercel.app'],
        credentials: true
    }));
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    const limiter = (0, express_rate_limit_1.default)({
        limit: 3000,
        windowMs: 60 * 60 * 1000,
        message: "Too many Requests from this IP, please try again in an hour!",
    });
    app.use(limiter);
    app.get("/", (req, res) => {
        if (req.session.count) {
            req.session.count++;
        }
        else {
            req.session.count = 1;
        }
        res.status(200);
        res.json({
            success: true,
            message: "hi will🕊️",
            count: req.session.count,
            id: req.sessionID,
            session: req.session
        });
    });
    app.use("/auth", authRouter_1.default);
    app.all("*", (req, res) => {
        res.status(404);
        res.json({
            message: "Not found"
        });
    });
    app.use(errorMiddleware_1.errorHandler);
    return app;
}
exports.default = createApp;
