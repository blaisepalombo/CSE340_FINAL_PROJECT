import pool from "../db/database.js";

export async function getAllUsers() {
  const sql = `
    SELECT
      u.user_id,
      u.first_name,
      u.last_name,
      u.email,
      u.role_id,
      r.role_name,
      u.created_at
    FROM users u
    LEFT JOIN roles r
      ON u.role_id = r.role_id
    ORDER BY u.created_at DESC, u.last_name ASC, u.first_name ASC
  `;
  const result = await pool.query(sql);
  return result.rows;
}

export async function getUserById(userId) {
  const sql = `
    SELECT
      u.user_id,
      u.first_name,
      u.last_name,
      u.email,
      u.role_id,
      r.role_name,
      u.created_at
    FROM users u
    LEFT JOIN roles r
      ON u.role_id = r.role_id
    WHERE u.user_id = $1
  `;
  const result = await pool.query(sql, [userId]);
  return result.rows[0];
}

export async function getAllRoles() {
  const sql = `
    SELECT role_id, role_name
    FROM roles
    ORDER BY role_id ASC
  `;
  const result = await pool.query(sql);
  return result.rows;
}

export async function updateUserRole(userId, roleId) {
  const sql = `
    UPDATE users
    SET role_id = $1
    WHERE user_id = $2
    RETURNING *
  `;
  const result = await pool.query(sql, [roleId, userId]);
  return result.rows[0];
}

export async function deleteUserById(userId) {
  const sql = `
    DELETE FROM users
    WHERE user_id = $1
    RETURNING *
  `;
  const result = await pool.query(sql, [userId]);
  return result.rows[0];
}