import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import pgSession from "connect-pg-simple";

import carsRoutes from "./src/routes/carsRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import projectsRoutes from "./src/routes/projectsRoutes.js";
import commentsRoutes from "./src/routes/commentsRoutes.js";
import errorHandler from "./src/middleware/errorHandler.js";
import pool, { closePool } from "./src/db/database.js";
import { setNavLocals } from "./src/middleware/authMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PgSession = pgSession(session);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "session",
      createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? "lax" : "strict",
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

app.use(setNavLocals);

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.use("/", carsRoutes);
app.use("/", authRoutes);
app.use("/", projectsRoutes);
app.use("/", commentsRoutes);

app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found"
  });
});

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log("\nServer running");
  console.log(`Local: http://localhost:${PORT}`);
});

async function shutdown(signal) {
  console.log(`\nReceived ${signal}. Closing server...`);

  server.close(async () => {
    try {
      await closePool();
      console.log("Database pool closed.");
      process.exit(0);
    } catch (error) {
      console.error("Error closing database pool:", error);
      process.exit(1);
    }
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));