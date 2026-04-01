import express from "express";
import {
  buildCarDetailPage,
  buildCarsPage,
  buildCreateCarPage,
  buildEditCarPage,
  buildManageCarsPage,
  createCarSubmission,
  deleteCarSubmission,
  updateCarSubmission
} from "../controllers/carsController.js";
import { checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/cars", buildCarsPage);

router.get("/cars/manage", checkRole("admin"), buildManageCarsPage);
router.get("/cars/new", checkRole("admin"), buildCreateCarPage);
router.post("/cars/new", checkRole("admin"), createCarSubmission);
router.get("/cars/:carId/edit", checkRole("admin"), buildEditCarPage);
router.post("/cars/:carId/edit", checkRole("admin"), updateCarSubmission);
router.post("/cars/:carId/delete", checkRole("admin"), deleteCarSubmission);

router.get("/cars/:carId", buildCarDetailPage);

export default router;