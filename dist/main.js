"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const authRouter_1 = __importDefault(require("./router/authRouter"));
const lawRouter_1 = __importDefault(require("./router/lawRouter"));
const commentRouter_1 = __importDefault(require("./router/commentRouter"));
const replyRouter_1 = __importDefault(require("./router/replyRouter"));
const main = (app) => {
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.use((0, morgan_1.default)("dev"));
    app.use((0, helmet_1.default)());
    app.set("view engine", "ejs");
    app.use(express_1.default.static("public"));
    app.use(express_1.default.static(`${__dirname}/css`));
    app.get("/", (req, res) => {
        try {
            return res.status(200).json({
                message: "welcome to law api"
            });
        }
        catch (error) {
            return res.status(404).json({
                message: "error",
            });
        }
    });
    app.use("/api", authRouter_1.default);
    app.use("/api", lawRouter_1.default);
    app.use("/api", commentRouter_1.default);
    app.use("/api", replyRouter_1.default);
};
exports.main = main;
