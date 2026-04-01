import express from "express";
import {
  buildCreateCategoryPage,
  buildEditCategoryPage,
  buildManageCategoriesPage,
  createCategorySubmission,
  deleteCategorySubmission,
  updateCategorySubmission
} from "../controllers/categoriesController.js";
import { checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/categories/manage", checkRole("admin"), buildManageCategoriesPage);
router.get("/categories/new", checkRole("admin"), buildCreateCategoryPage);
router.post("/categories/new", checkRole("admin"), createCategorySubmission);
router.get("/categories/:categoryId/edit", checkRole("admin"), buildEditCategoryPage);
router.post("/categories/:categoryId/edit", checkRole("admin"), updateCategorySubmission);
router.post("/categories/:categoryId/delete", checkRole("admin"), deleteCategorySubmission);

export default router;