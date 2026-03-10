import express from "express";
import {
  buildCarsPage,
  buildCarDetailPage
} from "../controllers/carsController.js";

const router = express.Router();

router.get("/cars", buildCarsPage);
router.get("/cars/:carId", buildCarDetailPage);

export default router;