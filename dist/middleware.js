"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const userMiddleware = (req, res, next) => {
    const header = req.headers["authorization"];
    const decodeduser = jsonwebtoken_1.default.verify(header, config_1.JWT_SECRET);
    if (decodeduser) {
        //@ts-ignore
        req.userId = decodeduser.id;
        next();
    }
    else {
        res.status(403).json({
            message: "You havenot logged in"
        });
    }
};
exports.userMiddleware = userMiddleware;
//Todo:how to override the type of Request object
