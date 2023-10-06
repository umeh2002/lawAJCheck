"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_github2_1 = __importDefault(require("passport-github2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const GitHubStrategy = passport_github2_1.default.Strategy;
passport_1.default.use(new GitHubStrategy({
    clientID: "1b397d15caf372a81bbc",
    clientSecret: "0ee181027315268ccbb0db3310fbde9319d1be1d",
    callbackURL: "https://lawaj.onrender.com/github/callback",
}, function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));
passport_1.default.serializeUser((user, done) => {
    return done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    return done(null, user);
});
