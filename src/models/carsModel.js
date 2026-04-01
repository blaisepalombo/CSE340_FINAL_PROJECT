import pool from "../db/database.js";

export async function getAllCars(filters = {}) {
  const conditions = [];
  const values = [];
  let orderBy = "c.year DESC, c.make ASC, c.model ASC";

  if (filters.categoryIds && filters.categoryIds.length > 0) {
    values.push(filters.categoryIds);
    conditions.push(`c.category_id = ANY($${values.length}::int[])`);
  }

  if (filters.availabilityStatuses && filters.availabilityStatuses.length > 0) {
    values.push(filters.availabilityStatuses);
    conditions.push(`c.availability_status = ANY($${values.length}::text[])`);
  }

  if (filters.search) {
    values.push(`%${filters.search}%`);
    conditions.push(`(
      c.title ILIKE $${values.length}
      OR c.make ILIKE $${values.length}
      OR c.model ILIKE $${values.length}
      OR c.description ILIKE $${values.length}
      OR cat.category_name ILIKE $${values.length}
    )`);
  }

  switch (filters.sort) {
    case "price_asc":
      orderBy = "c.price ASC NULLS LAST, c.year DESC";
      break;
    case "price_desc":
      orderBy = "c.price DESC NULLS LAST, c.year DESC";
      break;
    case "year_asc":
      orderBy = "c.year ASC, c.make ASC";
      break;
    case "year_desc":
      orderBy = "c.year DESC, c.make ASC";
      break;
    case "make_asc":
      orderBy = "c.make ASC, c.model ASC, c.year DESC";
      break;
    default:
      orderBy = "c.year DESC, c.make ASC, c.model ASC";
  }

  const whereClause = conditions.length > 0
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const sql = `
    SELECT
      c.*,
      cat.category_name,
      img.image_url AS primary_image_url,
      img.alt_text AS primary_image_alt_text
    FROM cars c
    LEFT JOIN categories cat
      ON c.category_id = cat.category_id
    LEFT JOIN LATERAL (
      SELECT image_url, alt_text
      FROM car_images
      WHERE car_id = c.car_id
      ORDER BY is_primary DESC, image_id ASC
      LIMIT 1
    ) img ON true
    ${whereClause}
    ORDER BY ${orderBy}
  `;

  const result = await pool.query(sql, values);
  return result.rows;
}

export async function getCarById(carId) {
  const sql = `
    SELECT
      c.*,
      cat.category_name
    FROM cars c
    LEFT JOIN categories cat
      ON c.category_id = cat.category_id
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

export async function getPrimaryImageByCarId(carId) {
  const sql = `
    SELECT *
    FROM car_images
    WHERE car_id = $1
    ORDER BY is_primary DESC, image_id ASC
    LIMIT 1
  `;
  const result = await pool.query(sql, [carId]);
  return result.rows[0];
}

export async function getAllCategories() {
  const sql = `
    SELECT category_id, category_name, description
    FROM categories
    ORDER BY category_name ASC
  `;
  const result = await pool.query(sql);
  return result.rows;
}

export async function createCar({
  categoryId,
  title,
  make,
  model,
  year,
  price,
  description,
  featured,
  availabilityStatus,
  imageUrl,
  imageAltText
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const carSql = `
      INSERT INTO cars (
        category_id,
        title,
        make,
        model,
        year,
        price,
        description,
        featured,
        availability_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const carResult = await client.query(carSql, [
      categoryId,
      title,
      make,
      model,
      year,
      price,
      description,
      featured,
      availabilityStatus
    ]);

    const car = carResult.rows[0];

    if (imageUrl) {
      const imageSql = `
        INSERT INTO car_images (car_id, image_url, alt_text, is_primary)
        VALUES ($1, $2, $3, true)
      `;
      await client.query(imageSql, [
        car.car_id,
        imageUrl,
        imageAltText || `${year} ${make} ${model}`
      ]);
    }

    await client.query("COMMIT");
    return car;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function updateCar(
  carId,
  {
    categoryId,
    title,
    make,
    model,
    year,
    price,
    description,
    featured,
    availabilityStatus,
    imageUrl,
    imageAltText
  }
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const carSql = `
      UPDATE cars
      SET
        category_id = $1,
        title = $2,
        make = $3,
        model = $4,
        year = $5,
        price = $6,
        description = $7,
        featured = $8,
        availability_status = $9
      WHERE car_id = $10
      RETURNING *
    `;

    const carResult = await client.query(carSql, [
      categoryId,
      title,
      make,
      model,
      year,
      price,
      description,
      featured,
      availabilityStatus,
      carId
    ]);

    const car = carResult.rows[0];

    if (!car) {
      await client.query("ROLLBACK");
      return null;
    }

    const existingPrimaryImageSql = `
      SELECT image_id
      FROM car_images
      WHERE car_id = $1
      ORDER BY is_primary DESC, image_id ASC
      LIMIT 1
    `;
    const existingPrimaryImageResult = await client.query(
      existingPrimaryImageSql,
      [carId]
    );
    const existingPrimaryImage = existingPrimaryImageResult.rows[0];

    if (imageUrl) {
      if (existingPrimaryImage) {
        const updateImageSql = `
          UPDATE car_images
          SET image_url = $1,
              alt_text = $2,
              is_primary = true
          WHERE image_id = $3
        `;
        await client.query(updateImageSql, [
          imageUrl,
          imageAltText || `${year} ${make} ${model}`,
          existingPrimaryImage.image_id
        ]);
      } else {
        const insertImageSql = `
          INSERT INTO car_images (car_id, image_url, alt_text, is_primary)
          VALUES ($1, $2, $3, true)
        `;
        await client.query(insertImageSql, [
          carId,
          imageUrl,
          imageAltText || `${year} ${make} ${model}`
        ]);
      }
    }

    await client.query("COMMIT");
    return car;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteCarById(carId) {
  const sql = `
    DELETE FROM cars
    WHERE car_id = $1
    RETURNING *
  `;
  const result = await pool.query(sql, [carId]);
  return result.rows[0];
}