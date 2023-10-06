import { Router } from "express";
import { createReply, viewReply } from "../controller/replyController";

const router = Router();

router.route("/:userID/:commentID/create-reply").post(createReply);
router.route("/:userID/:commentID/view-reply").get(viewReply);

export default router;
