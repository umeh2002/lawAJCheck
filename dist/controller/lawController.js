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
exports.findLawByCategory = exports.unlikeLaw = exports.likeLaw = exports.rateLaw = exports.viewAllLawyerLaw = exports.deleteLaw = exports.viewLawyerLaw = exports.updateImage = exports.updateLaw = exports.viewOne = exports.viewAll = exports.createLaw = void 0;
const client_1 = require("@prisma/client");
const streamUpload_1 = require("../utils/streamUpload");
const prisma = new client_1.PrismaClient();
const createLaw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { title, description, content, category } = req.body;
        const { secure_url, public_id } = yield (0, streamUpload_1.streamUpload)(req);
        const user = yield prisma.authModel.findUnique({
            where: { id: userID },
            include: { law: true },
        });
        if ((user === null || user === void 0 ? void 0 : user.role) === "lawyer") {
            const law = yield prisma.lawModel.create({
                data: {
                    title,
                    description,
                    content,
                    category,
                    image: secure_url,
                    imageID: public_id,
                    userID,
                    rate: 0,
                },
            });
            user.law.push(law);
            return res.status(201).json({
                message: "Success",
                data: user,
            });
        }
        else {
            return res.status(404).json({
                message: "you aren't allowed to access this",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating law",
            data: error.message,
        });
    }
});
exports.createLaw = createLaw;
const viewAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const law = yield prisma.lawModel.findMany({
            include: { comments: true }
        });
        return res.status(200).json({
            message: "Success",
            data: law,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "error",
            data: error.message,
        });
    }
});
exports.viewAll = viewAll;
const viewOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lawID } = req.params;
        const law = yield prisma.lawModel.findUnique({
            where: { id: lawID },
            include: { comments: true }
        });
        return res.status(200).json({
            message: "success",
            data: law,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "error",
            data: error.message,
        });
    }
});
exports.viewOne = viewOne;
const updateLaw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lawID } = req.params;
        const { title, description, content } = req.body;
        const law = yield prisma.lawModel.update({
            where: { id: lawID },
            data: {
                title,
                description,
                content,
            },
        });
        return res.status(201).json({
            message: "Success",
            data: law,
        });
    }
    catch (error) {
        return res.status(201).json({
            message: "Error updating law",
            data: error.message,
        });
    }
});
exports.updateLaw = updateLaw;
const updateImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lawID } = req.params;
        const { secure_url, public_id } = yield (0, streamUpload_1.streamUpload)(req);
        const law = yield prisma.lawModel.update({
            where: { id: lawID },
            data: {
                image: secure_url,
                imageID: public_id,
            },
        });
        return res.status(201).json({
            message: "Success",
            data: law,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error updating image",
            data: error.message,
        });
    }
});
exports.updateImage = updateImage;
const viewLawyerLaw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lawID, userID } = req.params;
        const user = yield prisma.authModel.findUnique({
            where: { id: userID },
            include: { law: true }
        });
        const law = yield prisma.lawModel.findUnique({
            where: { id: lawID },
        });
        if ((user === null || user === void 0 ? void 0 : user.id) === (law === null || law === void 0 ? void 0 : law.userID)) {
            const lawyer = yield prisma.lawModel.findMany({});
            return res.status(200).json({
                message: "success",
                data: lawyer,
            });
        }
        else {
            return res.status(404).json({
                message: "check if you have created a law",
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
exports.viewLawyerLaw = viewLawyerLaw;
const deleteLaw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lawID, userID } = req.params;
        const user = yield prisma.authModel.findUnique({
            where: { id: userID },
        });
        const law = yield prisma.lawModel.findUnique({
            where: { id: lawID },
        });
        if ((user === null || user === void 0 ? void 0 : user.id) === (law === null || law === void 0 ? void 0 : law.userID)) {
            const lawyer = yield prisma.lawModel.delete({
                where: { id: lawID },
            });
            return res.status(200).json({
                message: "success",
                data: lawyer,
            });
        }
        else {
            return res.status(404).json({
                message: "you cannot access this page",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error deleting",
            data: error.message,
        });
    }
});
exports.deleteLaw = deleteLaw;
const viewAllLawyerLaw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield prisma.authModel.findUnique({
            where: { id: userID },
            include: { law: true },
        });
        if (user) {
            return res.status(200).json({
                message: "Success",
                data: user.law,
            });
        }
        else {
            return res.status(404).json({
                message: "register user please",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error",
            data: error.message,
        });
    }
});
exports.viewAllLawyerLaw = viewAllLawyerLaw;
const rateLaw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { lawID, userID } = req.params;
        const { rating } = req.body;
        const user = yield prisma.authModel.findUnique({
            where: { id: userID },
        });
        const law = yield prisma.lawModel.findUnique({
            where: { id: lawID },
        });
        let total = (_a = law === null || law === void 0 ? void 0 : law.rating) === null || _a === void 0 ? void 0 : _a.reduce((a, b) => {
            return a + b;
        }, 0);
        if (user) {
            let totalLength = law === null || law === void 0 ? void 0 : law.rating.length;
            law === null || law === void 0 ? void 0 : law.rating.push(rating);
            let rated = Math.ceil(total / totalLength);
            const lawyer = yield prisma.lawModel.update({
                where: { id: lawID },
                data: { rating: law === null || law === void 0 ? void 0 : law.rating, rate: rated },
            });
            return res.status(201).json({
                message: "success",
                data: lawyer,
            });
        }
        else {
            return res.status(404).json({
                message: "failed to rate",
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
exports.rateLaw = rateLaw;
const likeLaw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userID } = req.user;
        const { lawID } = req.params;
        const law = yield prisma.lawModel.findUnique({
            where: { id: lawID },
        });
        if (!law) {
            return res.status(404).json({
                message: "law not found",
            });
        }
        if (law === null || law === void 0 ? void 0 : law.like.includes(userID)) {
            return res.status(404).json({
                message: "You have already liked this law",
            });
        }
        else {
            law.like.push(userID);
            yield prisma.lawModel.update({
                where: { id: lawID },
                data: {
                    like: law === null || law === void 0 ? void 0 : law.like,
                },
            });
            return res.status(201).json({
                message: "You just liked this law",
                data: law,
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: `Error loving law: ${error.message}`,
            data: error,
        });
    }
});
exports.likeLaw = likeLaw;
const unlikeLaw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userID } = req.user;
        const { lawID } = req.params;
        const law = yield prisma.lawModel.findUnique({
            where: { id: lawID },
        });
        if (!law) {
            return res.status(404).json({
                message: "law not found",
            });
        }
        if (!law.like.includes(userID)) {
            return res.status(404).json({
                message: "You have not liked this law",
            });
        }
        const unlikedUsers = law === null || law === void 0 ? void 0 : law.like.filter((user) => user !== userID);
        yield prisma.lawModel.update({
            where: { id: lawID },
            data: {
                like: unlikedUsers,
            },
        });
        return res.status(201).json({
            message: "You just unliked this law",
            data: {
                like: unlikedUsers,
            },
        });
    }
    catch (error) {
        return res.status(404).json({
            message: `Error unliking law: ${error.message}`,
            data: error,
        });
    }
});
exports.unlikeLaw = unlikeLaw;
const findLawByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.body;
        const law = yield prisma.lawModel.findMany({
            where: { category },
        });
        return res.status(200).json({
            message: "getting all law categories",
            data: law,
        });
    }
    catch (error) {
        res.status(404).json({
            message: `Couldn't get all categories${error.message}`,
            data: error,
        });
    }
});
exports.findLawByCategory = findLawByCategory;
