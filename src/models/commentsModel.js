import pool from "../db/database.js";

export async function getCommentsByCarId(carId) {
  const sql = `
    SELECT
      c.comment_id,
      c.user_id,
      c.car_id,
      c.comment_text,
      c.is_flagged,
      c.created_at,
      c.updated_at,
      u.first_name,
      u.last_name,
      u.email
    FROM comments c
    JOIN users u ON c.user_id = u.user_id
    WHERE c.car_id = $1
    ORDER BY c.created_at DESC
  `;
  const result = await pool.query(sql, [carId]);
  return result.rows;
}

export async function getCommentById(commentId) {
  const sql = `
    SELECT
      c.comment_id,
      c.user_id,
      c.car_id,
      c.comment_text,
      c.is_flagged,
      c.created_at,
      c.updated_at,
      u.first_name,
      u.last_name,
      u.email
    FROM comments c
    JOIN users u ON c.user_id = u.user_id
    WHERE c.comment_id = $1
  `;
  const result = await pool.query(sql, [commentId]);
  return result.rows[0];
}

export async function createComment({ userId, carId, commentText }) {
  const sql = `
    INSERT INTO comments (user_id, car_id, comment_text, created_at, updated_at)
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING *
  `;
  const result = await pool.query(sql, [userId, carId, commentText]);
  return result.rows[0];
}

export async function updateComment(commentId, userId, commentText) {
  const sql = `
    UPDATE comments
    SET comment_text = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE comment_id = $2
      AND user_id = $3
    RETURNING *
  `;
  const result = await pool.query(sql, [commentText, commentId, userId]);
  return result.rows[0];
}

export async function deleteOwnComment(commentId, userId) {
  const sql = `
    DELETE FROM comments
    WHERE comment_id = $1
      AND user_id = $2
    RETURNING *
  `;
  const result = await pool.query(sql, [commentId, userId]);
  return result.rows[0];
}

export async function deleteCommentById(commentId) {
  const sql = `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *
  `;
  const result = await pool.query(sql, [commentId]);
  return result.rows[0];
}

export async function getAllComments() {
  const sql = `
    SELECT
      c.comment_id,
      c.comment_text,
      c.is_flagged,
      c.created_at,
      c.updated_at,
      u.first_name,
      u.last_name,
      u.email,
      car.year,
      car.make,
      car.model,
      car.car_id
    FROM comments c
    JOIN users u ON c.user_id = u.user_id
    JOIN cars car ON c.car_id = car.car_id
    ORDER BY c.created_at DESC
  `;
  const result = await pool.query(sql);
  return result.rows;
}