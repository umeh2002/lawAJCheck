"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const replyController_1 = require("../controller/replyController");
const router = (0, express_1.Router)();
router.route("/:userID/:commentID/create-reply").post(replyController_1.createReply);
router.route("/:userID/:commentID/view-reply").get(replyController_1.viewReply);
exports.default = router;
