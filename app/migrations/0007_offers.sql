CREATE TABLE IF NOT EXISTS offers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  mileage INTEGER,
  price TEXT,
  transmission TEXT,
  fuel TEXT,
  color TEXT,
  note TEXT,
  images TEXT NOT NULL DEFAULT '[]',
  published_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  hidden INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_offers_expires_at ON offers (expires_at);
