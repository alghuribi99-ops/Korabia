CREATE TABLE IF NOT EXISTS car_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  category TEXT NOT NULL,
  model TEXT NOT NULL,
  budget TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_car_requests_created_at ON car_requests (created_at);
