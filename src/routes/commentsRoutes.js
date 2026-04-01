import express from "express";
import {
  buildManageCommentsPage,
  createCommentSubmission,
  deleteOwnCommentSubmission,
  moderateDeleteCommentSubmission,
  updateCommentSubmission
} from "../controllers/commentsController.js";
import { checkLogin, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/cars/:carId/comments", checkLogin, createCommentSubmission);
router.post("/comments/:commentId/update", checkLogin, updateCommentSubmission);
router.post("/comments/:commentId/delete", checkLogin, deleteOwnCommentSubmission);

router.get(
  "/comments/manage",
  checkRole("admin", "moderator"),
  buildManageCommentsPage
);

router.post(
  "/comments/:commentId/moderate-delete",
  checkRole("admin", "moderator"),
  moderateDeleteCommentSubmission
);

export default router;