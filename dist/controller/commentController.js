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
exports.viewAllComments = exports.deleteComment = exports.createComment = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, lawID } = req.params;
        const { comment } = req.body;
        const user = yield prisma.authModel.findUnique({
            where: { id: userID },
        });
        const law = yield prisma.lawModel.findUnique({
            where: { id: lawID },
            include: { comments: true },
        });
        if (user && law) {
            const message = yield prisma.commentModel.create({
                data: {
                    comment,
                    userID,
                    lawID,
                },
            });
            law.comments.push(message);
            return res.status(201).json({
                message: "created comment successfully",
                data: law.comments,
            });
        }
        else {
            return res.status(404).json({
                message: "no comments",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating comment",
            data: error.message,
        });
    }
});
exports.createComment = createComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentID, userID } = req.params;
        const user = yield prisma.authModel.findUnique({
            where: { id: userID },
        });
        const comment = yield prisma.commentModel.findUnique({
            where: { id: commentID },
        });
        if ((user === null || user === void 0 ? void 0 : user.id) === (comment === null || comment === void 0 ? void 0 : comment.userID)) {
            const commented = yield prisma.commentModel.delete({
                where: { id: commentID },
            });
            return res.status(200).json({
                message: "Comment deleted",
                data: commented,
            });
        }
        else {
            return res.status(404).json({
                message: "you cannot delete this comment",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error deleting comment",
            data: error.message,
        });
    }
});
exports.deleteComment = deleteComment;
const viewAllComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commented = yield prisma.commentModel.findMany({
            include: { reply: true }
        });
        return res.status(200).json({
            message: "success",
            data: commented
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "error",
            data: error.message
        });
    }
});
exports.viewAllComments = viewAllComments;
