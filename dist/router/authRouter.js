"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controller/authController");
const validatorHandler_1 = __importDefault(require("../utils/validatorHandler"));
const validator_1 = require("../utils/validator");
const multer_1 = __importDefault(require("multer"));
const myUpload = (0, multer_1.default)().single("avatar");
const router = (0, express_1.Router)();
router.route("/register-user").post((0, validatorHandler_1.default)(validator_1.createValidator), authController_1.registerUser);
router.route("/register-lawyer").post((0, validatorHandler_1.default)(validator_1.createLawyerValidator), authController_1.registerLawyer);
router.route("/sign-in").post((0, validatorHandler_1.default)(validator_1.signInValidator), authController_1.signInUser);
router.route("/sign-in-lawyer").post((0, validatorHandler_1.default)(validator_1.signInLawyerValidator), authController_1.signInLawyer);
router
    .route("/:token/change-password")
    .patch((0, validatorHandler_1.default)(validator_1.changeValidator), authController_1.changePassword);
router
    .route("/reset-password")
    .patch((0, validatorHandler_1.default)(validator_1.resetValidator), authController_1.resetPassword);
router.route("/:userID/delete-user").delete(authController_1.deleteUser);
router.route("/get-all").get(authController_1.getAll);
router.route("/:token/verify").patch(authController_1.verifyUser);
router.route("/:userID/update-avatar").patch(myUpload, authController_1.updateAvatar);
exports.default = router;
