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
-- Password for all seeded users: P@$$w0rd!
-- bcrypt hash for P@$$w0rd!
-- =========================
INSERT INTO users (first_name, last_name, email, password_hash, role_id)
VALUES
  ('Admin', 'User', 'admin@test.com', '$2b$10$OWjr4C4rgaeNq/LjmFzzZ.tojU3nfEWt60/ybVlmuZDAUn0uo1M9m', 1),
  ('Mod', 'User', 'mod@test.com', '$2b$10$OWjr4C4rgaeNq/LjmFzzZ.tojU3nfEWt60/ybVlmuZDAUn0uo1M9m', 2),
  ('Normal', 'User', 'user@test.com', '$2b$10$OWjr4C4rgaeNq/LjmFzzZ.tojU3nfEWt60/ybVlmuZDAUn0uo1M9m', 3)
ON CONFLICT DO NOTHING;

-- =========================
-- CATEGORIES
-- =========================
INSERT INTO categories (category_name, description)
VALUES
  ('Muscle', 'High-performance American muscle cars'),
  ('Sports', 'Performance sports cars'),
  ('Classic', 'Timeless classic vehicles')
ON CONFLICT DO NOTHING;

-- =========================
-- CARS
-- =========================
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
VALUES
  (1, '1970 Dodge Challenger R/T', 'Dodge', 'Challenger R/T', 1970, 55000, 'Classic American muscle car with aggressive styling.', true, 'available'),
  (2, '1969 Chevrolet Corvette Stingray', 'Chevrolet', 'Corvette Stingray', 1969, 65000, 'Iconic sports car known for its sleek design.', true, 'available'),
  (1, '1969 Ford Mustang Boss 429', 'Ford', 'Mustang Boss 429', 1969, 70000, 'Rare and powerful Mustang built for performance.', true, 'available')
ON CONFLICT DO NOTHING;

-- =========================
-- CAR IMAGES
-- =========================
INSERT INTO car_images (car_id, image_url, alt_text, is_primary)
VALUES
  (1, '/images/challenger-rt.jpg', 'Dodge Challenger R/T', true),
  (2, '/images/corvette-stingray.jpg', 'Chevrolet Corvette Stingray', true),
  (3, '/images/mustang-boss-429.jpg', 'Ford Mustang Boss 429', true)
ON CONFLICT DO NOTHING;

-- =========================
-- RESTORATION PROJECTS
-- =========================
INSERT INTO restoration_projects
(user_id, car_id, title, description, current_status, started_on, submitted_at, updated_at, created_at)
VALUES
  (3, 1, 'Challenger Engine Rebuild', 'Full engine teardown and rebuild with new gaskets, hoses, and tuning.', 'submitted', '2026-01-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 2, 'Corvette Interior Restore', 'Replacing seats, carpet, trim, and refreshing the interior panels.', 'approved', '2026-02-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 3, 'Mustang Performance Upgrade', 'Upgrading the engine, suspension, and brakes for better drivability.', 'in_progress', '2026-02-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- =========================
-- STATUS HISTORY
-- =========================
INSERT INTO project_status_history
(project_id, status, notes, changed_by, changed_at, created_at)
VALUES
  (1, 'submitted', 'Initial submission.', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  (2, 'submitted', 'Initial submission.', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 'approved', 'Approved by moderator.', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  (3, 'submitted', 'Initial submission.', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 'approved', 'Approved for work.', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 'in_progress', 'Work has started.', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- =========================
-- COMMENTS
-- =========================
INSERT INTO comments (user_id, car_id, comment_text, created_at, updated_at)
VALUES
  (3, 1, 'Love the aggressive styling on this Challenger. Perfect starting point for a restoration.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 2, 'The Stingray interior on this one would be a really fun project to bring back to life.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 3, 'Solid foundation here. This Mustang could become an incredible performance build.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;