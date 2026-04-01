import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: isProduction
    ? {
        rejectUnauthorized: false
      }
    : false
});

export async function closePool() {
  await pool.end();
}

export default pool;