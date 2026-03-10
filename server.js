import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import carsRoutes from "./src/routes/carsRoutes.js";
import errorHandler from "./src/middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.use("/", carsRoutes);

app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found"
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});