import express from "express";
import {
  buildRegister,
  registerUser,
  buildLogin,
  loginUser,
  logoutUser,
  buildAccount
} from "../controllers/authController.js";
import { checkLogin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/register", buildRegister);
router.post("/register", registerUser);

router.get("/login", buildLogin);
router.post("/login", loginUser);

router.get("/logout", logoutUser);

router.get("/account", checkLogin, buildAccount);

export default router;
