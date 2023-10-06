"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commentController_1 = require("../controller/commentController");
const router = (0, express_1.Router)();
router.route("/:userID/:lawID/create-comment").post(commentController_1.createComment);
router.route("/:userID/:commentID/delete-comment").delete(commentController_1.deleteComment);
router.route("/view-comment").get(commentController_1.viewAllComments);
exports.default = router;
