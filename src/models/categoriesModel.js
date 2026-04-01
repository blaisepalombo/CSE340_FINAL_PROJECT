import pool from "../db/database.js";

export async function getAllCategories() {
  const sql = `
    SELECT
      c.category_id,
      c.category_name,
      c.description,
      COUNT(car.car_id)::int AS car_count
    FROM categories c
    LEFT JOIN cars car
      ON c.category_id = car.category_id
    GROUP BY c.category_id, c.category_name, c.description
    ORDER BY c.category_name ASC
  `;
  const result = await pool.query(sql);
  return result.rows;
}

export async function getCategoryById(categoryId) {
  const sql = `
    SELECT
      category_id,
      category_name,
      description
    FROM categories
    WHERE category_id = $1
  `;
  const result = await pool.query(sql, [categoryId]);
  return result.rows[0];
}

export async function createCategory({ categoryName, description }) {
  const sql = `
    INSERT INTO categories (category_name, description)
    VALUES ($1, $2)
    RETURNING *
  `;
  const result = await pool.query(sql, [categoryName, description]);
  return result.rows[0];
}

export async function updateCategory(categoryId, { categoryName, description }) {
  const sql = `
    UPDATE categories
    SET
      category_name = $1,
      description = $2
    WHERE category_id = $3
    RETURNING *
  `;
  const result = await pool.query(sql, [categoryName, description, categoryId]);
  return result.rows[0];
}

export async function deleteCategoryById(categoryId) {
  const sql = `
    DELETE FROM categories
    WHERE category_id = $1
    RETURNING *
  `;
  const result = await pool.query(sql, [categoryId]);
  return result.rows[0];
}