import { Router } from "express";
import multer from "multer";
import {
  createLaw,
  deleteLaw,
  findLawByCategory,
  likeLaw,
  rateLaw,
  unlikeLaw,
  updateImage,
  updateLaw,
  viewAll,
  viewAllLawyerLaw,
  viewLawyerLaw,
  viewOne,
} from "../controller/lawController";
import { verification } from "../utils/verify";

const myPic = multer().single("image");

const router = Router();

router.route("/:userID/create-law").post(verification,myPic, createLaw);
router.route("/view-all").get(viewAll);
router.route("/:lawID/view-one").get(viewOne);
router.route("/:lawID/update-law").patch(updateLaw);
router.route("/:lawID/update-pic").patch(myPic,updateImage);
router.route("/:userID/:lawID/delete-law").delete(deleteLaw);
router.route("/:userID/:lawID/view-lawyer-laws").get(viewLawyerLaw);
router.route("/:userID/view-lawyer-law").get(viewAllLawyerLaw);
router.route("/:userID/:lawID/rate-law").patch(rateLaw);
router.route("/:lawID/like-law").get(likeLaw);

router.route("/:lawID/unlike-law").get(unlikeLaw);

router.route("/find-law-category").get(findLawByCategory);

export default router;
