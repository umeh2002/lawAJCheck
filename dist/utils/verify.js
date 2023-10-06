"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verification = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verification = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (token) {
            const realToken = token.split(" ")[1];
            if (realToken) {
                jsonwebtoken_1.default.verify(realToken, "secret", (err, payload) => {
                    if (err) {
                        return res.status(404).json({
                            message: "error",
                            data: err,
                        });
                    }
                    else {
                        if (payload.email === "") {
                            next();
                        }
                        else {
                            return res.status(404).json({
                                message: "you don't have permission",
                            });
                        }
                    }
                });
            }
            else {
                return res.status(404).json({
                    message: "error",
                });
            }
        }
        else {
            return res.status(404).json({
                message: "error, check your token",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "error",
        });
    }
};
exports.verification = verification;
