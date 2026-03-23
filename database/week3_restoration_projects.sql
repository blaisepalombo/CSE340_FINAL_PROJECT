-- Week 3 restoration project workflow tables
-- Run this against your PostgreSQL database before using the new project routes.

CREATE TABLE IF NOT EXISTS restoration_projects (
  project_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  car_id INT NOT NULL REFERENCES cars(car_id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  current_status VARCHAR(30) NOT NULL DEFAULT 'submitted',
  started_on DATE,
  target_completion DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_status_history (
  history_id SERIAL PRIMARY KEY,
  project_id INT NOT NULL REFERENCES restoration_projects(project_id) ON DELETE CASCADE,
  status_name VARCHAR(30) NOT NULL,
  notes TEXT,
  changed_by INT REFERENCES users(user_id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_restoration_projects_user_id
  ON restoration_projects(user_id);

CREATE INDEX IF NOT EXISTS idx_restoration_projects_car_id
  ON restoration_projects(car_id);

CREATE INDEX IF NOT EXISTS idx_project_status_history_project_id
  ON project_status_history(project_id);