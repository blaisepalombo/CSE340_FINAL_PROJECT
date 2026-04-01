import express from "express";
import {
  buildEditUserPage,
  buildManageUsersPage,
  deleteUserSubmission,
  updateUserRoleSubmission
} from "../controllers/usersController.js";
import { checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users/manage", checkRole("admin"), buildManageUsersPage);
router.get("/users/:userId/edit", checkRole("admin"), buildEditUserPage);
router.post("/users/:userId/edit", checkRole("admin"), updateUserRoleSubmission);
router.post("/users/:userId/delete", checkRole("admin"), deleteUserSubmission);

export default router;