import express from "express";
import {
  buildCreateProjectPage,
  buildEditProjectPage,
  buildManageProjectsPage,
  buildProjectsPage,
  createProjectSubmission,
  deleteProjectSubmission,
  updateProjectStatusSubmission,
  updateProjectSubmission
} from "../controllers/projectsController.js";
import { checkLogin, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/projects", checkLogin, buildProjectsPage);
router.get("/projects/new", checkLogin, buildCreateProjectPage);
router.post("/projects", checkLogin, createProjectSubmission);
router.get("/projects/:projectId/edit", checkLogin, buildEditProjectPage);
router.post("/projects/:projectId/update", checkLogin, updateProjectSubmission);
router.post("/projects/:projectId/delete", checkLogin, deleteProjectSubmission);

router.get(
  "/projects/manage",
  checkRole("admin", "moderator"),
  buildManageProjectsPage
);

router.post(
  "/projects/:projectId/status",
  checkRole("admin", "moderator"),
  updateProjectStatusSubmission
);

export default router;