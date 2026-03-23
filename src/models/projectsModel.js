import pool from "../db/database.js";

export async function createProject({ userId, carId, title, description, startedOn, targetCompletion }) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const projectSql = `
      INSERT INTO restoration_projects (
        user_id,
        car_id,
        title,
        description,
        current_status,
        started_on,
        target_completion
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const projectResult = await client.query(projectSql, [
      userId,
      carId,
      title,
      description,
      "submitted",
      startedOn || null,
      targetCompletion || null
    ]);

    const project = projectResult.rows[0];

    await client.query(
      `
        INSERT INTO project_status_history (project_id, status, notes, changed_by)
        VALUES ($1, $2, $3, $4)
      `,
      [project.project_id, "submitted", "Project created by user.", userId]
    );

    await client.query("COMMIT");
    return project;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getProjectsByUserId(userId) {
  const sql = `
    SELECT rp.*, c.make, c.model, c.year, cat.category_name
    FROM restoration_projects rp
    JOIN cars c ON rp.car_id = c.car_id
    JOIN categories cat ON c.category_id = cat.category_id
    WHERE rp.user_id = $1
    ORDER BY rp.project_id DESC
  `;
  const result = await pool.query(sql, [userId]);
  return result.rows;
}

export async function getAllProjects() {
  const sql = `
    SELECT
      rp.*,
      c.make,
      c.model,
      c.year,
      cat.category_name,
      u.first_name,
      u.last_name,
      u.email
    FROM restoration_projects rp
    JOIN cars c ON rp.car_id = c.car_id
    JOIN categories cat ON c.category_id = cat.category_id
    JOIN users u ON rp.user_id = u.user_id
    ORDER BY rp.project_id DESC
  `;
  const result = await pool.query(sql);
  return result.rows;
}

export async function getProjectById(projectId) {
  const sql = `
    SELECT
      rp.*,
      c.make,
      c.model,
      c.year,
      cat.category_name,
      u.first_name,
      u.last_name,
      u.email
    FROM restoration_projects rp
    JOIN cars c ON rp.car_id = c.car_id
    JOIN categories cat ON c.category_id = cat.category_id
    JOIN users u ON rp.user_id = u.user_id
    WHERE rp.project_id = $1
  `;
  const result = await pool.query(sql, [projectId]);
  return result.rows[0];
}

export async function getProjectStatusHistory(projectId) {
  const sql = `
    SELECT
      psh.*,
      u.first_name,
      u.last_name
    FROM project_status_history psh
    LEFT JOIN users u ON psh.changed_by = u.user_id
    WHERE psh.project_id = $1
    ORDER BY psh.history_id DESC
  `;
  const result = await pool.query(sql, [projectId]);
  return result.rows;
}

export async function updateProject(projectId, userId, { title, description, startedOn, targetCompletion }) {
  const sql = `
    UPDATE restoration_projects
    SET title = $1,
        description = $2,
        started_on = $3,
        target_completion = $4,
        updated_at = CURRENT_TIMESTAMP
    WHERE project_id = $5 AND user_id = $6
    RETURNING *
  `;

  const result = await pool.query(sql, [
    title,
    description,
    startedOn || null,
    targetCompletion || null,
    projectId,
    userId
  ]);

  return result.rows[0];
}

export async function deleteProject(projectId, userId) {
  const sql = `
    DELETE FROM restoration_projects
    WHERE project_id = $1 AND user_id = $2
    RETURNING *
  `;
  const result = await pool.query(sql, [projectId, userId]);
  return result.rows[0];
}

export async function updateProjectStatus(projectId, statusName, notes, changedBy) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const projectResult = await client.query(
      `
        UPDATE restoration_projects
        SET current_status = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE project_id = $2
        RETURNING *
      `,
      [statusName, projectId]
    );

    const project = projectResult.rows[0];

    if (!project) {
      throw new Error("Project not found.");
    }

    await client.query(
      `
        INSERT INTO project_status_history (project_id, status, notes, changed_by)
        VALUES ($1, $2, $3, $4)
      `,
      [projectId, statusName, notes || null, changedBy]
    );

    await client.query("COMMIT");
    return project;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function countProjectsByUserId(userId) {
  const sql = `
    SELECT COUNT(*)::int AS total_projects
    FROM restoration_projects
    WHERE user_id = $1
  `;
  const result = await pool.query(sql, [userId]);
  return result.rows[0]?.total_projects || 0;
}