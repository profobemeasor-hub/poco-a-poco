CREATE TABLE IF NOT EXISTS interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mode TEXT NOT NULL,
  learner_text TEXT NOT NULL,
  topic TEXT NOT NULL DEFAULT '',
  correction TEXT NOT NULL DEFAULT '',
  tip TEXT NOT NULL DEFAULT '',
  vocabulary_json TEXT NOT NULL DEFAULT '[]',
  score INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_interactions_created_at ON interactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interactions_mode ON interactions(mode);
