CREATE TABLE IF NOT EXISTS admin_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
