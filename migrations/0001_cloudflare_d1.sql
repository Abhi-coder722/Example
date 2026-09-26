-- The Pages Function also runs this idempotently so a newly bound D1 database
-- works on its first request. Keep this migration for local Wrangler workflows.
CREATE TABLE IF NOT EXISTS bago_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  value TEXT NOT NULL
);
