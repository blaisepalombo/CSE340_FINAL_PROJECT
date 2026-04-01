import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const useSSL =
  process.env.DB_SSL === "true" ||
  process.env.NODE_ENV === "production" ||
  (process.env.DB_URL && process.env.DB_URL.includes("render.com"));

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: useSSL
    ? {
        rejectUnauthorized: false
      }
    : false
});

export async function closePool() {
  await pool.end();
}

export default pool;