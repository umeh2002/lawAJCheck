"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const main_1 = require("./main");
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
require("./github/github");
require("./google/goAuth");
const express_session_1 = __importDefault(require("express-session"));
const app = (0, express_1.default)();
const port = 3678;
(0, main_1.main)(app);
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
app.use((0, express_session_1.default)({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/google", (req, res) => {
    res.send(`<a href= "/veri/google">Authenicate with google</a>`);
});
app.get("/veri/google", passport_1.default.authenticate("google", { scope: ["email", "profile"] }));
app.get("/google/callback", passport_1.default.authenticate("google", {
    successRedirect: "http://localhost:3000/Home/",
    failureRedirect: "/google/callback/failure",
}));
app.get("/google/callback/protect", (req, res) => {
    var _a;
    return res.send(`hello ${(_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.displayName}`);
});
app.get("/google/callback/failure", (req, res) => {
    return res.send("failed to authnticate");
});
app.get("/github", (req, res) => {
    res.send(`<a href= "/veri/github">Authenicate with github</a>`);
});
app.get("/veri/github", passport_1.default.authenticate("github", { scope: ["user:email"] }));
app.get("/github/callback", passport_1.default.authenticate("github", {
    successRedirect: "http://localhost:3000/Home/",
    failureRedirect: "/github/callback/failure",
}));
const server = app.listen(port, () => {
    console.log();
    console.log(`server is listening on ${port}`);
});
process.on("uncaughtException", (reason) => {
    console.log("server is shutting down due to uncaught exception");
    console.log(reason);
});
process.on("unhandledRejection", (error) => {
    console.log("server is shutting down due to unhandled rejection");
    console.log(error);
    server.close(() => {
        process.exit(1);
    });
});
