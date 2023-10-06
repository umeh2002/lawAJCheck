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
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewReply = exports.createReply = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, commentID } = req.params;
        const { reply } = req.body;
        const user = yield prisma.authModel.findUnique({
            where: { id: userID },
        });
        const comment = yield prisma.commentModel.findUnique({
            where: { id: commentID },
            include: { reply: true },
        });
        if (user && comment) {
            const replied = yield prisma.replyModel.create({
                data: {
                    reply,
                    commentID,
                    userID,
                },
            });
            comment.reply.push(replied);
            return res.status(201).json({
                message: "success",
                data: replied,
            });
        }
        else {
            return res.status(404).json({
                message: "cannot create reply"
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "error creating reply",
            data: error.message,
        });
    }
});
exports.createReply = createReply;
const viewReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, commentID } = req.params;
        const user = yield prisma.authModel.findUnique({
            where: { id: userID },
        });
        const comment = yield prisma.commentModel.findUnique({
            where: { id: commentID },
            include: { reply: true },
        });
        if (user && comment) {
            const replied = yield prisma.replyModel.findMany({});
            return res.status(200).json({
                message: "can see all replies",
                data: replied
            });
        }
        else {
            return res.status(404).json({
                message: "cannot see all replies"
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "error",
            data: error.message
        });
    }
});
exports.viewReply = viewReply;
