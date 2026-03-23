-- =========================
-- ROLES
-- =========================
INSERT INTO roles (role_name)
VALUES
  ('admin'),
  ('moderator'),
  ('user')
ON CONFLICT DO NOTHING;

-- =========================
-- USERS
-- Password = password123 (bcrypt hash)
-- =========================
INSERT INTO users (first_name, last_name, email, password_hash, role_id)
VALUES
  ('Admin', 'User', 'admin@test.com', '$2a$10$7a0jQ0d8t8dV7L8x5k6c5eGqv6y5yH9lFzj0wQ2z7b2Q6e4k6yG5a', 1),
  ('Mod', 'User', 'mod@test.com', '$2a$10$7a0jQ0d8t8dV7L8x5k6c5eGqv6y5yH9lFzj0wQ2z7b2Q6e4k6yG5a', 2),
  ('Normal', 'User', 'user@test.com', '$2a$10$7a0jQ0d8t8dV7L8x5k6c5eGqv6y5yH9lFzj0wQ2z7b2Q6e4k6yG5a', 3)
ON CONFLICT DO NOTHING;

-- =========================
-- CATEGORIES
-- =========================
INSERT INTO categories (category_name)
VALUES
  ('Muscle'),
  ('Classic'),
  ('Vintage'),
  ('Sports')
ON CONFLICT DO NOTHING;

-- =========================
-- CARS
-- =========================
INSERT INTO cars (category_id, make, model, year, price, description)
VALUES
  (1, 'Ford', 'Mustang', 1967, 35000, 'Classic American muscle car.'),
  (1, 'Chevrolet', 'Camaro', 1969, 40000, 'Iconic muscle performance.'),
  (2, 'Volkswagen', 'Beetle', 1965, 15000, 'Timeless compact classic.'),
  (4, 'Porsche', '911', 1985, 60000, 'Legendary sports car.')
ON CONFLICT DO NOTHING;

-- =========================
-- RESTORATION PROJECTS
-- =========================
INSERT INTO restoration_projects
(user_id, car_id, title, description, current_status, started_on)
VALUES
  (3, 1, 'Mustang Full Restore', 'Complete engine rebuild and interior restoration.', 'submitted', '2026-01-01'),
  (3, 2, 'Camaro Paint Job', 'Repainting and bodywork.', 'approved', '2026-02-01'),
  (3, 3, 'Beetle Fix Up', 'Basic maintenance and cosmetic improvements.', 'in progress', '2026-02-15')
ON CONFLICT DO NOTHING;

-- =========================
-- STATUS HISTORY
-- =========================
INSERT INTO project_status_history
(project_id, status, notes, changed_by)
VALUES
  (1, 'submitted', 'Initial submission.', 3),
  (2, 'submitted', 'Initial submission.', 3),
  (2, 'approved', 'Looks good to proceed.', 2),
  (3, 'submitted', 'Initial submission.', 3),
  (3, 'approved', 'Approved quickly.', 2),
  (3, 'in progress', 'Work has started.', 2)
ON CONFLICT DO NOTHING;