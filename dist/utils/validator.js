"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeValidator = exports.resetValidator = exports.signInLawyerValidator = exports.signInValidator = exports.createLawyerValidator = exports.createValidator = void 0;
const joi_1 = __importDefault(require("joi"));
// let regex =
//   /^(?!.\s)(?=.[A-Z])(?=.[a-z])(?=.[0-9])(?=.[~`!@#$%^&()--+={}\[\]|\\:;"'<>,.?/_₹]).{10,16}$/;
exports.createValidator = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().lowercase().trim().required(),
    password: joi_1.default.string().required(),
    confirm: joi_1.default.ref("password"),
});
exports.createLawyerValidator = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().lowercase().trim().required(),
    password: joi_1.default.string().required(),
    confirm: joi_1.default.ref("password"),
    secret: joi_1.default.string().required()
});
exports.signInValidator = joi_1.default.object({
    email: joi_1.default.string().email().lowercase().trim().required(),
    password: joi_1.default.string().required(),
});
exports.signInLawyerValidator = joi_1.default.object({
    email: joi_1.default.string().email().lowercase().trim().required(),
    password: joi_1.default.string().required(),
});
exports.resetValidator = joi_1.default.object({
    email: joi_1.default.string().email().lowercase().trim().required(),
});
exports.changeValidator = joi_1.default.object({
    password: joi_1.default.string().required(),
});
