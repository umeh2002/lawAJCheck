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
exports.updateAvatar = exports.deleteUser = exports.getAll = exports.change = exports.resetPassword = exports.verifyUser = exports.signInLawyer = exports.signInUser = exports.registerLawyer = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const email_1 = require("../utils/email");
const role_1 = require("../utils/role");
const streamUpload_1 = require("../utils/streamUpload");
const prisma = new client_1.PrismaClient();
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const value = crypto_1.default.randomBytes(32).toString("hex");
        const token = jsonwebtoken_1.default.sign(value, "secret");
        const user = yield prisma.authModel.create({
            data: {
                name,
                password: hash,
                email,
                token,
                role: role_1.role.USER
            },
        });
        const tokenID = jsonwebtoken_1.default.sign({ id: user.id }, "secret");
        (0, email_1.sendAccountOpeningMail)(user, tokenID).then(() => {
            console.log("sent mail");
        });
        return res.status(201).json({
            message: "User created successfully",
            data: user,
            token: tokenID
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error registering user",
            data: error.message,
        });
    }
});
exports.registerUser = registerUser;
const registerLawyer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, password, email, secret } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const value = crypto_1.default.randomBytes(32).toString("hex");
        const token = jsonwebtoken_1.default.sign(value, "ajLaw");
        if (secret === "law") {
            const user = yield prisma.authModel.create({
                data: {
                    name,
                    email,
                    password: hash,
                    token,
                    role: role_1.role.ADMIN,
                }
            });
            const tokenID = jsonwebtoken_1.default.sign({ id: user.id }, "secret");
            (0, email_1.sendAccountOpeningMail)(user, tokenID).then(() => {
                console.log("sent mail");
            });
            return res.status(201).json({
                message: "Lawyer Account created successfully",
                data: user
            });
        }
        else {
            return res.status(404).json({
                message: "Invalid lawyerSecret"
            });
        }
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.registerLawyer = registerLawyer;
const signInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.authModel.findUnique({
            where: { email },
        });
        if (user) {
            const check = yield bcrypt_1.default.compare(password, user.password);
            if (check) {
                if (user.verified && user.token === "") {
                    const token = jsonwebtoken_1.default.sign({ id: user.id }, "secret");
                    req.headers.authorization = `Bearer ${token}`;
                    return res.status(201).json({
                        message: "success",
                        data: token,
                    });
                }
                else {
                    return res.status(404).json({
                        message: "veriify your email address",
                    });
                }
            }
            else {
                return res.status(404).json({
                    message: "invalid password",
                });
            }
        }
        else {
            return res.status(404).json({
                message: "user not found",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error sign in user",
            data: error.message,
        });
    }
});
exports.signInUser = signInUser;
const signInLawyer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.authModel.findUnique({
            where: { email },
        });
        if (user) {
            const check = yield bcrypt_1.default.compare(password, user.password);
            if (check) {
                if (user.verified && user.token === "") {
                    const token = jsonwebtoken_1.default.sign({ id: user.id }, "secret");
                    req.headers.authorization = `Bearer ${token}`;
                    return res.status(201).json({
                        message: "success",
                        data: token,
                    });
                }
                else {
                    return res.status(404).json({
                        message: "veriify your email address",
                    });
                }
            }
            else {
                return res.status(404).json({
                    message: "invalid password",
                });
            }
        }
        else {
            return res.status(404).json({
                message: "user not found",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error sign in user",
            data: error.message,
        });
    }
});
exports.signInLawyer = signInLawyer;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const getID = jsonwebtoken_1.default.verify(token, "secret", (err, payload) => {
            if (err) {
                return err;
            }
            else {
                return payload;
            }
        });
        const user = yield prisma.authModel.update({
            where: { id: getID === null || getID === void 0 ? void 0 : getID.id },
            data: {
                verified: true,
                token: "",
            },
        });
        return res.status(201).json({
            message: "verification successful",
            data: user,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "error",
            data: error.message,
        });
    }
});
exports.verifyUser = verifyUser;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield prisma.authModel.findUnique({
            where: { email },
        });
        if ((user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.token) === "") {
            const token = jsonwebtoken_1.default.sign({ id: user.id }, "secret");
            const pass = yield prisma.authModel.update({
                where: { id: user.id },
                data: {
                    token,
                },
            });
            (0, email_1.resetAccountPassword)(user, token).then(() => {
                console.log("sent password reset");
            });
            return res.status(200).json({
                message: "success",
                data: pass,
            });
        }
        else {
            return res.status(404).json({
                message: "you can't reset your password",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error reseting password",
            data: error.message,
        });
    }
});
exports.resetPassword = resetPassword;
const change = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const getID = jsonwebtoken_1.default.verify(token, "secret", (err, payload) => {
            if (err) {
                return err;
            }
            else {
                return payload;
            }
        });
        const user = yield prisma.authModel.findUnique({
            where: { id: getID.id },
        });
        if ((user === null || user === void 0 ? void 0 : user.verified) && user.token !== "") {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hash = yield bcrypt_1.default.hash(password, salt);
            const pass = yield prisma.authModel.update({
                where: { id: user.id },
                data: {
                    password: hash,
                    token: ""
                },
            });
            return res.status(201).json({
                message: "success",
                data: pass,
            });
        }
        else {
            return res.status(404).json({
                message: "error ",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "error",
            data: error.message,
        });
    }
});
exports.change = change;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.authModel.findMany({});
        return res.status(200).json({
            message: "Success",
            data: user,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "error",
            data: error.message,
        });
    }
});
exports.getAll = getAll;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield prisma.authModel.delete({
            where: { id: userID },
        });
        return res.status(201).json({
            message: "User deleted successfully",
            data: user,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "error deleting user",
            data: error.message,
        });
    }
});
exports.deleteUser = deleteUser;
const updateAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { secure_url, public_id } = yield (0, streamUpload_1.streamUpload)(req);
        const user = yield prisma.authModel.update({
            where: { id: userID },
            data: {
                avatar: secure_url, avatarID: public_id
            }
        });
        return res.status(201).json({
            message: "Success",
            data: user
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error updating avatar",
            data: error.message
        });
    }
});
exports.updateAvatar = updateAvatar;
// export const firstAccountVerification = async (req: Request, res: Response) => {
//   try {
//     const { secretKey } = req.body;
//     const { token } = req.params;
//     jwt.verify(token, "secret", async (error, payload: any) => {
//       if (error) {
//         throw new Error();
//       } else {
//         const account = await prisma.authModel.findUnique({
//           where: { id: payload.id },
//         });
//         if (account?.secretKey === secretKey) {
//           sendSecondEmail(account).then(() => {
//             console.log("Mail Sent...");
//           });
//           return res.status(200).json({
//             message: "PLease to verify your Account",
//           });
//         } else {
//           return res.status(404).json({
//             message: "Error with your Token",
//           });
//         }
//       }
//     });
//   } catch (error) {
//     return res.status(404).json({
//       message: "Error",
//     });
//   }
// };
