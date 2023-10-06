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
exports.resetAccountPassword = exports.sendAccountOpeningMail = void 0;
const googleapis_1 = require("googleapis");
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const GOOGLE_ID = "72356347044-vs8ga77m4qst0fs7lc5f79gdvfetp1vc.apps.googleusercontent.com";
const GOOGLE_SECRET = "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";
const GOOGLE_REFRESH_TOKEN = "1//04WwkPd5MkHmsCgYIARAAGAQSNwF-L9Ir1elgfjBYa_eFs5fqE2XPVp8ZLsd-ON3lOC4IhuI3sWPkwLK8c_3XIgCwR2fu_x-_vDE";
const GOOGLE_URL = "https://developers.google.com/oauthplayground";
const oAuth = new googleapis_1.google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_URL);
oAuth.setCredentials({ access_token: GOOGLE_REFRESH_TOKEN });
const url = "http://localhost:3678";
const sendAccountOpeningMail = (user, tokenID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAccess = (yield oAuth.getAccessToken()).token;
        const transport = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "eumeh3882@gmail.com",
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                refreshToken: GOOGLE_REFRESH_TOKEN,
                accessToken: getAccess,
            },
        });
        const passedData = {
            userName: user.name,
            url: `${url}/${tokenID}/verify`,
        };
        const readData = path_1.default.join(__dirname, "../views/accountOpening.ejs");
        const data = yield ejs_1.default.renderFile(readData, passedData);
        const mailer = {
            from: " <eumeh3882@gmail.com > ",
            to: user.email,
            subject: "Welcome to AJ LAW Constituency, Where Ajegunle's Laws are clarified and properly interpreted!",
            html: data,
        };
        transport.sendMail(mailer);
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendAccountOpeningMail = sendAccountOpeningMail;
const resetAccountPassword = (user, tokenID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAccess = (yield oAuth.getAccessToken()).token;
        const transport = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "eumeh3882@gmail.com",
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                refreshToken: GOOGLE_REFRESH_TOKEN,
                accessToken: getAccess,
            },
        });
        const passedData = {
            userName: user.name,
            url: `${url}/${tokenID}/reset-account-password`,
        };
        const readData = path_1.default.join(__dirname, "../views/resetPassword.ejs");
        const data = yield ejs_1.default.renderFile(readData, passedData);
        const mailer = {
            from: " <eumeh3882@gmail.com > ",
            to: user.email,
            subject: "Welcome to AJ LAW Constituency, you can now reset your password",
            html: data,
        };
        transport.sendMail(mailer);
    }
    catch (error) {
        console.log(error);
    }
});
exports.resetAccountPassword = resetAccountPassword;
