import {Router} from "express"
import { createComment, deleteComment, viewAllComments } from "../controller/commentController"


const router = Router()

router.route("/:userID/:lawID/create-comment").post(createComment)
router.route("/:userID/:commentID/delete-comment").delete(deleteComment)
router.route("/view-comment").get(viewAllComments)
router.route("/view-comment").get(viewAllComments)

export default router