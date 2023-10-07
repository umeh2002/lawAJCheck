"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const lawController_1 = require("../controller/lawController");
const verify_1 = require("../utils/verify");
const myPic = (0, multer_1.default)().single("image");
const router = (0, express_1.Router)();
router.route("/:userID/create-law").post(verify_1.verification, myPic, lawController_1.createLaw);
router.route("/view-all").get(lawController_1.viewAll);
router.route("/:lawID/view-one").get(lawController_1.viewOne);
router.route("/:lawID/update-law").patch(lawController_1.updateLaw);
router.route("/:lawID/update-pic").patch(myPic, lawController_1.updateImage);
router.route("/:userID/:lawID/delete-law").delete(lawController_1.deleteLaw);
router.route("/:userID/:lawID/view-lawyer-laws").get(lawController_1.viewLawyerLaw);
router.route("/:userID/view-lawyer-law").get(lawController_1.viewAllLawyerLaw);
router.route("/:userID/:lawID/rate-law").patch(lawController_1.rateLaw);
router.route("/:lawID/like-law").get(lawController_1.likeLaw);
router.route("/:lawID/unlike-law").get(lawController_1.unlikeLaw);
router.route("/find-law-category").get(lawController_1.findLawByCategory);
exports.default = router;
