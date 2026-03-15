import pool from "../db/database.js";

export async function getUserByEmail(email) {
  const sql = `
    SELECT u.*, r.role_name
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    WHERE u.email = $1
  `;
  const result = await pool.query(sql, [email]);
  return result.rows[0];
}

export async function getUserById(userId) {
  const sql = `
    SELECT u.user_id, u.first_name, u.last_name, u.email, u.role_id, r.role_name
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    WHERE u.user_id = $1
  `;
  const result = await pool.query(sql, [userId]);
  return result.rows[0];
}

export async function createUser(firstName, lastName, email, passwordHash) {
  const sql = `
    INSERT INTO users (first_name, last_name, email, password_hash, role_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING user_id, first_name, last_name, email, role_id
  `;
  const result = await pool.query(sql, [
    firstName,
    lastName,
    email,
    passwordHash,
    3
  ]);
  return result.rows[0];
}
