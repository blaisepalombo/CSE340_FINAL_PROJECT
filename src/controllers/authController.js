import bcrypt from "bcryptjs";
import {
  createUser,
  getUserByEmail,
  getUserById
} from "../models/authModel.js";
import { getAccountDashboardData } from "./projectsController.js";

export function buildRegister(req, res) {
  res.render("auth/register", {
    title: "Register",
    errors: [],
    formData: {}
  });
}

export async function registerUser(req, res, next) {
  try {
    const { first_name, last_name, email, password, confirm_password } = req.body;
    const errors = [];

    if (!first_name || !last_name || !email || !password || !confirm_password) {
      errors.push("All fields are required.");
    }

    if (password !== confirm_password) {
      errors.push("Passwords do not match.");
    }

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      errors.push("An account with that email already exists.");
    }

    if (errors.length > 0) {
      return res.status(400).render("auth/register", {
        title: "Register",
        errors,
        formData: { first_name, last_name, email }
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await createUser(first_name, last_name, email, passwordHash);

    req.session.user = {
      user_id: newUser.user_id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      role_id: newUser.role_id,
      role_name: "user"
    };

    res.redirect("/account");
  } catch (error) {
    next(error);
  }
}

export function buildLogin(req, res) {
  res.render("auth/login", {
    title: "Login",
    errors: [],
    formData: {}
  });
}

export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const errors = [];

    if (!email || !password) {
      errors.push("Email and password are required.");
      return res.status(400).render("auth/login", {
        title: "Login",
        errors,
        formData: { email }
      });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      errors.push("Invalid email or password.");
      return res.status(400).render("auth/login", {
        title: "Login",
        errors,
        formData: { email }
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      errors.push("Invalid email or password.");
      return res.status(400).render("auth/login", {
        title: "Login",
        errors,
        formData: { email }
      });
    }

    req.session.user = {
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role_id: user.role_id,
      role_name: user.role_name
    };

    res.redirect("/account");
  } catch (error) {
    next(error);
  }
}

export function logoutUser(req, res, next) {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/");
  });
}

export async function buildAccount(req, res, next) {
  try {
    const account = await getUserById(req.session.user.user_id);

    if (!account) {
      req.session.destroy(() => {
        return res.redirect("/login");
      });
      return;
    }

    const dashboard = await getAccountDashboardData(req.session.user.user_id);

    res.render("account/index", {
      title: "My Account",
      account,
      totalProjects: dashboard.totalProjects,
      recentProjects: dashboard.projects.slice(0, 3)
    });
  } catch (error) {
    next(error);
  }
}