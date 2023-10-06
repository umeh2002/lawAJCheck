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
const passport_1 = __importDefault(require("passport"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const GOOGLE_CLIENT_ID = "72356347044-ift4l94ujfbg4uhmrmcs78u18l4ucrrn.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const GoogleStrategy = require("passport-google-oauth2").Strategy;
passport_1.default.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3678/google/callback",
    // callbackURL: environemtVariable.CALLBACKURL,
    passReqToCallback: true,
}, (request, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    return done(null, profile);
})));
passport_1.default.serializeUser((user, done) => {
    return done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    return done(null, user);
});
