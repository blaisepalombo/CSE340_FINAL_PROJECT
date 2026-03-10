import pool from "../db/database.js";

export async function getAllCars() {
  const sql = `
    SELECT c.*, cat.category_name
    FROM cars c
    JOIN categories cat ON c.category_id = cat.category_id
    ORDER BY c.year DESC, c.make ASC
  `;
  const result = await pool.query(sql);
  return result.rows;
}

export async function getCarById(carId) {
  const sql = `
    SELECT c.*, cat.category_name
    FROM cars c
    JOIN categories cat ON c.category_id = cat.category_id
    WHERE c.car_id = $1
  `;
  const result = await pool.query(sql, [carId]);
  return result.rows[0];
}

export async function getCarImagesByCarId(carId) {
  const sql = `
    SELECT *
    FROM car_images
    WHERE car_id = $1
    ORDER BY is_primary DESC, image_id ASC
  `;
  const result = await pool.query(sql, [carId]);
  return result.rows;
}